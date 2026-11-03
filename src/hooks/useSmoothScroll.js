import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * useSmoothScroll - Smooth inertial scrolling powered by Lenis
 * Synchronized with GSAP ScrollTrigger for pinned animations.
 */
export function useSmoothScroll(route) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const isTouch =
      'ontouchstart' in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      window.innerWidth <= 768;

    const lenis = new Lenis({
      duration: isTouch ? 0.8 : 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.0,
      infinite: false,
      prevent: (node) =>
        Boolean(
          node.closest?.(
            '[data-lenis-prevent], .project-detail-panel, .project-detail-backdrop, .resume-preview, .resume-page, .chat-messages, .admin-viewport'
          )
        ),
    });

    window.lenis = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis RAF with GSAP ticker
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    // Smooth frame pacing without freezing
    gsap.ticker.lagSmoothing(500, 33);

    // Observe body class for project detail modal view to prevent scroll blocking
    const handleBodyClassChange = () => {
      if (document.body.classList.contains('project-detail-active')) {
        lenis.stop();
      } else if (route !== '/resume' && route !== '/careers') {
        lenis.start();
      }
    };

    const observer = new MutationObserver(handleBodyClassChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  // When route changes, handle route-specific scroll behavior
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (route === '/resume' || route === '/careers') {
      window.lenis?.stop();
    } else if (!document.body.classList.contains('project-detail-active')) {
      window.lenis?.start();
    }

    let scrollTarget = null;
    try {
      scrollTarget = sessionStorage.getItem('scroll_target');
    } catch {}

    if (scrollTarget && (route === '/' || route === '')) {
      try {
        sessionStorage.removeItem('scroll_target');
      } catch {}

      setTimeout(() => {
        const targetEl = document.getElementById(scrollTarget);
        if (targetEl) {
          if (window.lenis) {
            window.lenis.scrollTo(targetEl, { offset: -30, immediate: false });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
      return;
    }

    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [route]);
}
