import { useEffect } from 'react';

function getOrSetId(storage, key, prefix) {
  try {
    let id = storage.getItem(key);
    if (!id) {
      id = `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return `${prefix}-${Date.now().toString(36)}`;
  }
}

export function useVisitorTracking(route) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Ignore tracking for admin management routes to avoid polluting visitor stats
    if (route === '/chatbot-response' || route === '/admin') return;

    // 2. Ignore tracking when running locally on computer (localhost, 127.0.0.1, or local IP)
    const hostname = window.location.hostname || '';
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local')
    ) {
      return;
    }

    // 3. Exclude admin's personal computer and mobile devices
    try {
      if (
        localStorage.getItem('portfolio_admin_device') === 'true' ||
        localStorage.getItem('portfolio_admin_token') ||
        sessionStorage.getItem('portfolio_admin_token') ||
        localStorage.getItem('portfolio_is_admin') === 'true'
      ) {
        return;
      }
    } catch {
      // Storage access check
    }

    const visitorId = getOrSetId(localStorage, 'portfolio_vid', 'vid');
    const sessionId = getOrSetId(sessionStorage, 'portfolio_sid', 'sid');

    const path = route || window.location.hash || '/';
    const title = document.title || 'Portfolio';
    let referrer = 'direct';
    try {
      if (document.referrer) {
        referrer = new URL(document.referrer).hostname || 'direct';
      }
    } catch {
      referrer = 'direct';
    }

    const payload = JSON.stringify({
      path,
      title,
      referrer,
      sessionId,
      visitorId,
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking
    }
  }, [route]);
}
