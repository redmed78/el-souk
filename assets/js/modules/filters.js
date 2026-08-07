/* =========================================================
   assets/js/modules/filters.js
   Phase 1 Step 6 — moved verbatim from index.html's main
   <script> block. Each function's body is byte-for-byte
   identical to the original; only `function` was changed to
   `export function` on each declaration line.

   toggleFilterDrawer(open) and the initPriceSlider() IIFE are
   NOT filtering-logic functions and remain in index.html, per
   the Step 6 scope.

   These functions reference identifiers that remain declared
   in index.html (not moved, per the Step 6 rules):
     - `priceFilterTouched` (let, sits between activeCategories
       and applyProductFilters in the original source; guards
       against the price slider's default value hiding products
       on first load — see its comment in index.html)
     - `PRODUCTS`, `dict` (exposed on window in Step 3)
     - `trackEvent()` (function declaration left in index.html)
   No reference was rewritten — see the Step 6 delivery report
   for why these resolve correctly without a window/globalThis
   rewrite.
========================================================= */

  // =========================================================
  // LIVE PRODUCT FILTERING (search bar + category checkboxes/chips)
  // =========================================================
export function activeCategories() {
    const fromCheckboxes = Array.from(document.querySelectorAll('.category-filter-checkbox:checked')).map(el => el.dataset.category);
    const fromChips = Array.from(document.querySelectorAll('.category-filter-chip.chip-active')).map(el => el.dataset.category);
    return Array.from(new Set([...fromCheckboxes, ...fromChips]));
  }

export function applyProductFilters() {
    const desktopQuery = (document.getElementById('smart-search')?.value || '').trim().toLowerCase();
    const mobileQuery = (document.getElementById('smart-search-mobile')?.value || '').trim().toLowerCase();
    const query = desktopQuery || mobileQuery;
    const categories = activeCategories(); // empty array = no category filter = show all

    // ---- Price range (from the dual-thumb slider, if present) ----
    const priceMinEl = document.getElementById('price-min');
    const priceMaxEl = document.getElementById('price-max');
    const priceMin = priceMinEl ? parseInt(priceMinEl.value, 10) : null;
    const priceMax = priceMaxEl ? parseInt(priceMaxEl.value, 10) : null;

    let visibleCount = 0;
    document.querySelectorAll('#product-grid > .product-card').forEach(card => {
      const p = PRODUCTS[card.dataset.pid];
      if (!p) return;
      const matchesQuery = !query || p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
      const matchesCategory = categories.length === 0 || categories.includes(p.category);
      const matchesPrice = !priceFilterTouched || ((priceMin === null || p.price >= priceMin) && (priceMax === null || p.price <= priceMax));
      const show = matchesQuery && matchesCategory && matchesPrice;
      card.classList.toggle('hidden', !show);
      if (show) visibleCount++;
    });

    const noResults = document.getElementById('no-results-msg');
    const loadMoreWrap = document.getElementById('load-more-wrap');
    if (noResults) {
      noResults.classList.toggle('hidden', visibleCount > 0);
      noResults.classList.toggle('flex', visibleCount === 0);
    }
    if (loadMoreWrap) loadMoreWrap.classList.toggle('hidden', visibleCount === 0);

    const resultsCountEl = document.getElementById('results-count');
    if (resultsCountEl) {
      const lang = document.documentElement.lang === 'ar' ? 'ar' : 'fr';
      const template = dict[lang].cat_results_dynamic || 'Affichage de {n} produit(s)';
      resultsCountEl.textContent = template.replace('{n}', visibleCount);
    }
  }

  // ---- Color swatch toggle (multi-select) ----
export function toggleSwatch(el) {
    el.classList.toggle('active');
    trackEvent('filter_change', {
      type: 'color',
      value: el.dataset.color || el.getAttribute('aria-label') || null,
      active: el.classList.contains('active')
    });
  }

  // ---- Filter/category chip toggle (multi-select) ----
export function toggleChip(el) {
    el.classList.toggle('chip-active');
    trackEvent('filter_change', {
      type: 'material_or_category',
      value: el.textContent.trim(),
      active: el.classList.contains('chip-active')
    });
  }

