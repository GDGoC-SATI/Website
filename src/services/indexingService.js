/**
 * Auto-Indexing Service for GDGoC SATI Vidisha
 * Automatically notifies search engines (Bing, Yahoo, Yandex, Seznam, Naver) via IndexNow
 * whenever content (events, projects, etc.) is created or updated.
 */
export const INDEXNOW_KEY = 'b2fd1b8f90b04d08b51ec21945b9658f';
export const BASE_URL = 'https://gdgocsati.vercel.app';

/**
 * Notify search engines of a created/updated page URL
 * @param {string} pathOrUrl - e.g. '/events/google-cloud-study-learn-2026' or full URL
 */
export const notifyIndexNow = (pathOrUrl) => {
  try {
    if (!pathOrUrl) return;
    const fullUrl = pathOrUrl.startsWith('http')
      ? pathOrUrl
      : `${BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;

    const endpoint = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(fullUrl)}&key=${INDEXNOW_KEY}`;

    // Browser-safe fire-and-forget notification
    fetch(endpoint, { mode: 'no-cors' }).catch(() => {});
    console.log(`[Auto-Index] Notified search engines for ${fullUrl}`);
  } catch (err) {
    console.warn('[Auto-Index] Notice:', err.message);
  }
};

export default {
  notifyIndexNow,
  INDEXNOW_KEY,
  BASE_URL,
};
