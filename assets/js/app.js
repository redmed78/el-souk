/* =========================================================
   assets/js/app.js
   Phase 1 Step 3 — application entry point (bootstrap only).
   This file does NOT yet contain any business logic.
   All existing functionality (cart, checkout, filters, B2B,
   AI chat, landing page, Supabase) still lives inline in
   index.html, exactly as before this step.

   Business logic will be moved into this structure starting
   in Phase 2, per FINAL_REFACTOR_BLUEPRINT.md.
========================================================= */

import './state.js';
import { PRODUCTS } from './data/products.js';
import { WILAYAS, ZONE_FEES, COMMUNES_BY_WILAYA } from './data/wilayas.js';
import { dict } from './data/translations.js';

// Compatibility bridge: index.html's existing inline functions
// (addToCart, openProductModal, renderCart, applyProductFilters,
// populateWilayas, setLang, etc.) still reference these as bare
// globals. Module scripts run before DOMContentLoaded, so these
// are available on window well before any of that code executes.
window.PRODUCTS = PRODUCTS;
window.WILAYAS = WILAYAS;
window.ZONE_FEES = ZONE_FEES;
window.COMMUNES_BY_WILAYA = COMMUNES_BY_WILAYA;
window.dict = dict;

console.log("Dar&Deco Phase 1 initialized");
