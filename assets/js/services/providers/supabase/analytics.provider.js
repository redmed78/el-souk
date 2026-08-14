/* =========================================================
   providers/supabase/analytics.provider.js
   Phase 2 Step 2 — moved verbatim from index.html's main
   <script> block. getOrCreateSessionId() and SESSION_ID are
   kept private to this module (not exported) — the session id
   is now an internal concern of the analytics provider, never
   a global. trackEvent()'s body is byte-for-byte identical to
   the original; only its dependency on `_supabase` changed
   from a same-script bare reference to an explicit import from
   ./client.js.

   getSessionId() is the one new addition, exactly as specified
   by this step's instructions.
========================================================= */

import { _supabase } from './client.js';

  function getOrCreateSessionId() {
    const KEY = 'dd_session_id';
    let sid = localStorage.getItem(KEY);
    if (!sid) {
      sid = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'sid-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      localStorage.setItem(KEY, sid);
    }
    return sid;
  }

  const SESSION_ID = getOrCreateSessionId();

export async function trackEvent(eventName, eventData = {}) {
    const payload = {
      session_id: SESSION_ID,
      event_name: eventName,
      event_data: eventData,
      page_url: window.location.href
    };

    if (!_supabase) {
      console.debug('[trackEvent → offline]', payload);
      return;
    }

    try {
      const { error } = await _supabase.from('user_analytics_events').insert(payload);
      if (error) console.warn('[trackEvent] Supabase insert failed:', error.message);
    } catch (err) {
      console.warn('[trackEvent] unexpected error:', err);
    }
  }

export function getSessionId() {
  return SESSION_ID;
}
