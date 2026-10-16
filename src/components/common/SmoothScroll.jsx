import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * SmoothScroll component powered by Lenis.
 * Applies buttery 60fps smooth momentum scrolling across the entire site,
 * except for the Events page in Grid view (/events?view=grid or /events default)
 * where the interactive horizontal parallax timeline requires native viewport scroll.
 */
const SmoothScroll = () => {
  const location = useLocation();
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const viewParam = searchParams.get('view');

    // Events page defaults to 'grid' view if not explicitly set to 'list'
    const isEventsPage = location.pathname === '/events';
    const isEventsGridView = isEventsPage && viewParam !== 'list';

    // 1. If on Events page in Grid View, disable Lenis completely
    if (isEventsGridView) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        window.lenis = null;
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Ensure lenis classes are cleanly removed from root elements
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
      document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
      return;
    }

    // 2. On all other pages (and /events when in 'list' view), ensure Lenis is active
    if (!lenisRef.current) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        infinite: false,
        allowNestedScroll: true,
        prevent: (node) => {
          if (!node || !(node instanceof HTMLElement)) return false;
          // 1. Tagged prevent elements
          if (node.closest('[data-lenis-prevent], [data-lenis-prevent-wheel], [data-lenis-prevent-touch]')) {
            return true;
          }
          // 2. Modals, dialogs, drawers, popups, and fixed overlays
          if (node.closest('[role="dialog"], [role="alertdialog"], .fixed, .modal, [data-modal], [data-popover]')) {
            return true;
          }
          // 3. Any scrollable container (overflow auto/scroll)
          if (node.closest('.overflow-y-auto, .overflow-y-scroll, .overflow-auto, .overflow-scroll')) {
            return true;
          }
          // 4. Form inputs, textareas, and dropdown menus
          if (node.tagName === 'TEXTAREA' || node.tagName === 'SELECT') {
            return true;
          }
          if (node.classList?.contains?.('no-lenis') || node.closest('.no-lenis')) {
            return true;
          }
          return false;
        },
      });

      lenisRef.current = lenis;
      window.lenis = lenis;

      const raf = (time) => {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      };

      rafIdRef.current = requestAnimationFrame(raf);
    }

    // 3. Handle page navigation scroll position & anchors
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;

      if (location.hash) {
        const id = location.hash.replace('#', '');
        const elem = document.getElementById(id);
        if (elem && lenisRef.current) {
          setTimeout(() => {
            lenisRef.current?.scrollTo(elem, { offset: -90, duration: 1.0 });
          }, 100);
          return;
        }
      }

      // Scroll immediately to top on route change
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    } else if (location.hash && lenisRef.current) {
      const id = location.hash.replace('#', '');
      const elem = document.getElementById(id);
      if (elem) {
        lenisRef.current.scrollTo(elem, { offset: -90, duration: 1.0 });
      }
    }
  }, [location.pathname, location.search, location.hash]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        window.lenis = null;
      }
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
      document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
    };
  }, []);

  return null;
};

export default SmoothScroll;
