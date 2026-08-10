/* =========================================================
   providers/supabase/client.js
   Phase 2 Step 2 — moved verbatim from index.html's dedicated
   "ORDER SUBMISSION" <script> block. Pure Supabase client
   initialization ONLY — SUPABASE_URL, SUPABASE_ANON_KEY, and
   the try/catch that creates _supabase from window.supabase.
   createClient(). No order-specific or REST-fallback logic
   lives here (that belongs in order.provider.js per this
   step's scope).

   Every line below is byte-for-byte identical to the original
   except for the `export` keyword added to `SUPABASE_URL`,
   `SUPABASE_ANON_KEY`, and `_supabase` (the latter two needed
   by order.provider.js's REST fallback functions).
========================================================= */

export const SUPABASE_URL = 'https://gmzpphbykcctmwemucwl.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_0UpaPyTtQX0rjOT1ZHaVRg_IavFVm0p';

  // ---- 1) Try to init the official client ----
export let _supabase = null;
  try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (initErr) {
    _supabase = null;
    console.error('[Supabase init]', initErr);
  }
