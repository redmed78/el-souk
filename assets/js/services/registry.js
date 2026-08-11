/* =========================================================
   services/registry.js
   Phase 2 Step 2 — the single provider-resolution point.
   Maps each capability to its currently active provider
   implementation. Today: Supabase for 'order', 'analytics',
   and 'product' (Phase 2 Step 3). Adding a future provider
   means changing what's imported/mapped here — never the
   capability files, never the application/UI code.
========================================================= */

import { trackEvent, getSessionId } from './providers/supabase/analytics.provider.js';
import { createOrder } from './providers/supabase/order.provider.js';
import { getAllProducts } from './providers/supabase/product.provider.js';

export const registry = {
  analytics: {
    provider: 'supabase',
    implementation: {
      track: trackEvent,
      getSessionId
    }
  },
  order: {
    provider: 'supabase',
    implementation: {
      create: createOrder
    }
  },
  product: {
    provider: 'supabase',
    implementation: {
      getAll: getAllProducts
    }
  }
};
