/* =========================================================
   providers/supabase/order.provider.js
   Phase 2 Step 2 — moved verbatim from index.html's dedicated
   "ORDER SUBMISSION" <script> block. Every function body below
   is byte-for-byte identical to the original. Per this step's
   scope, the REST fallback functions (insertOrderHeaderViaRest,
   insertOrderItemsViaRest) live here — client.js is pure
   Supabase client initialization only.

   Per this step's explicit "alias, not wrapper" instruction,
   submitOrderToSupabase itself is NOT renamed and NOT wrapped —
   it is exported under its public interface name via a pure
   export-rename at the very end of this file:
     export { submitOrderToSupabase as createOrder };

   ORDER_ITEM_COLUMN_CANDIDATES and resolvedItemColumns are
   exported (only their `const`/`let` keyword gained an `export`
   prefix); insertOrderHeaderViaRest and insertOrderItemsViaRest
   likewise only gained an `export` prefix. All other helper
   functions (defaultItemColumnMapping, buildItemRows,
   extractMissingColumn, nextCandidateForField,
   insertOrderItemsAdaptive) are internal to this module and are
   not exported — none of them are called from outside this file.

   Depends on _supabase, already moved to ./client.js.
========================================================= */

import { _supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './client.js';

export async function insertOrderHeaderViaRest(payload) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let bodyText = '';
      try { bodyText = await res.text(); } catch (_) {}
      let parsed;
      try { parsed = JSON.parse(bodyText); } catch (_) { parsed = { raw: bodyText }; }
      alert('SUPABASE ERROR: ' + JSON.stringify(parsed || res));
      const err = new Error('REST orders insert failed (' + res.status + ' ' + res.statusText + ')');
      err.details = parsed;
      err.status = res.status;
      throw err;
    }
    const rows = await res.json();
    return rows && rows[0] ? rows[0] : null;
  }

export async function insertOrderItemsViaRest(rows) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(rows)
    });

    if (!res.ok) {
      let bodyText = '';
      try { bodyText = await res.text(); } catch (_) {}
      let parsed;
      try { parsed = JSON.parse(bodyText); } catch (_) { parsed = { raw: bodyText }; }
      const err = new Error('REST order_items insert failed (' + res.status + ' ' + res.statusText + ')');
      err.details = parsed;
      err.status = res.status;
      throw err;
    }
    return true;
  }

  // =========================================================
  // ADAPTIVE order_items COLUMN RESOLUTION
  // =========================================================
  // Your `order_items` table's real column names might not match the
  // "standard" ones we guess first (e.g. `name` instead of `product_name`,
  // `qty` instead of `quantity`). Rather than fail outright, this tries each
  // candidate name in order, reads Postgres's own "column not found"
  // response (PGRST204) to learn which one is wrong, swaps in the next
  // candidate for THAT field only, and retries — then remembers the winning
  // combination so every submission after the first one goes straight there
  // with zero retries.
export const ORDER_ITEM_COLUMN_CANDIDATES = {
    order_id:    ['order_id', 'orderId', 'order'],
    product_name:['product_name', 'name', 'item_name', 'title', 'product'],
    quantity:    ['quantity', 'qty', 'amount'],
    unit_price:  ['unit_price', 'price', 'unitPrice', 'product_price'],
    total_price: ['total_price', 'line_total', 'subtotal', 'total']
  };

export let resolvedItemColumns = null; // cached mapping once discovered, e.g. { order_id:'order_id', product_name:'name', ... }

  function defaultItemColumnMapping() {
    const mapping = {};
    Object.keys(ORDER_ITEM_COLUMN_CANDIDATES).forEach(field => {
      mapping[field] = ORDER_ITEM_COLUMN_CANDIDATES[field][0];
    });
    return mapping;
  }

  function buildItemRows(orderId, items, mapping) {
    return items.map(item => ({
      [mapping.order_id]: orderId,
      [mapping.product_name]: item.name,
      [mapping.quantity]: item.qty,
      [mapping.unit_price]: item.price,
      [mapping.total_price]: item.price * item.qty
    }));
  }

  // Extracts the offending column name from a PostgREST "column not found"
  // response — works for both the JS-client error object and the raw REST
  // fallback's parsed JSON body, since PostgREST uses the same message shape
  // either way: "Could not find the 'x' column of 'order_items' in the schema cache"
  function extractMissingColumn(error) {
    const msg = (error && (error.message || (error.details && error.details.message))) || '';
    const match = msg.match(/Could not find the '([^']+)' column/i);
    return match ? match[1] : null;
  }

  function nextCandidateForField(field, rejectedName) {
    const candidates = ORDER_ITEM_COLUMN_CANDIDATES[field] || [];
    const rejectedIdx = candidates.indexOf(rejectedName);
    return candidates[rejectedIdx + 1] || null; // null = no more alternatives left to try
  }

  // Tries the insert with the current mapping; on a "column not found" error,
  // advances exactly the offending field to its next candidate name and
  // retries — up to a safety cap of attempts (covers every field getting
  // remapped once, plus a little headroom).
  async function insertOrderItemsAdaptive(orderId, items) {
    let mapping = resolvedItemColumns ? { ...resolvedItemColumns } : defaultItemColumnMapping();
    const maxAttempts = Object.keys(ORDER_ITEM_COLUMN_CANDIDATES).length * 3;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const rows = buildItemRows(orderId, items, mapping);

      let error = null;
      if (_supabase) {
        const result = await _supabase.from('order_items').insert(rows);
        error = result.error;
      } else {
        try {
          await insertOrderItemsViaRest(rows);
        } catch (err) {
          error = err.details || { message: err.message };
        }
      }

      if (!error) {
        resolvedItemColumns = mapping; // remember what worked, skip retries next time
        return true;
      }

      const missingColumn = extractMissingColumn(error);
      if (!missingColumn) {
        // Not a "column not found" error (e.g. a NOT NULL violation, a
        // permissions issue) — retrying different names won't fix this,
        // so surface it immediately instead of masking it with more retries.
        console.error('[Supabase order_items insert]', error);
        alert('SUPABASE ERROR: ' + JSON.stringify(error));
        const thrown = new Error('order_items insert failed');
        thrown.details = error;
        throw thrown;
      }

      // Find which logical field this rejected column name belongs to.
      const field = Object.keys(mapping).find(f => mapping[f] === missingColumn);
      const next = field ? nextCandidateForField(field, missingColumn) : null;

      if (!field || !next) {
        // Ran out of guesses for this field — tell the developer exactly
        // what we tried so they can add the real column name in 5 seconds.
        console.error('[Supabase order_items insert] exhausted candidates', { field, mapping, error });
        alert(
          'SUPABASE ERROR: could not find a working column for "' + (field || missingColumn) + '" in order_items. ' +
          'Tried: ' + JSON.stringify(ORDER_ITEM_COLUMN_CANDIDATES[field] || [missingColumn]) + '. ' +
          'Add ORDER_ITEM_COLUMN_CANDIDATES.' + (field || 'product_name') + ' with your real column name in the script.'
        );
        const thrown = new Error('order_items: no matching column found');
        thrown.details = error;
        throw thrown;
      }

      console.warn(`[Supabase order_items] column "${missingColumn}" not found for "${field}" — retrying with "${next}"`);
      mapping = { ...mapping, [field]: next };
    }

    throw new Error('order_items insert failed after exhausting all column-name candidates');
  }

  // ---- Shared 2-step order submission — used by BOTH the store checkout
  // (placeOrder) and the landing page checkout (submitLandingOrder), so the
  // two forms can never drift out of sync with the database structure again.
  //
  // STEP 1: insert the order header into `orders`, get back its generated id.
  // STEP 2: insert one row per cart line into `order_items`, linked by that id
  //         — column names are resolved adaptively, see insertOrderItemsAdaptive().
  //
  // orderHeader: { user_name, phone, wilaya, commune, address, total_amount, is_b2b, status }
  // items: [{ name, qty, price }, ...]
  async function submitOrderToSupabase(orderHeader, items) {
    let orderId = null;

    if (!_supabase) {
      alert('INIT ERROR');
      const createdOrder = await insertOrderHeaderViaRest(orderHeader); // throws + alerts internally on failure
      orderId = createdOrder ? createdOrder.id : null;

      if (orderId && items && items.length > 0) {
        await insertOrderItemsAdaptive(orderId, items);
      }
      return orderId;
    }

    // STEP 1 — order header
    const { data: orderData, error: orderError } = await _supabase
      .from('orders')
      .insert([orderHeader])
      .select();

    if (orderError) {
      console.error('[Supabase orders insert]', orderError);
      alert('SUPABASE ERROR: ' + JSON.stringify(orderError));
      throw orderError;
    }

    orderId = orderData && orderData[0] ? orderData[0].id : null;

    // STEP 2 — order line items, linked to the header via order_id
    if (orderId && items && items.length > 0) {
      await insertOrderItemsAdaptive(orderId, items); // throws + alerts internally on unrecoverable failure
    }

    return orderId;
  }

export { submitOrderToSupabase as createOrder };
