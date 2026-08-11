/* =========================================================
   providers/supabase/product.provider.js
   Phase 2 Step 3 — new Supabase provider for the 'product'
   capability. Fetches from the `products` table and maps rows
   to the exact same shape as the static PRODUCTS object in
   assets/js/data/products.js (title, category, ref, price,
   oldPrice, wholesalePrice, moq, stock, rating, reviews,
   images, description, dimensions, care), keyed by id.

   This provider does NOT know about the static fallback — that
   is the capability's (product.js) responsibility, per this
   step's explicit instructions. On any failure this returns
   null; it never throws and never substitutes/fabricates data.

   NOTE: the existence and exact schema of a `products` table in
   the live Supabase project has NOT been verified in this
   environment (no database/network access here). The column
   mapping below follows the "Expected table structure" given
   in this step's instructions. If the table doesn't exist, this
   fetch will simply fail at runtime and getAll() falls back to
   the static PRODUCTS object automatically — see product.js.
========================================================= */

import { _supabase } from './client.js';

export async function getAllProducts() {
  if (!_supabase) return null;
  try {
    const { data, error } = await _supabase.from('products').select('*');
    if (error || !data) {
      console.error('[product.provider] Supabase fetch failed:', error);
      return null;
    }
    const mapped = {};
    data.forEach(row => {
      if (!row || !row.id) return;
      mapped[row.id] = {
        title: row.title,
        category: row.category,
        ref: row.ref,
        price: row.price,
        oldPrice: row.old_price,
        wholesalePrice: row.wholesale_price,
        moq: row.moq,
        stock: row.stock,
        rating: row.rating,
        reviews: row.reviews,
        images: row.images,
        description: row.description,
        dimensions: row.dimensions,
        care: row.care
      };
    });
    return mapped;
  } catch (err) {
    console.error('[product.provider] unexpected error:', err);
    return null;
  }
}
