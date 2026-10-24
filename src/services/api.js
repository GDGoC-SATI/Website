// API Service for GDG on Campus SATI Vidisha Frontend with Caching & Compression
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('gdg_token');

// In-memory cache and promise deduplication map
const responseCache = new Map();
const inFlightRequests = new Map();
const DEFAULT_CACHE_TTL = 10 * 60 * 1000; // 10 minutes default TTL
const STORAGE_PREFIX = 'gdg_swr_cache:';

const readStorageCache = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data) {
      return parsed;
    }
  } catch {}
  return null;
};

const writeStorageCache = (key, data, ttl) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify({ data, timestamp: Date.now(), ttl })
    );
  } catch {}
};

export const clearApiCache = (endpointPrefix = '') => {
  if (!endpointPrefix) {
    responseCache.clear();
    if (typeof window !== 'undefined') {
      try {
        Object.keys(sessionStorage).forEach((k) => {
          if (k.startsWith(STORAGE_PREFIX)) sessionStorage.removeItem(k);
        });
      } catch {}
    }
    return;
  }
  for (const key of responseCache.keys()) {
    if (key.includes(endpointPrefix)) {
      responseCache.delete(key);
    }
  }
  if (typeof window !== 'undefined') {
    try {
      Object.keys(sessionStorage).forEach((k) => {
        if (k.startsWith(STORAGE_PREFIX) && k.includes(endpointPrefix)) {
          sessionStorage.removeItem(k);
        }
      });
    } catch {}
  }
};

const request = async (endpoint, options = {}, ttl = DEFAULT_CACHE_TTL) => {
  const method = (options.method || 'GET').toUpperCase();
  const token = getToken();
  const isCacheable = method === 'GET' && !options.skipCache;
  const cacheKey = `${method}:${endpoint}`;

  // 1. Instant Return: Check in-memory cache
  if (isCacheable && responseCache.has(cacheKey)) {
    const cached = responseCache.get(cacheKey);
    const isFresh = Date.now() - cached.timestamp < cached.ttl;
    if (isFresh) {
      return cached.data;
    }
  }

  // 2. Instant Return: Check sessionStorage cache (Stale-While-Revalidate)
  let staleData = null;
  if (isCacheable) {
    const storageItem = readStorageCache(cacheKey);
    if (storageItem) {
      staleData = storageItem.data;
      // Populate memory cache with stale data for instant zero-ms sync
      responseCache.set(cacheKey, storageItem);
    }
  }

  // Deduplicate concurrent in-flight GET requests
  if (isCacheable && inFlightRequests.has(cacheKey)) {
    return staleData ? staleData : inFlightRequests.get(cacheKey);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const fetchPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Server error (${res.status})`);
      }

      // Cache successful GET responses in memory & sessionStorage
      if (isCacheable) {
        const cacheEntry = {
          data,
          timestamp: Date.now(),
          ttl,
        };
        responseCache.set(cacheKey, cacheEntry);
        writeStorageCache(cacheKey, data, ttl);

        // Notify subscribers if fresh data arrived in background
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gdg:cache-update', { detail: { endpoint, data } }));
        }
      }

      // Invalidate relevant cache on mutations
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        const rootResource = endpoint.split('/')[1];
        if (rootResource) {
          clearApiCache(rootResource);
        }
      }

      return data;
    } catch (error) {
      // If network fails but we have stale cache, return stale cache gracefully
      if (staleData) {
        return staleData;
      }
      console.error(`API Error [${endpoint}]:`, error.message);
      if (
        error.name === 'TypeError' &&
        (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Load failed'))
      ) {
        throw new Error('Please wait a few seconds and try again.');
      }
      throw error;
    } finally {
      if (isCacheable) {
        inFlightRequests.delete(cacheKey);
      }
    }
  })();

  if (isCacheable) {
    inFlightRequests.set(cacheKey, fetchPromise);
  }

  // If stale data is available, return it immediately while fetchPromise finishes in background
  if (staleData) {
    return staleData;
  }

  return fetchPromise;
};

export const api = {
  clearCache: clearApiCache,

  // Auth
  auth: {
    signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
    sendSignupOtp: (body) => request('/auth/send-signup-otp', { method: 'POST', body: JSON.stringify(body) }),
    verifySignupOtp: (body) => request('/auth/verify-signup-otp', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    sendLoginOtp: (body) => request('/auth/send-login-otp', { method: 'POST', body: JSON.stringify(body) }),
    verifyLoginOtp: (body) => request('/auth/verify-login-otp', { method: 'POST', body: JSON.stringify(body) }),
    sendForgotPasswordOtp: (body) => request('/auth/forgot-password/send-otp', { method: 'POST', body: JSON.stringify(body) }),
    resetPasswordWithOtp: (body) => request('/auth/forgot-password/reset', { method: 'POST', body: JSON.stringify(body) }),
    googleAuth: (body) => request('/auth/google', { method: 'POST', body: JSON.stringify(body) }),
    getGoogleClientId: () => request('/auth/google-client-id', { skipCache: true }),
    getMe: (skipCache = false) => request('/auth/me', { skipCache }, 60 * 1000),
    getUserByUsername: (username) => request(`/auth/user/${username}`, {}, 2 * 60 * 1000),
    updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
    deleteAccount: () => request('/auth/account', { method: 'DELETE' }),
  },

  // Events
  events: {
    getAll: (skipCache = false) => request('/events', { skipCache }, 5 * 60 * 1000),
    getBySlug: (slug) => request(`/events/${slug}`, {}, 5 * 60 * 1000),
    create: (body) => request('/events', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  },

  // Projects
  projects: {
    getAll: (skipCache = false) => request('/projects', { skipCache }, 5 * 60 * 1000),
    create: (body) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
    requestProject: (body) => request('/projects/request', { method: 'POST', body: JSON.stringify(body) }),
    getRequests: () => request('/projects/requests', { skipCache: true }),
    approveRequest: (id) => request(`/projects/requests/${id}/approve`, { method: 'POST' }),
    updateRequestStatus: (id, status) => request(`/projects/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    deleteRequest: (id) => request(`/projects/requests/${id}`, { method: 'DELETE' }),
  },

  // Team
  team: {
    getAll: (skipCache = false) => request('/team', { skipCache }, 10 * 60 * 1000),
    create: (body) => request('/team', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/team/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/team/${id}`, { method: 'DELETE' }),
    reorder: (orderedIds) => request('/team/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
  },

  // Alumni
  alumni: {
    getAll: (skipCache = false) => request('/alumni', { skipCache }, 10 * 60 * 1000),
    create: (body) => request('/alumni', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/alumni/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/alumni/${id}`, { method: 'DELETE' }),
    reorder: (orderedIds) => request('/alumni/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
  },

  // Gallery
  gallery: {
    getAll: (skipCache = false) => request('/gallery', { skipCache }, 5 * 60 * 1000),
    create: (body) => request('/gallery', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),
    addImage: (id, imageUrl) => request(`/gallery/${id}/images`, { method: 'POST', body: JSON.stringify({ imageUrl }) }),
    removeImage: (id, imageUrl) => request(`/gallery/${id}/images`, { method: 'DELETE', body: JSON.stringify({ imageUrl }) }),
    reorder: (orderedIds) => request('/gallery/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
  },

  // Contact Queries
  contact: {
    submit: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),
    getAll: () => request('/contact', { skipCache: true }),
    updateStatus: (id, status) => request(`/contact/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    reply: (id, body) => request(`/contact/${id}/reply`, { method: 'POST', body: JSON.stringify(body) }),
    delete: (id) => request(`/contact/${id}`, { method: 'DELETE' }),
  },

  // Stats & Users (Admin)
  stats: {
    getDashboardStats: (skipCache = false) => request('/stats', { skipCache }, 2 * 60 * 1000),
    getUsers: () => request('/stats/users', { skipCache: true }),
    updateUserRole: (id, role) => request(`/stats/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
    deleteUser: (id) => request(`/stats/users/${id}`, { method: 'DELETE' }),
  },

  // Section configs
  sections: {
    get: (key, skipCache = false) => request(`/sections/${key}`, { skipCache }, skipCache ? 0 : 10 * 60 * 1000),
    getAll: (skipCache = false) => request('/sections', { skipCache }, skipCache ? 0 : 10 * 60 * 1000),
    update: (key, data) => request(`/sections/${key}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Audit Logs (Admin)
  auditLogs: {
    getAll: () => request('/audit-logs', { skipCache: true }),
    clearAll: () => request('/audit-logs', { method: 'DELETE' }),
  },

  // Feedback
  feedback: {
    submit: (body) => request('/feedback', { method: 'POST', body: JSON.stringify(body) }),
    getAll: () => request('/feedback', { skipCache: true }),
  },
};
