/* =========================================================
   assets/js/modules/modal.js
   Phase 1 Step 5 — moved verbatim from index.html's main
   <script> block. Each function's body is byte-for-byte
   identical to the original; only `function` was changed to
   `export function` on each declaration line.

   Cross-module import (rule 14): modalAddToCart() and
   modalBuyNow() call addToCart() and toggleCartDrawer(), both
   already extracted into ./cart.js in Step 4 — imported below
   rather than duplicated or wrapped.

   These functions also reference identifiers that remain
   declared in index.html (not moved, per the Step 5 rules):
     - `currentProduct`, `modalQty` (let, modal state — note
       these are not just READ but directly REASSIGNED by
       openProductModal/renderModalPricing/changeModalQty)
     - `b2bMode` (let, B2B pricing toggle state)
     - `PRODUCTS` (exposed on window in Step 3)
     - `trackEvent()`, `imgFallback()` (function declarations
       left in index.html)
   No reference was rewritten — see the Step 5 delivery report
   for why these resolve correctly without a window/globalThis
   rewrite, and for the one point still flagged for live
   browser verification.
========================================================= */

import { addToCart, toggleCartDrawer } from './cart.js';

export function openProductModal(id) {
    const p = PRODUCTS[id];
    if (!p) return;
    currentProduct = id;
    modalQty = 1;

    if (b2bMode) modalQty = p.moq;

    // This single modal serves as both the "product click-through" and the
    // "quick view" surface in our SPA catalog (no separate PDP navigation),
    // so both event names are logged together for the same user action.
    trackEvent('click_product', { product_id: id, title: p.title, category: p.category, price: p.price });
    trackEvent('open_quick_view', { product_id: id, title: p.title, category: p.category, price: p.price, b2b_mode: b2bMode });

    document.getElementById('pm-category').textContent = p.category;
    document.getElementById('pm-title').textContent = p.title;
    document.getElementById('pm-ref').textContent = 'Réf. ' + p.ref;
    document.getElementById('pm-reviews').textContent = '(' + p.reviews + ' avis)';
    document.getElementById('pm-qty').textContent = modalQty;
    renderModalPricing(p);
    document.getElementById('pm-desc').textContent = p.description;
    document.getElementById('pm-dims').textContent = p.dimensions;
    document.getElementById('pm-care').textContent = p.care;

    const stockBadge = document.getElementById('pm-stock');
    if (p.stock === 'in') {
      stockBadge.textContent = 'En stock';
      stockBadge.className = 'inline-flex items-center gap-1.5 text-xs font-semibold text-sageDk bg-sage/15 px-3 py-1 rounded-full';
    } else {
      stockBadge.textContent = 'Stock limité';
      stockBadge.className = 'inline-flex items-center gap-1.5 text-xs font-semibold text-clayDk bg-clay/10 px-3 py-1 rounded-full';
    }

    // gallery
    const main = document.getElementById('pm-main-image');
    main.src = p.images[0];
    const thumbWrap = document.getElementById('pm-thumbs');
    thumbWrap.innerHTML = '';
    p.images.forEach((src, i) => {
      const btn = document.createElement('button');
      btn.className = 'thumb w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 ' + (i === 0 ? 'border-clay' : 'border-line');
      btn.innerHTML = `<img src="${src}" loading="lazy" decoding="async" class="w-full h-full object-cover" onerror="imgFallback(this)">`;
      btn.onclick = () => {
        main.src = src;
        thumbWrap.querySelectorAll('.thumb').forEach(t => t.classList.remove('border-clay'));
        thumbWrap.querySelectorAll('.thumb').forEach(t => t.classList.add('border-line'));
        btn.classList.remove('border-line');
        btn.classList.add('border-clay');
      };
      thumbWrap.appendChild(btn);
    });

    // reset accordion to first tab open
    document.querySelectorAll('.pm-accordion').forEach((el, i) => {
      el.open = i === 0;
    });

    document.getElementById('product-modal-overlay').classList.remove('hidden');
    requestAnimationFrame(() => {
      document.getElementById('product-modal-panel').classList.remove('opacity-0', 'scale-95');
    });
    document.body.style.overflow = 'hidden';
  }

export function closeProductModal() {
    document.getElementById('product-modal-panel').classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      document.getElementById('product-modal-overlay').classList.add('hidden');
      document.body.style.overflow = '';
    }, 200);
  }

export function renderModalPricing(p) {
    const floor = b2bMode ? p.moq : 1;
    if (b2bMode) {
      document.getElementById('pm-price').textContent = p.wholesalePrice.toLocaleString('fr-FR') + ' DA';
      document.getElementById('pm-old-price').textContent = p.price.toLocaleString('fr-FR') + ' DA (détail)';
      document.getElementById('pm-old-price').classList.remove('hidden');
      document.getElementById('pm-moq').classList.remove('hidden');
      document.getElementById('pm-moq-value').textContent = p.moq;
    } else {
      document.getElementById('pm-price').textContent = p.price.toLocaleString('fr-FR') + ' DA';
      document.getElementById('pm-old-price').textContent = p.oldPrice ? p.oldPrice.toLocaleString('fr-FR') + ' DA' : '';
      document.getElementById('pm-old-price').classList.toggle('hidden', !p.oldPrice);
      document.getElementById('pm-moq').classList.add('hidden');
    }
    modalQty = Math.max(floor, modalQty);
    document.getElementById('pm-qty').textContent = modalQty;
  }

export function changeModalQty(delta) {
    const floor = (b2bMode && currentProduct) ? PRODUCTS[currentProduct].moq : 1;
    modalQty = Math.max(floor, modalQty + delta);
    document.getElementById('pm-qty').textContent = modalQty;
  }

export function modalAddToCart() {
    if (!currentProduct) return;
    addToCart(currentProduct, null, modalQty);
    closeProductModal();
    toggleCartDrawer(true);
  }

export function modalBuyNow() {
    if (!currentProduct) return;
    addToCart(currentProduct, null, modalQty);
    closeProductModal();
    toggleCartDrawer(true);
  }

