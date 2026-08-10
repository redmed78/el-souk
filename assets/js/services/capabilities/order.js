/* =========================================================
   capabilities/order.js
   ACTIVE — public order capability. Resolves its
   implementation through registry.js only; never imports a
   provider directly.
========================================================= */

import { registry } from '../registry.js';

export const order = {
  create: (...args) => registry.order.implementation.create(...args)
};
