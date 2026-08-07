/* =========================================================
   assets/js/modules/language.js
   Phase 1 Step 7 — moved verbatim from index.html's main
   <script> block. The function body is byte-for-byte identical
   to the original; only `function` was changed to `export
   function` on the declaration line.

   Cross-module imports (rules 14/15): setLang() calls
   renderCart() (already extracted into ./cart.js in Step 4)
   and applyProductFilters() (already extracted into
   ./filters.js in Step 6) — both imported below rather than
   duplicated. renderCardPrices() and trackEvent() have not
   been extracted yet and still live in index.html, so those
   two references were left exactly as they were.

   This function also references `dict` (exposed on window in
   Step 3). No reference was rewritten to use window/globalThis.
========================================================= */

import { renderCart } from './cart.js';
import { applyProductFilters } from './filters.js';

  // ---- Language / RTL switch ----
export function setLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('app_lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[lang][key]) el.innerHTML = dict[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[lang][key]) el.setAttribute('placeholder', dict[lang][key]);
    });

    // re-render JS-templated content so it picks up the new language too
    // (product titles stay French by design — same as the rest of the catalog —
    // but currency labels, "/unité", MOQ text, and the results counter all update)
    if (typeof renderCardPrices === 'function') renderCardPrices();
    if (typeof renderCart === 'function') renderCart();
    if (typeof applyProductFilters === 'function') applyProductFilters();

    // toggle top-bar active state
    const frBtn = document.getElementById('lang-fr');
    const arBtn = document.getElementById('lang-ar');
    if (lang === 'ar') {
      frBtn.classList.remove('font-semibold','border-b','border-clay','pb-px');
      frBtn.classList.add('text-paper/70');
      arBtn.classList.add('font-semibold','border-b','border-clay','pb-px');
      arBtn.classList.remove('text-paper/70');
      frBtn.setAttribute('aria-pressed','false');
      arBtn.setAttribute('aria-pressed','true');
    } else {
      arBtn.classList.remove('font-semibold','border-b','border-clay','pb-px');
      arBtn.classList.add('text-paper/70');
      frBtn.classList.add('font-semibold','border-b','border-clay','pb-px');
      frBtn.classList.remove('text-paper/70');
      arBtn.setAttribute('aria-pressed','false');
      frBtn.setAttribute('aria-pressed','true');
    }

    trackEvent('switch_language', { lang, dir: document.documentElement.dir });
  }
