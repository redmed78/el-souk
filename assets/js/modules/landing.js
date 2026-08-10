/* =========================================================
   assets/js/modules/landing.js
   Phase 1 Step 8 — moved verbatim from index.html's main
   <script> block. Each function's body is byte-for-byte
   identical to the original; only `function`/`async function`
   was changed to `export function`/`export async function` on
   each declaration line. Assembled in the same relative order
   the functions appeared in index.html.

   AI Chat functions (currentAILang, toggleAIChat,
   appendAIMessage, sendAIPrompt, handleAISubmit, and related
   helpers) are explicitly out of scope for this step and
   remain in index.html.

   Cross-module import (rule 14): openLandingPage() calls
   closeProductModal(), already extracted into ./modal.js in
   Step 5 — imported below rather than duplicated.

   These functions also reference several identifiers that
   remain declared in index.html (not moved, per the Step 8
   rules — see the full dependency table in the Step 8 delivery
   report):
     - `currentLandingProduct`, `selectedLandPack`, `LAND_PACKS`
       (let, landing state — reassigned, not just read)
     - `isSubmittingLandingOrder` (let, checkout guard —
       reassigned, not just read)
     - `REVIEW_POOL` (const, static review data)
     - `PRODUCTS`, `WILAYAS`, `ZONE_FEES` (exposed on window
       in Step 3)
     - `b2bMode` (let, B2B pricing toggle state)
     - `showToast()`, `trackEvent()`,
       `resetLandingLocationFields()` (function declarations
       left in index.html)
   No reference was rewritten to use window/globalThis.

   ---------------------------------------------------------
   UPDATED IN PHASE 2 STEP 2: submitLandingOrder()'s call to
   submitOrderToSupabase() (a bare index.html reference) was
   replaced with order.create(), imported below from the new
   Abstract Provider Layer capability. This is a proper ES
   module import — no global/window dependency needed here,
   since landing.js is already a module. No other logic in
   submitLandingOrder() was touched.
   ---------------------------------------------------------
========================================================= */

import { closeProductModal } from './modal.js';
import { order } from '../services/capabilities/order.js';

  // Sends the shopper straight into the dynamic single-product landing page —
  // toggles the in-page view (#landing-view) rather than navigating to a file,
  // so this works regardless of how index.html was opened/saved/renamed.
export function openLandingPage(id) {
    if (!id || !PRODUCTS[id]) return;

    // close any open overlays first so nothing sits on top of the landing view
    closeProductModal();
    document.getElementById('cart-drawer')?.classList.add('translate-x-full');
    document.getElementById('cart-overlay')?.classList.add('hidden');
    document.body.style.overflow = '';

    document.documentElement.classList.add('landing-mode');
    initLandingPage(id);
    window.scrollTo({ top: 0, behavior: 'instant' });

    // keep the URL shareable/bookmarkable without a full page reload
    if (window.history && history.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', 'landing');
      url.searchParams.set('product', id);
      history.pushState({ landing: true, product: id }, '', url);
    }
  }

  // Returns from the landing view to the normal catalog site, in-page.
export function closeLandingPage() {
    document.documentElement.classList.remove('landing-mode');
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (window.history && history.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('page');
      url.searchParams.delete('product');
      url.searchParams.delete('land');
      history.pushState({ landing: false }, '', url.pathname + url.hash);
    }
  }

export function initLandingPage(id) {
    const p = PRODUCTS[id];
    if (!p) return;
    currentLandingProduct = id;

    document.title = p.title + ' — Offre Spéciale Algérie | Dar&Deco';
    document.getElementById('land-category-badge').textContent = p.category;
    document.getElementById('land-headline').textContent = p.title;
    document.getElementById('land-price').textContent = p.price.toLocaleString('fr-FR') + ' DA';

    const oldPriceEl = document.getElementById('land-old-price');
    const badgeEl = document.getElementById('land-discount-badge');
    if (p.oldPrice) {
      oldPriceEl.textContent = p.oldPrice.toLocaleString('fr-FR') + ' DA';
      oldPriceEl.classList.remove('hidden');
      const pct = Math.round((1 - p.price / p.oldPrice) * 100);
      badgeEl.textContent = '-' + pct + '%';
      badgeEl.classList.remove('hidden');
    } else {
      oldPriceEl.classList.add('hidden');
      badgeEl.classList.add('hidden');
    }

    document.getElementById('land-rating-value').textContent = p.rating;
    document.getElementById('land-review-count').textContent = p.reviews;
    document.getElementById('land-reviews-summary-rating').textContent = p.rating + '/5';
    document.getElementById('land-reviews-summary-count').textContent = p.reviews + ' clients vérifiés ont déjà commandé';

    // Video — URL is derived from the product id, but only ASSIGNED to the <source>
    // when the shopper actually clicks Play (see landPlayVideo), so no video bytes
    // are ever requested just from opening the landing page.
    document.getElementById('land-video-poster').src = p.images[0];
    const video = document.getElementById('land-product-video');
    video.dataset.src = 'video/' + id + '-demo.mp4';
    video.setAttribute('poster', p.images[0]);
    video.querySelector('source').removeAttribute('src');
    video.removeAttribute('src');
    document.getElementById('land-video-fallback').classList.add('hidden');
    document.getElementById('land-video-fallback').style.display = 'none';
    document.getElementById('land-product-video').classList.add('hidden');
    document.getElementById('land-video-poster').classList.remove('hidden');
    document.getElementById('land-play-btn').classList.remove('hidden');

    // Photo carousel (reuses the same gallery images as the product modal)
    renderLandingCarousel(p.images.slice(0, 4));

    // Benefits grid — derived directly from product data, no duplication
    const ICON_QUALITY = '<path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/>';
    const ICON_SPECS = '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/>';
    const ICON_CARE = '<path d="M12 2c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9Z"/>';
    const ICON_WARRANTY = '<path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Z"/>';
    const benefits = [
      { icon: ICON_QUALITY, title: 'Qualité Premium', text: p.description },
      { icon: ICON_SPECS, title: 'Dimensions', text: p.dimensions },
      { icon: ICON_CARE, title: 'Entretien Facile', text: p.care },
      { icon: ICON_WARRANTY, title: 'Garantie &amp; SAV', text: 'Satisfait ou remboursé sous 7 jours, service client 7j/7 partout en Algérie.' }
    ];
    document.getElementById('land-benefits').innerHTML = benefits.map(b => `
      <div class="bg-white border border-line rounded-2xl p-5 text-center flex flex-col items-center">
        <div class="w-11 h-11 rounded-full bg-clay/10 flex items-center justify-center text-clay mb-3">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${b.icon}</svg>
        </div>
        <p class="text-sm font-bold text-ink">${b.title}</p>
        <p class="text-xs text-ink2 mt-1 leading-relaxed">${b.text}</p>
      </div>`).join('');

    // Reviews — rotate through a shared pool so each product shows a different set
    const startIdx = (parseInt(id.replace('p', ''), 10) - 1) % REVIEW_POOL.length;
    const picked = [0, 1, 2].map(off => REVIEW_POOL[(startIdx + off) % REVIEW_POOL.length]);
    document.getElementById('land-reviews').innerHTML = picked.map(r => `
      <div class="bg-paper2/50 border border-line rounded-2xl p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-clay/15 text-clayDk flex items-center justify-center text-sm font-bold shrink-0">${r.name.charAt(0)}</div>
          <div>
            <p class="text-sm font-semibold text-ink">${r.name}</p>
            <p class="text-[11px] text-ink2">Client vérifié · ${r.wilaya}</p>
          </div>
        </div>
        <div class="flex text-clay mb-2 review-stars">${'<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M10 1l2.9 6 6.6.9-4.8 4.6 1.1 6.5L10 15.9 4.2 19l1.1-6.5L.5 7.9 7.1 7z"/></svg>'.repeat(r.rating) + '<svg class="w-3.5 h-3.5 fill-current opacity-30" viewBox="0 0 20 20"><path d="M10 1l2.9 6 6.6.9-4.8 4.6 1.1 6.5L10 15.9 4.2 19l1.1-6.5L.5 7.9 7.1 7z"/></svg>'.repeat(5 - r.rating)}</div>
        <p class="text-sm text-ink2 leading-relaxed">"${r.text}"</p>
      </div>`).join('');

    // Checkout recap
    document.getElementById('land-ord-thumb').src = p.images[0];
    document.getElementById('land-ord-title').textContent = p.title;
    document.getElementById('land-ord-price-recap').innerHTML = p.price.toLocaleString('fr-FR') + ' DA' +
      (p.oldPrice ? ' <span class="line-through text-ink2/50">' + p.oldPrice.toLocaleString('fr-FR') + ' DA</span>' : '');
    document.getElementById('land-sticky-price').textContent = p.price.toLocaleString('fr-FR') + ' DA';

    // Bundle packs (1x / 2x -10% / 3x -15%), derived from the live price
    LAND_PACKS = {
      1: { qty: 1, price: p.price },
      2: { qty: 2, price: Math.round(p.price * 2 * 0.9) },
      3: { qty: 3, price: Math.round(p.price * 3 * 0.85) }
    };
    document.getElementById('land-pack-1-price').textContent = LAND_PACKS[1].price.toLocaleString('fr-FR') + ' DA';
    document.getElementById('land-pack-2-price').textContent = LAND_PACKS[2].price.toLocaleString('fr-FR') + ' DA';
    document.getElementById('land-pack-3-price').textContent = LAND_PACKS[3].price.toLocaleString('fr-FR') + ' DA';
    selectedLandPack = 1;
    document.querySelectorAll('.land-pack-option').forEach((b, i) => {
      b.classList.toggle('border-clay', i === 0);
      b.classList.toggle('bg-clay/5', i === 0);
      b.classList.toggle('border-line', i !== 0);
    });

    updateLandingOrderTotal();
    initLandingCountdown();
    initLandingStickyCTA();
  }

  // ---- Photo carousel (native scroll-snap = smooth touch swipe for free) ----
export function renderLandingCarousel(images) {
    const track = document.getElementById('land-carousel-track');
    const dots = document.getElementById('land-carousel-dots');
    track.innerHTML = images.map(src =>
      `<div class="snap-center shrink-0 w-full h-full"><img src="${src}" loading="lazy" decoding="async" onerror="imgFallback(this)" class="w-full h-full object-cover" alt="Photo produit"></div>`
    ).join('');
    dots.innerHTML = images.map((_, i) =>
      `<button onclick="carouselGoTo(${i})" class="land-dot w-2 h-2 rounded-full bg-line transition-all" aria-label="Photo ${i + 1}"></button>`
    ).join('');
    updateCarouselDots(0);

    track.onscroll = () => {
      requestAnimationFrame(() => {
        const idx = Math.round(track.scrollLeft / track.clientWidth);
        updateCarouselDots(idx);
      });
    };
  }

export function updateCarouselDots(activeIdx) {
    document.querySelectorAll('.land-dot').forEach((d, i) => d.classList.toggle('active', i === activeIdx));
  }

export function carouselGoTo(i) {
    const track = document.getElementById('land-carousel-track');
    track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
  }

export function carouselStep(dir) {
    const track = document.getElementById('land-carousel-track');
    const count = track.children.length;
    let idx = Math.round(track.scrollLeft / track.clientWidth) + dir;
    idx = Math.max(0, Math.min(count - 1, idx));
    carouselGoTo(idx);
  }

  // ---- Video player ----
export function landPlayVideo() {
    document.getElementById('land-video-poster').classList.add('hidden');
    document.getElementById('land-play-btn').classList.add('hidden');
    const video = document.getElementById('land-product-video');
    video.classList.remove('hidden');

    // Lazy-load: the <source> only gets a real URL right now, on demand,
    // never during initial page load or on merely opening the landing view.
    const pendingSrc = video.dataset.src;
    const sourceEl = video.querySelector('source');
    if (pendingSrc && sourceEl.getAttribute('src') !== pendingSrc) {
      sourceEl.src = pendingSrc;
      video.load();
    }

    video.play().catch(() => landShowVideoFallback());
  }
export function landShowVideoFallback() {
    document.getElementById('land-product-video').classList.add('hidden');
    const fb = document.getElementById('land-video-fallback');
    fb.classList.remove('hidden');
    fb.style.display = 'flex';
  }

  // ---- Bundle pack selector ----
export function selectLandPack(n, btn) {
    selectedLandPack = n;
    document.querySelectorAll('.land-pack-option').forEach(b => {
      b.classList.remove('border-clay', 'bg-clay/5');
      b.classList.add('border-line');
    });
    btn.classList.remove('border-line');
    btn.classList.add('border-clay', 'bg-clay/5');
    updateLandingOrderTotal();
  }

  // ---- Shipping fee (reuses the main store's WILAYAS + ZONE_FEES) ----
export function landingShippingFee() {
    const code = document.getElementById('land-wilaya').value;
    if (!code) return null;
    const w = WILAYAS.find(x => x.c === code);
    if (!w) return null;
    const type = document.querySelector('input[name="land-delivery-type"]:checked').value;
    return ZONE_FEES[w.z][type === 'home' ? 'home' : 'stop'];
  }

export function updateLandingOrderTotal() {
    const pack = LAND_PACKS[selectedLandPack] || { price: 0 };
    document.getElementById('land-subtotal').textContent = pack.price.toLocaleString('fr-FR') + ' DA';

    const fee = landingShippingFee();
    const shipEl = document.getElementById('land-shipping');
    if (fee === null) {
      shipEl.textContent = 'Sélectionnez votre wilaya';
      shipEl.classList.add('text-ink2');
      shipEl.classList.remove('font-semibold', 'text-ink');
    } else {
      shipEl.textContent = fee.toLocaleString('fr-FR') + ' DA';
      shipEl.classList.remove('text-ink2');
      shipEl.classList.add('font-semibold', 'text-ink');
    }

    document.getElementById('land-total').textContent = (pack.price + (fee || 0)).toLocaleString('fr-FR') + ' DA';

    document.querySelectorAll('.land-delivery-pill').forEach(pill => {
      const checked = pill.querySelector('input').checked;
      pill.classList.toggle('border-clay', checked);
      pill.classList.toggle('bg-clay/5', checked);
      pill.classList.toggle('border-line', !checked);
    });
  }

  // ---- Express checkout submit (simulated — ready to wire to a real backend) ----
export async function submitLandingOrder(e) {
    e.preventDefault();
    if (isSubmittingLandingOrder) return;

    const name = document.getElementById('land-name').value.trim();
    const phone = document.getElementById('land-phone').value.trim();
    const wilayaCode = document.getElementById('land-wilaya').value;
    const commune = document.getElementById('land-commune').value.trim();
    const address = document.getElementById('land-address').value.trim();
    const phoneOk = /^0[567]\d{8}$/.test(phone);

    document.getElementById('land-phone-error').classList.toggle('hidden', phoneOk);
    if (!name || !phoneOk || !wilayaCode || !commune || !address) {
      if (name && phoneOk && (!commune || !wilayaCode)) {
        showToast('Merci de sélectionner votre wilaya et votre commune.', 'error');
      }
      return;
    }

    const p = PRODUCTS[currentLandingProduct];
    if (!p) return;

    const deliveryTypeInput = document.querySelector('input[name="land-delivery-type"]:checked');
    const deliveryMode = deliveryTypeInput ? deliveryTypeInput.value : 'home';

    const wilayaMatch = WILAYAS.find(w => w.c === wilayaCode);
    const wilaya = wilayaMatch ? wilayaMatch.n : '';
    const pack = LAND_PACKS[selectedLandPack] || { qty: 1, price: p.price };
    const shippingFee = landingShippingFee() || 0;
    const totalAmount = pack.price + shippingFee;
    const unitPriceForPack = Math.round(pack.price / pack.qty);

    const orderItems = [{
      name: p.title,
      qty: pack.qty,
      price: unitPriceForPack
    }];

    // Same schema as the store checkout — see submitOrderToSupabase() for the
    // shared 2-step (orders → order_items) sequence both forms rely on.
    const orderHeader = {
      user_name: name,
      phone: phone,
      wilaya: wilaya || wilayaCode || '',
      commune: commune,
      address: address,
      delivery_mode: deliveryMode,
      total_amount: totalAmount,
      is_b2b: (typeof b2bMode !== 'undefined') ? !!b2bMode : false,
      status: 'pending'
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const submitBtnOriginalHTML = submitBtn ? submitBtn.innerHTML : null;

    isSubmittingLandingOrder = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Envoi en cours…';
    }

    try {
      const orderId = await order.create(orderHeader, orderItems);

      alert('SUCCESS: Order Saved!'); // fires BEFORE any confirmation UI

      if (typeof trackEvent === 'function') {
        trackEvent('order_placed', { order_id: orderId, total_amount: totalAmount, wilaya: orderHeader.wilaya, delivery_mode: deliveryMode, items: orderItems, is_b2b: orderHeader.is_b2b, source: 'landing_page' });
      }

      const ref = orderId || ('DD-' + Date.now().toString().slice(-8));
      document.getElementById('land-conf-name').textContent = name;
      document.getElementById('land-conf-phone').textContent = phone;
      document.getElementById('land-conf-ref').textContent = ref;

      document.getElementById('land-order-form').classList.add('hidden');
      document.getElementById('land-order-confirmation').classList.remove('hidden');
      document.getElementById('land-order-confirmation').scrollIntoView({ behavior: 'smooth', block: 'center' });

      showToast('Commande confirmée ! Vous serez contacté(e) au ' + phone + '.', 'success');
      if (typeof resetLandingLocationFields === 'function') resetLandingLocationFields();

    } catch (err) {
      alert('SUPABASE ERROR: ' + JSON.stringify(err && err.details ? err.details : { message: err && err.message, name: err && err.name }));
    } finally {
      isSubmittingLandingOrder = false;
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitBtnOriginalHTML; }
    }
  }

  // ---- Urgency countdown (persists across refresh within its window) ----
export function initLandingCountdown() {
    if (window.__landCountdownStarted) return;
    window.__landCountdownStarted = true;
    const KEY = 'ddLandingCountdownDeadline';
    const WINDOW_MS = 3 * 60 * 60 * 1000; // 3h urgency window
    let deadline = parseInt(sessionStorage.getItem(KEY) || '0', 10);
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + WINDOW_MS;
      sessionStorage.setItem(KEY, deadline);
    }
    function tick() {
      let remaining = deadline - Date.now();
      if (remaining <= 0) {
        deadline = Date.now() + WINDOW_MS;
        sessionStorage.setItem(KEY, deadline);
        remaining = WINDOW_MS;
      }
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      document.getElementById('land-cd-h').textContent = String(h).padStart(2, '0');
      document.getElementById('land-cd-m').textContent = String(m).padStart(2, '0');
      document.getElementById('land-cd-s').textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  // ---- Sticky mobile CTA — appears after hero, hides once the form is in view ----
export function initLandingStickyCTA() {
    if (window.__landStickyCTAStarted) return;
    window.__landStickyCTAStarted = true;
    const cta = document.getElementById('land-mobile-sticky-cta');
    const form = document.getElementById('land-commander');
    const heroCTA = document.querySelector('#landing-view a[href="#land-commander"]');
    let formVisible = false;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { formVisible = entry.isIntersecting; });
    }, { threshold: 0.15 });
    io.observe(form);

    window.addEventListener('scroll', () => {
      const showAfter = heroCTA ? heroCTA.getBoundingClientRect().top + window.scrollY : 400;
      const shouldShow = window.scrollY > showAfter && !formVisible;
      cta.classList.toggle('translate-y-full', !shouldShow);
    }, { passive: true });
  }
