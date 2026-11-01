/**
 * Events Data Store & Cache
 * Manages in-memory and persistent localStorage caching for events.
 */

const STORAGE_KEY = 'gdg_all_events_cache';

// Initialize in-memory events cache from localStorage if available
const loadInitialEvents = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 1) {
        return parsed;
      }
    }
  } catch {}
  return [];
};

export const eventsData = loadInitialEvents();
let hasFullListLoaded = eventsData.length > 1;

// Dedicated cache for single events visited directly (e.g. via direct URL)
const singleEventsCache = new Map();

export const isFullEventsListLoaded = () => hasFullListLoaded;

/**
 * Replaces the in-memory and persistent cache with the complete list of events.
 */
export const setAllEventsData = (list) => {
  if (!Array.isArray(list)) return;
  eventsData.length = 0;
  eventsData.push(...list);
  hasFullListLoaded = list.length > 1;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {}
};

/**
 * Fast lookup for an event by ID or slug.
 */
export const getEventById = (id) => {
  if (!id) return null;

  // 1. Check in-memory eventsData
  const found = eventsData.find(
    (e) =>
      e._id === id ||
      e.id === id ||
      e.slug === id ||
      (e.timeline && e.timeline.some((t) => t.id === id))
  );
  if (found) return found;

  // 2. Check single events cache
  if (singleEventsCache.has(id)) {
    return singleEventsCache.get(id);
  }

  // 3. Fallback: Check localStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const localFound = parsed.find(
            (e) =>
              e._id === id ||
              e.id === id ||
              e.slug === id ||
              (e.timeline && e.timeline.some((t) => t.id === id))
          );
          if (localFound) return localFound;
        }
      }
    } catch {}
  }

  return null;
};

/**
 * Updates an event in-place if it exists, or caches it without polluting the full list.
 */
export const saveOrUpdateEvent = (updated) => {
  if (!updated) return;

  const targetId = updated._id || updated.id || updated.slug;
  if (targetId) {
    singleEventsCache.set(targetId, updated);
    if (updated.slug) singleEventsCache.set(updated.slug, updated);
  }

  const idx = eventsData.findIndex(
    (e) =>
      (updated._id && e._id === updated._id) ||
      (updated.id && e.id === updated.id) ||
      (updated.slug && e.slug === updated.slug)
  );

  if (idx !== -1) {
    eventsData[idx] = { ...eventsData[idx], ...updated };
    if (hasFullListLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsData));
      } catch {}
    }
  } else if (hasFullListLoaded) {
    // Only push to eventsData if we already have the full list loaded,
    // ensuring we never convert an empty list into a 1-item partial list.
    eventsData.push(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsData));
      } catch {}
    }
  }
};
