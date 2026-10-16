import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { clearApiCache } from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RealtimeContext = createContext({
  isConnected: false,
  lastUpdate: null,
});

export const RealtimeProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const connectSSE = useCallback(() => {
    // If an existing connection exists, close it cleanly
    if (eventSourceRef.current) {
      try {
        eventSourceRef.current.close();
      } catch (err) {
        console.debug('[Realtime] Previous connection close error:', err);
      }
      eventSourceRef.current = null;
    }

    try {
      const streamUrl = `${API_BASE}/realtime/stream`;
      const es = new EventSource(streamUrl);
      eventSourceRef.current = es;

      es.onopen = () => {
        if (!isMountedRef.current) return;
        setIsConnected(true);
      };

      // Listen to generic messages (like initial CONNECTED handshake)
      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed?.type === 'CONNECTED') {
            setIsConnected(true);
          }
        } catch {
          // ignore keepalive or plain text
        }
      };

      // Listen to database mutation broadcasts from backend
      es.addEventListener('db-update', (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { entity, action, data, timestamp } = payload || {};

          // Invalidate relevant cache immediately so any fetch gets freshly committed data
          if (entity) {
            clearApiCache(entity);
            clearApiCache(`/${entity}`);
          }

          setLastUpdate({ entity, action, timestamp: timestamp || Date.now() });

          // Dispatch window custom events for decoupled subscriptions across components
          const detail = { entity, action, data, timestamp: timestamp || Date.now() };
          window.dispatchEvent(new CustomEvent('gdg:db-update', { detail }));
          if (entity) {
            window.dispatchEvent(new CustomEvent(`gdg:${entity}:update`, { detail }));
          }
        } catch (err) {
          console.warn('[Realtime] Error processing SSE payload:', err);
        }
      });

      es.onerror = () => {
        if (!isMountedRef.current) return;
        setIsConnected(false);
        try {
          es.close();
        } catch {}
        eventSourceRef.current = null;

        // Reconnect after 4 seconds
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            connectSSE();
          }
        }, 4000);
      };
    } catch (err) {
      console.warn('[Realtime] Could not establish EventSource:', err);
      setIsConnected(false);
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          connectSSE();
        }
      }, 5000);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    connectSSE();

    // Reconnect immediately if browser reconnects or window regains focus
    const handleOnline = () => {
      connectSSE();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('online', handleOnline);
      clearTimeout(reconnectTimeoutRef.current);
      if (eventSourceRef.current) {
        try {
          eventSourceRef.current.close();
        } catch {}
      }
    };
  }, [connectSSE]);

  return (
    <RealtimeContext.Provider value={{ isConnected, lastUpdate }}>
      {children}
    </RealtimeContext.Provider>
  );
};

/**
 * Custom React hook to automatically subscribe to real-time database updates for specified entities.
 * Triggers `onUpdate` instantly whenever a matching mutation is committed to the database.
 * 
 * @param {string|string[]} entities - Entity name or array of names ('events', 'gallery', 'projects', 'team', 'alumni', 'sections', 'contact', etc.)
 * @param {Function} onUpdate - Callback function called with `{ entity, action, data }`
 */
export const useRealtimeSubscription = (entities, onUpdate) => {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    if (!entities) return;
    const targetEntities = Array.isArray(entities) ? entities : [entities];

    const handleEvent = (e) => {
      if (typeof onUpdateRef.current === 'function') {
        onUpdateRef.current(e.detail);
      }
    };

    targetEntities.forEach((entity) => {
      window.addEventListener(`gdg:${entity}:update`, handleEvent);
    });

    return () => {
      targetEntities.forEach((entity) => {
        window.removeEventListener(`gdg:${entity}:update`, handleEvent);
      });
    };
  }, [JSON.stringify(entities)]);
};

export const useRealtime = () => useContext(RealtimeContext);
