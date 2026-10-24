/**
 * Intelligent Route Preloader for GDGoC SATI Vidisha
 * Preloads page bundles ahead of time (on link hover or during idle time)
 * eliminating the 4-8 second code-splitting network delay on navigation.
 */

const preloadedRoutes = new Set();

const routeLoaders = {
  '/': () => import('../pages/Home'),
  '/events': () => import('../pages/Events'),
  '/projects': () => import('../pages/Projects'),
  '/team': () => import('../pages/Team'),
  '/gallery': () => import('../pages/Gallery'),
  '/about': () => import('../pages/About'),
  '/contact': () => import('../pages/Contact'),
  '/alumni': () => import('../pages/Alumni'),
  '/login': () => import('../pages/Login'),
  '/signup': () => import('../pages/Signup'),
  '/profile': () => import('../pages/Profile'),
  '/settings': () => import('../pages/Settings'),
};

/**
 * Preload a specific route by path
 */
export const preloadRoute = (path) => {
  if (!path || typeof path !== 'string') return;
  const cleanPath = path.split('?')[0].split('#')[0];

  if (preloadedRoutes.has(cleanPath)) return;

  const loader = routeLoaders[cleanPath];
  if (loader) {
    preloadedRoutes.add(cleanPath);
    loader().catch(() => {
      preloadedRoutes.delete(cleanPath);
    });
    return;
  }

  // Event details dynamic route preloading
  if (cleanPath.startsWith('/events/') && cleanPath !== '/events') {
    if (!preloadedRoutes.has('/events/:id')) {
      preloadedRoutes.add('/events/:id');
      import('../pages/EventDetails').catch(() => {
        preloadedRoutes.delete('/events/:id');
      });
    }
  }
};

/**
 * Preload top critical navigation routes during browser idle time
 */
export const preloadCriticalRoutes = () => {
  if (typeof window === 'undefined') return;

  const topRoutes = ['/events', '/projects', '/team', '/about'];

  const runPreload = () => {
    topRoutes.forEach((route, idx) => {
      setTimeout(() => {
        preloadRoute(route);
      }, idx * 300);
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(runPreload);
  } else {
    setTimeout(runPreload, 1500);
  }
};
