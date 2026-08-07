/* =========================================================
   assets/js/modules/cart.js
   Phase 1 Step 4 — moved verbatim from index.html's main
   <script> block. Each function's body is byte-for-byte
   identical to the original; only `function` was changed to
   `export function` on each declaration line.

   These functions reference several identifiers that remain
   declared in index.html (not moved, per the Step 4 rules):
     - `cart` (let, shopping cart state)
     - `b2bMode` (let, B2B pricing toggle state)
     - `PRODUCTS`, `dict` (exposed on window in Step 3)
     - `unitPrice()`, `updateOrderSummary()`, `trackEvent()`
       (function declarations left in index.html)
   No reference was rewritten — see the Step 4 delivery report
   for why these resolve correctly without a window/globalThis
   rewrite.
========================================================= */

export function addToCart(id, btn, qty) {
    qty = qty || (b2bMode ? PRODUCTS[id].moq : 1);
    if (b2bMode) qty = Math.max(qty, PRODUCTS[id].moq);
    cart[id] = (cart[id] || 0) + qty;
    renderCart();

    trackEvent('add_to_cart', {
      product_id: id,
      title: PRODUCTS[id] ? PRODUCTS[id].title : null,
      quantity: qty,
      unit_price: PRODUCTS[id] ? unitPrice(id) : null,
      b2b_mode: b2bMode
    });

    if (btn) {
      const icon = btn.innerHTML;
      btn.classList.add('added');
      btn.innerHTML = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = icon;
      }, 900);
    }
  }

export function changeCartQty(id, delta) {
    if (!cart[id]) return;
    const moq = PRODUCTS[id].moq;
    const next = cart[id] + delta;
    if (b2bMode && delta < 0 && next < moq && next > 0) return; // can't drop below MOQ, must remove instead
    cart[id] = next;
    if (cart[id] <= 0) delete cart[id];
    renderCart();
  }

export function removeFromCart(id) {
    delete cart[id];
    renderCart();
  }

export function cartSubtotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => sum + unitPrice(id) * qty, 0);
  }

export function cartItemCount() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }

export function renderCart() {
    const count = cartItemCount();
    document.getElementById('cart-badge').textContent = count;

    const list = document.getElementById('cart-items');
    const empty = document.getElementById('cart-empty');
    const ids = Object.keys(cart);

    if (ids.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
    } else {
      empty.classList.add('hidden');
      const lang = document.documentElement.lang === 'ar' ? 'ar' : 'fr';
      const currency = dict[lang].currency || 'DA';
      const perUnitLabel = dict[lang].cart_per_unit || '/ unité';
      const moqLabel = (dict[lang].pm_moq_label || 'Minimum') + ' ';
      const moqUnit = dict[lang].pm_moq_unit || 'unités';
      list.innerHTML = ids.map(id => {
        const p = PRODUCTS[id];
        const qty = cart[id];
        const price = unitPrice(id);
        return `
        <div class="flex gap-3 py-4 border-b border-line">
          <div class="w-16 h-16 rounded-xl overflow-hidden bg-paper2 shrink-0">
            <img src="${p.images[0]}" loading="lazy" decoding="async" class="w-full h-full object-cover" onerror="imgFallback(this)">
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-ink truncate">${p.title}</p>
            <p class="text-xs ${b2bMode ? 'text-clayDk font-semibold' : 'text-ink2'} mt-0.5">${price.toLocaleString('fr-FR')} ${currency} ${b2bMode ? `<span class="text-ink2/60 font-normal">${perUnitLabel}</span>` : ''}</p>
            ${b2bMode ? `<p class="text-[10px] font-semibold text-sageDk mt-0.5">${moqLabel}${p.moq} ${moqUnit}</p>` : ''}
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center border border-line rounded-full">
                <button onclick="changeCartQty('${id}',-1)" class="w-7 h-7 flex items-center justify-center text-ink2 hover:text-clay" aria-label="Diminuer">−</button>
                <span class="w-6 text-center text-xs font-semibold text-ink">${qty}</span>
                <button onclick="changeCartQty('${id}',1)" class="w-7 h-7 flex items-center justify-center text-ink2 hover:text-clay" aria-label="Augmenter">+</button>
              </div>
              <button onclick="removeFromCart('${id}')" class="text-ink2/60 hover:text-clay transition-colors" aria-label="Supprimer">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>
              </button>
            </div>
          </div>
        </div>`;
      }).join('');
    }

    updateOrderSummary();
  }

export function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (open) {
      overlay.classList.remove('hidden');
      requestAnimationFrame(() => drawer.classList.remove('translate-x-full'));
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.add('translate-x-full');
      document.body.style.overflow = '';
      setTimeout(() => overlay.classList.add('hidden'), 300);
    }
    trackEvent('toggle_cart_drawer', { open, item_count: cartItemCount() });
  }

