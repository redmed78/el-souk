/* =========================================================
   assets/js/modules/data.js
   Phase 1 Step 10 — moved verbatim from index.html's main
   <script> block. Each function's body is byte-for-byte
   identical to the original; only `function` was changed to
   `export function` (and `let priceFilterTouched` to `export
   let priceFilterTouched`) on each declaration line. The
   initPriceSlider IIFE is reproduced exactly as it appeared —
   still self-executing, not exported (nothing needs to import
   an IIFE), preserving its immediately-invoked behavior.

   ---------------------------------------------------------
   TWO ITEMS FROM THE REQUESTED SCOPE WERE NOT MOVED:
   ---------------------------------------------------------
   1. getOrCreateSessionId() — NOT moved. index.html calls it
      synchronously, immediately, at classic-script top level:
      `const SESSION_ID = getOrCreateSessionId();` (this line
      is NOT inside any function or event listener). Classic
      <script> tags execute synchronously, in document order,
      as the parser reaches them — this happens BEFORE the
      deferred `<script type="module" src="assets/js/app.js">`
      even starts running. Had this function moved here,
      `window.getOrCreateSessionId` would not exist yet at the
      moment index.html tries to call it, throwing a
      ReferenceError on every single page load, before any
      other script on the page runs. This is a fundamentally
      different situation from every other function moved in
      Steps 4-10, all of which are only ever called later, from
      DOMContentLoaded or a user interaction — both of which
      happen after module scripts finish. SESSION_ID itself is
      not in this step's variable list either. Left untouched,
      unmoved, exactly as it was.

   2. isSubmittingOrder — NOT moved. Its only reader/writer is
      placeOrder() (Checkout/Supabase logic, index.html, lines
      ~2975/3032/3062), which this step's rule 6 explicitly
      forbids touching. None of the 10 functions moved into
      this file reference isSubmittingOrder at all — moving
      only the bare declaration would leave placeOrder() unable
      to reach it (a module's own top-level `let` is private to
      that module; a classic script cannot read it as a bare
      identifier, per the same mechanism documented in Step 9's
      aiChatStarted case). The only fix would require editing
      3 references inside placeOrder() itself, which is
      Checkout code and explicitly off-limits this step. Left
      untouched, unmoved, exactly as it was.

   Full reasoning for both, plus the Landing-variables check
   (currentLandingProduct / selectedLandPack / LAND_PACKS /
   isSubmittingLandingOrder — also NOT moved, same category of
   problem), is in the Step 10 delivery report.
   ---------------------------------------------------------

   CONSEQUENTIAL UPDATE TO AN ALREADY-EXTRACTED MODULE:
   ---------------------------------------------------------
   priceFilterTouched moved successfully — but filters.js
   (Step 6) reads it as a bare identifier. Since it now lives
   inside this module rather than in index.html's classic
   script, filters.js needed one new import added:
     import { priceFilterTouched } from './data.js';
   ES module imports of a `let` are live bindings, so
   filters.js's read-only usage continues to see live updates
   made by the initPriceSlider IIFE below with no other change
   to filters.js. See the Step 10 delivery report for the
   one-line diff applied to filters.js.
   ---------------------------------------------------------

   Cross-module imports (rule 14): updateOrderSummary() calls
   cartSubtotal(), already extracted into ./cart.js (Step 4) —
   imported below. It also calls cartRetailSubtotal(), which
   has NOT been extracted (still bare in index.html) — left
   untouched. The initPriceSlider IIFE's updateAndFilter() calls
   applyProductFilters(), already extracted into ./filters.js
   (Step 6) — imported below. syncWilayaFromCod()/
   updateOrderSummary()/updateCommunesForWilaya() call each
   other, and populateWilayas()/communesForWilaya() are also
   all internal to this module — no import needed for any of
   those.

   This module also references `WILAYAS`, `ZONE_FEES`,
   `COMMUNES_BY_WILAYA` (exposed on window in Step 3) and
   `b2bMode` (let, stays in index.html) as bare references.
   See the full dependency table in the Step 10 delivery report.
========================================================= */

import { cartSubtotal } from './cart.js';
import { applyProductFilters } from './filters.js';

  // Fallback for broken images so alt text never sits exposed over the layout
export function imgFallback(img) {
    img.onerror = null;
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
      '<rect width="400" height="400" fill="%23F1ECE0"/>' +
      '<g fill="none" stroke="%233A463E" stroke-width="6" opacity="0.35">' +
      '<rect x="80" y="110" width="240" height="180" rx="10"/>' +
      '<circle cx="150" cy="165" r="20"/>' +
      '<path d="M80 260l70-60 50 40 60-70 60 90"/>' +
      '</g></svg>'
    );
  }

  // =========================================================
  // TOAST NOTIFICATIONS — non-blocking, auto-dismissing
  // =========================================================
export function showToast(message, type = 'success', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) { alert(message); return; } // safety net if container is ever missing

    const icon = type === 'success'
      ? '<svg class="w-4 h-4 text-sage shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>'
      : '<svg class="w-4 h-4 text-clay shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>';

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type === 'success' ? 'success' : 'error');
    toast.innerHTML = icon + '<span class="text-sm leading-snug">' + message + '</span>';
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // The price slider's HTML default (max=8000) is narrower than the full catalog
  // price range (up to 9 400 DA). Mirrors the same convention as activeCategories():
  // until the shopper actually moves the slider, price does not filter anything.
export let priceFilterTouched = false;

export function populateWilayas() {
    const select = document.getElementById('wilaya-select');
    const codSelect = document.getElementById('cod-wilaya');
    const b2bSelect = document.getElementById('b2b-wilaya');
    const landSelect = document.getElementById('land-wilaya');
    [select, codSelect, b2bSelect, landSelect].forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '<option value="" data-i18n="wilaya_placeholder">Sélectionnez votre wilaya…</option>' +
        WILAYAS.map(w => `<option value="${w.c}">${w.c} — ${w.n}</option>`).join('');
    });
  }

export function communesForWilaya(code) {
    if (COMMUNES_BY_WILAYA[code]) return COMMUNES_BY_WILAYA[code];
    const w = WILAYAS.find(x => x.c === code);
    return w ? [w.n] : []; // fallback: chef-lieu / wilaya name itself
  }

export function updateCommunesForWilaya(code, targetId = 'cod-commune') {
    const sel = document.getElementById(targetId);
    if (!sel) return;
    const previousValue = sel.value;
    if (!code) {
      sel.innerHTML = '<option value="">Sélectionnez d\'abord une wilaya…</option>';
      sel.disabled = true;
      return;
    }
    const communes = communesForWilaya(code);
    sel.innerHTML = '<option value="">Sélectionnez votre commune…</option>' +
      communes.map(c => `<option value="${c}">${c}</option>`).join('');
    sel.disabled = false;
    if (communes.includes(previousValue)) sel.value = previousValue;
  }

export function currentZoneFee() {
    const code = document.getElementById('wilaya-select').value;
    const type = document.querySelector('input[name="delivery-type"]:checked').value;
    if (!code) return null;
    const w = WILAYAS.find(x => x.c === code);
    if (!w) return null;
    return ZONE_FEES[w.z][type === 'home' ? 'home' : 'stop'];
  }

export function updateOrderSummary() {
    const subtotal = cartSubtotal();
    const fee = currentZoneFee();

    document.getElementById('sum-subtotal').textContent = subtotal.toLocaleString('fr-FR') + ' DA';

    const feeEl = document.getElementById('sum-shipping');
    if (fee === null) {
      feeEl.textContent = 'À calculer';
      feeEl.classList.add('text-ink2');
    } else {
      feeEl.textContent = fee.toLocaleString('fr-FR') + ' DA';
      feeEl.classList.remove('text-ink2');
    }

    const total = subtotal + (fee || 0);
    document.getElementById('sum-total').textContent = total.toLocaleString('fr-FR') + ' DA';

    const b2bRow = document.getElementById('sum-b2b-row');
    if (b2bMode) {
      const savings = cartRetailSubtotal() - subtotal;
      document.getElementById('sum-b2b-savings').textContent = savings.toLocaleString('fr-FR') + ' DA';
      b2bRow.classList.remove('hidden');
      b2bRow.classList.add('flex');
    } else {
      b2bRow.classList.add('hidden');
      b2bRow.classList.remove('flex');
    }

    // keep the COD wilaya select in sync with the delivery-calculator select
    const wilayaVal = document.getElementById('wilaya-select').value;
    if (document.getElementById('cod-wilaya').value !== wilayaVal) {
      document.getElementById('cod-wilaya').value = wilayaVal;
    }
    updateCommunesForWilaya(wilayaVal);
  }

export function syncWilayaFromCod() {
    document.getElementById('wilaya-select').value = document.getElementById('cod-wilaya').value;
    updateCommunesForWilaya(document.getElementById('cod-wilaya').value);
    updateOrderSummary();
  }

  // ---- Mobile filter drawer ----
export function toggleFilterDrawer(open) {
    const drawer = document.getElementById('filter-drawer');
    const overlay = document.getElementById('filter-overlay');
    if (open) {
      overlay.classList.remove('hidden');
      requestAnimationFrame(() => drawer.classList.remove('translate-y-full'));
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.add('translate-y-full');
      document.body.style.overflow = '';
      setTimeout(() => overlay.classList.add('hidden'), 300);
    }
  }

  // ---- Dual-thumb price range slider ----
  (function initPriceSlider() {
    const min = document.getElementById('price-min');
    const max = document.getElementById('price-max');
    const fill = document.getElementById('price-fill');
    const minLabel = document.getElementById('price-min-label');
    const maxLabel = document.getElementById('price-max-label');
    if (!min || !max) return;

    function update() {
      let minVal = parseInt(min.value);
      let maxVal = parseInt(max.value);
      if (minVal > maxVal - 500) { minVal = maxVal - 500; min.value = minVal; }
      const range = parseInt(min.max) - parseInt(min.min);
      const left = ((minVal - min.min) / range) * 100;
      const right = 100 - ((maxVal - min.min) / range) * 100;
      fill.style.left = left + '%';
      fill.style.right = right + '%';
      minLabel.value = minVal.toLocaleString('fr-FR');
      maxLabel.value = maxVal.toLocaleString('fr-FR');
    }
    function updateAndFilter() {
      priceFilterTouched = true;
      update();
      if (typeof applyProductFilters === 'function') applyProductFilters();
    }
    min.addEventListener('input', updateAndFilter);
    max.addEventListener('input', updateAndFilter);
    update(); // initial paint only — does not filter, so the default slider value never hides products on first load
  })();
