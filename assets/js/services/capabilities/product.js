/* =========================================================
   capabilities/product.js
   Phase 2 Step 3 — public product capability. Resolves its
   provider through registry.js only (never imports
   providers/supabase/product.provider.js directly, per this
   step's explicit rule).

   getAll(): tries the registry-resolved provider; on success
   caches and returns the dynamic collection; on failure (or no
   provider mapped) falls back to the static PRODUCTS object
   from assets/js/data/products.js. The static object is never
   modified — only referenced as a fallback value.

   getById(id): reuses the already-resolved collection from
   getAll() (fetch-once, no separate per-product query), per
   this step's explicit instruction.
========================================================= */

import { registry } from '../registry.js';
import { PRODUCTS as STATIC_PRODUCTS } from '../../data/products.js';

let resolvedCollection = null;

export const product = {
  async getAll() {
    if (resolvedCollection) return resolvedCollection;
    const dynamic = await registry.product.implementation.getAll();
    resolvedCollection = dynamic || STATIC_PRODUCTS;
    return resolvedCollection;
  },
  async getById(id) {
    const collection = await product.getAll();
    return collection[id];
  }
};
