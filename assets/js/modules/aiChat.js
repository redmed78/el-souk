/* =========================================================
   assets/js/modules/aiChat.js
   Phase 1 Step 9 — moved verbatim from index.html's main
   <script> block. Each function's body is byte-for-byte
   identical to the original; only `function` was changed to
   `export function` on each declaration line, `const`/`let`
   was changed to `export const`/`export let` on the AI_LANG /
   AI_REPLIES declaration lines, with ONE deliberate exception
   documented below (rule 13).

   ---------------------------------------------------------
   REQUIRED EXCEPTION (rule 13) — aiChatStarted:
   ---------------------------------------------------------
   The original `let aiChatStarted = false;` is NOT reproduced
   here as a plain module-local `let`. Instead this module uses
   `window.aiChatStarted` directly (initialized once below).

   Why this was necessary: index.html contains a short,
   unnamed `setTimeout(...)` statement (NOT one of the 8
   functions in scope for this step, so it stays in index.html)
   that reads `aiChatStarted` to decide whether to reveal the
   chat FAB's notification dot after 4 seconds. If
   `aiChatStarted` were a normal module-local `let` here, that
   leftover index.html statement would throw
   "aiChatStarted is not defined" — module-level `let`/`const`
   bindings are private to the module and are NOT reachable as
   bare identifiers from a classic <script>, unlike a classic
   script's own top-level `let`/`const`, which previous steps
   (4-8) relied on being readable from a module. This is the
   reverse direction, and it does not work the same way.

   A one-time `window.aiChatStarted = aiChatStarted` copy at
   import time was considered and rejected: booleans are copied
   by value, so the copy would immediately go stale the moment
   toggleAIChat() below updates its own value, and the leftover
   setTimeout would keep reading a frozen `false`.

   The minimal, honest fix is to make `window.aiChatStarted`
   the single source of truth, read and written identically by
   both sides. Exactly 3 references were changed in total:
     1. This declaration (was `let aiChatStarted = false;`)
     2 & 3. Both references inside toggleAIChat() below (was
        `if (!aiChatStarted)` / `aiChatStarted = true;`)
   A 4th reference, inside the leftover index.html setTimeout,
   was also changed to `window.aiChatStarted` — see the Step 9
   delivery report for that one-line index.html diff.
   No other logic in toggleAIChat() was altered.
   ---------------------------------------------------------

   Cross-module dependency: none. No function in this module
   calls a function already extracted into cart.js, modal.js,
   filters.js, language.js, or landing.js.

   This module also references `dict` (exposed on window in
   Step 3). trackEvent() is NOT called by any of these 8
   functions — see the full dependency table in the Step 9
   delivery report for the complete, verified list.
========================================================= */

window.aiChatStarted = false;

export const AI_LANG = { fr: 'fr', ar: 'ar' };

export const AI_REPLIES = {
    fr: {
      'Rangement Cuisine': "Pour la cuisine, je recommande notre set de boîtes hermétiques, nos paniers de conservation et nos organiseurs de tiroir. Voulez-vous que je vous montre nos meilleures ventes rangement dans la catégorie Cuisine ?",
      'Packs Salle de Bain': "Nous avons des packs complets salle de bain (serviettes + tapis + accessoires assortis) à partir de 4 500 DA. Souhaitez-vous un pack pour 1 personne ou pour toute la famille ?",
      'Demande de prix de gros': "Activez le mode Grossiste (B2B) en haut de la page pour voir les tarifs de gros et quantités minimums sur tous nos produits. Je peux aussi vous mettre en relation avec notre équipe commerciale — quel volume recherchez-vous ?",
      'Suivre ma commande': "Pour suivre votre commande, communiquez-moi votre numéro de commande ou le numéro de téléphone utilisé lors de l'achat, et je vérifie son statut.",
      fallback: "Merci pour votre message ! Un conseiller humain pourra vous répondre plus en détail très prochainement — cette démo illustre l'interface, prête à être connectée à notre assistant IA en temps réel."
    },
    ar: {
      'تنظيم المطبخ': 'بالنسبة للمطبخ، أنصح بعلب الحفظ المحكمة والسلال ومنظمات الأدراج. هل تريد أن أعرض لك الأكثر مبيعاً في فئة المطبخ؟',
      'باقات الحمام': 'لدينا باقات حمام كاملة (مناشف + سجادة + إكسسوارات متناسقة) ابتداءً من 4500 دج. هل تفضل باقة لشخص واحد أم للعائلة؟',
      'طلب سعر جملة': 'فعّل وضع الجملة (B2B) أعلى الصفحة لعرض أسعار الجملة والكميات الدنيا. يمكنني أيضاً تحويلك لفريق المبيعات — ما هي الكمية التي تبحث عنها؟',
      'تتبع طلبي': 'لتتبع طلبك، يرجى إرسال رقم الطلب أو رقم الهاتف المستخدم عند الشراء، وسأتحقق من حالته.',
      fallback: 'شكراً لرسالتك! سيتمكن أحد مستشارينا من الرد عليك قريباً — هذا العرض التوضيحي يمثل الواجهة، وهي جاهزة للربط بمساعد ذكاء اصطناعي حقيقي.'
    }
  };

export function currentAILang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'fr';
  }

export function toggleAIChat(open) {
    const panel = document.getElementById('ai-chat-panel');
    const fabDot = document.getElementById('ai-fab-dot');
    if (open) {
      panel.classList.add('open');
      fabDot.classList.add('hidden');
      if (!window.aiChatStarted) {
        window.aiChatStarted = true;
        const greet = dict[currentAILang()].ai_greeting || dict.fr.ai_greeting;
        appendAIMessage(greet, 'bot');
      }
      setTimeout(() => document.getElementById('ai-input').focus(), 200);
    } else {
      panel.classList.remove('open');
    }
  }

export function appendAIMessage(text, from) {
    const wrap = document.getElementById('ai-messages');
    const row = document.createElement('div');
    row.className = 'flex ' + (from === 'user' ? 'justify-end' : 'justify-start');
    const bubble = document.createElement('div');
    bubble.className = (from === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot') + ' max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed';
    if (from === 'user') {
      bubble.textContent = text; // user-generated content: rendered as plain text, never parsed as HTML
    } else {
      bubble.innerHTML = text; // bot replies are static, developer-authored strings (AI_REPLIES / dict) — unchanged
    }
    row.appendChild(bubble);
    wrap.appendChild(row);
    wrap.scrollTop = wrap.scrollHeight;
  }

export function showAITyping() {
    const wrap = document.getElementById('ai-messages');
    const row = document.createElement('div');
    row.id = 'ai-typing-row';
    row.className = 'flex justify-start';
    row.innerHTML = `<div class="ai-bubble-bot px-4 py-3 ai-typing"><span></span><span></span><span></span></div>`;
    wrap.appendChild(row);
    wrap.scrollTop = wrap.scrollHeight;
  }

export function removeAITyping() {
    const row = document.getElementById('ai-typing-row');
    if (row) row.remove();
  }

export function simulateAIReply(userText) {
    showAITyping();
    setTimeout(() => {
      removeAITyping();
      const lang = currentAILang();
      const replies = AI_REPLIES[lang] || AI_REPLIES.fr;
      const reply = replies[userText] || replies.fallback;
      appendAIMessage(reply, 'bot');
    }, 700 + Math.random() * 500);
  }

export function sendAIPrompt(text) {
    appendAIMessage(text, 'user');
    simulateAIReply(text.trim());
  }

export function handleAISubmit(e) {
    e.preventDefault();
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;
    appendAIMessage(text, 'user');
    input.value = '';
    simulateAIReply(text);
  }
