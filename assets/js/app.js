/* =========================================================
   assets/js/app.js
   Phase 2 Step 2 — application entry point (bootstrap only).
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
import { addToCart, renderCart, changeCartQty, removeFromCart, cartSubtotal, cartItemCount, toggleCartDrawer } from './modules/cart.js';
import { openProductModal, closeProductModal, changeModalQty, modalAddToCart, modalBuyNow, renderModalPricing } from './modules/modal.js';
import { applyProductFilters, toggleSwatch, toggleChip, activeCategories } from './modules/filters.js';
import { setLang } from './modules/language.js';
import { openLandingPage, closeLandingPage, initLandingPage, submitLandingOrder, updateLandingOrderTotal, landingShippingFee, selectLandPack, renderLandingCarousel, carouselGoTo, carouselStep, updateCarouselDots, landPlayVideo, landShowVideoFallback, initLandingCountdown, initLandingStickyCTA } from './modules/landing.js';
import { currentAILang, toggleAIChat, appendAIMessage, showAITyping, removeAITyping, simulateAIReply, sendAIPrompt, handleAISubmit } from './modules/aiChat.js';
import { imgFallback, showToast, populateWilayas, communesForWilaya, updateCommunesForWilaya, currentZoneFee, updateOrderSummary, syncWilayaFromCod, toggleFilterDrawer } from './modules/data.js';
import { analytics } from './services/capabilities/analytics.js';
import { order } from './services/capabilities/order.js';
import { product } from './services/capabilities/product.js';

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

// Cart module functions, exposed for index.html's existing
// onclick="..." attributes (e.g. onclick="changeCartQty(...)").
window.addToCart = addToCart;
window.renderCart = renderCart;
window.changeCartQty = changeCartQty;
window.removeFromCart = removeFromCart;
window.cartSubtotal = cartSubtotal;
window.cartItemCount = cartItemCount;
window.toggleCartDrawer = toggleCartDrawer;

// Modal module functions, exposed for index.html's existing
// onclick="..." attributes (e.g. onclick="openProductModal('p1')").
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.changeModalQty = changeModalQty;
window.modalAddToCart = modalAddToCart;
window.modalBuyNow = modalBuyNow;
window.renderModalPricing = renderModalPricing;

// Filters module functions, exposed for index.html's existing
// onclick/onchange="..." attributes (e.g. onchange="...applyProductFilters();").
window.applyProductFilters = applyProductFilters;
window.toggleSwatch = toggleSwatch;
window.toggleChip = toggleChip;
window.activeCategories = activeCategories;

// Language module function, exposed for index.html's existing
// onclick="..." attributes (e.g. onclick="setLang('ar')").
window.setLang = setLang;

// Landing module functions, exposed for index.html's existing
// onclick/onsubmit="..." attributes (e.g. onclick="openLandingPage('p1')").
window.openLandingPage = openLandingPage;
window.closeLandingPage = closeLandingPage;
window.initLandingPage = initLandingPage;
window.submitLandingOrder = submitLandingOrder;
window.updateLandingOrderTotal = updateLandingOrderTotal;
window.landingShippingFee = landingShippingFee;
window.selectLandPack = selectLandPack;
window.renderLandingCarousel = renderLandingCarousel;
window.carouselGoTo = carouselGoTo;
window.carouselStep = carouselStep;
window.updateCarouselDots = updateCarouselDots;
window.landPlayVideo = landPlayVideo;
window.landShowVideoFallback = landShowVideoFallback;
window.initLandingCountdown = initLandingCountdown;
window.initLandingStickyCTA = initLandingStickyCTA;

// AI Chat module functions, exposed for index.html's existing
// onclick/onsubmit="..." attributes (e.g. onclick="toggleAIChat(true)").
window.currentAILang = currentAILang;
window.toggleAIChat = toggleAIChat;
window.appendAIMessage = appendAIMessage;
window.showAITyping = showAITyping;
window.removeAITyping = removeAITyping;
window.simulateAIReply = simulateAIReply;
window.sendAIPrompt = sendAIPrompt;
window.handleAISubmit = handleAISubmit;

// Data module functions, exposed for index.html's existing bare
// references and onclick="..." attributes (e.g. onclick="toggleFilterDrawer(true)",
// or placeOrder()/resetLocationFields()/DOMContentLoaded calling
// populateWilayas()/updateOrderSummary()/currentZoneFee() etc. directly).
window.imgFallback = imgFallback;
window.showToast = showToast;
window.populateWilayas = populateWilayas;
window.communesForWilaya = communesForWilaya;
window.updateCommunesForWilaya = updateCommunesForWilaya;
window.currentZoneFee = currentZoneFee;
window.updateOrderSummary = updateOrderSummary;
window.syncWilayaFromCod = syncWilayaFromCod;
window.toggleFilterDrawer = toggleFilterDrawer;

// Phase 2 Step 2 — Abstract Provider Layer compatibility bridges.
// window.trackEvent: required so index.html's existing bare
// trackEvent(...) calls (and onclick="...trackEvent(...)..."
// attributes, across ~30 call sites) keep working unchanged.
window.trackEvent = analytics.track;
// window.order: a classic <script> (placeOrder() in index.html)
// has no `import` mechanism, so it cannot reach an ES module's
// exports except via the shared global object — there is no way
// around a global reference here without either converting
// placeOrder() into a module or rewriting its call site, both of
// which are explicitly out of scope. This is narrowed to the
// smallest possible surface: a frozen object exposing only the
// one method placeOrder() actually calls (`.create`), not the
// full `order` capability object, and not writable. Call site
// (`order.create(orderHeader, orderItems)`) is unchanged.
window.order = Object.freeze({ create: order.create });

// Phase 2 Step 3 — Dynamic Data Integration (product capability).
// window.product: exposed for future use, per this step's spec.
window.product = product;

// Integration approach (documented, see Step 3 delivery report for
// full rationale): rather than converting protected, synchronous
// functions (renderCardPrices, openProductModal, applyProductFilters,
// cart/landing code — none of which are in scope to modify this step)
// into async functions, product.getAll() is resolved ONCE here at
// bootstrap. When it resolves — with Supabase data if available, or
// the static PRODUCTS fallback otherwise, exactly per product.js's
// own fallback logic — window.PRODUCTS is refreshed to that result,
// and the existing (unmodified) rendering functions are re-invoked so
// the already-visible grid/cart reflect it. Every function that reads
// PRODUCTS/window.PRODUCTS continues to do so synchronously, with its
// exact original signature and behavior, whether the resolved data is
// dynamic or the static fallback.
product.getAll().then(resolved => {
  window.PRODUCTS = resolved;
  if (typeof window.renderCardPrices === 'function') window.renderCardPrices();
  if (typeof window.renderCart === 'function') window.renderCart();
});

console.log("Dar&Deco Phase 1 initialized");
