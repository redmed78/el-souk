/* =========================================================
   capabilities/analytics.js
   ACTIVE — public analytics capability. Resolves its
   implementation through registry.js only; never imports a
   provider directly.
========================================================= */

import { registry } from '../registry.js';

export const analytics = {
  track: (...args) => registry.analytics.implementation.track(...args),
  getSessionId: () => registry.analytics.implementation.getSessionId()
};
