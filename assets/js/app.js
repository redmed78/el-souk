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
// window.order: required so placeOrder() in index.html (a classic
// script, not converted to a module per rule 7 — "only change the
// call site") can call order.create(orderHeader, orderItems) at
// its one call site. This is the one necessary exception beyond
// window.trackEvent — see the Phase 2 Step 2 delivery report for
// the full reasoning. window.analytics/_supabase/SESSION_ID are
// deliberately NOT exposed anywhere.
window.order = order;

console.log("Dar&Deco Phase 1 initialized");
