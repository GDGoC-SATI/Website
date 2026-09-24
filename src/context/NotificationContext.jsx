import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const NotificationContext = createContext();

export const DEFAULT_WELCOME_NOTIFICATION = {
  id: 'gdg-welcome-initial',
  category: 'GDG Announcement',
  title: 'Welcome to GDG on Campus SATI Vidisha!',
  message: 'Welcome to our developer community! Explore upcoming hackathons, collaborate on student projects, connect with alumni, and build the future of tech with us.',
  timestamp: 'Just now',
  date: 'Today',
  unread: true,
  type: 'welcome',
  isWelcome: true,
  createdAt: new Date().toISOString(),
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?._id || (isAuthenticated ? 'auth-user' : 'guest');

  // Broadcast notifications stored in DB (sections endpoint) & local fallback
  const [broadcasts, setBroadcasts] = useState(() => {
    try {
      const saved = localStorage.getItem('gdg_global_broadcasts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track user-specific read notification IDs
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`gdg_read_notifs_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track user-specific deleted notification IDs
  const [deletedIds, setDeletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`gdg_deleted_notifs_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Re-load read/deleted IDs when user changes
  useEffect(() => {
    try {
      const savedRead = localStorage.getItem(`gdg_read_notifs_${userId}`);
      setReadIds(savedRead ? JSON.parse(savedRead) : []);

      const savedDeleted = localStorage.getItem(`gdg_deleted_notifs_${userId}`);
      setDeletedIds(savedDeleted ? JSON.parse(savedDeleted) : []);
    } catch (e) {
      console.warn('Error loading user notification preferences:', e);
    }
  }, [userId]);

  // Persist readIds
  useEffect(() => {
    try {
      localStorage.setItem(`gdg_read_notifs_${userId}`, JSON.stringify(readIds));
    } catch (e) {
      console.warn('Error saving read notifications:', e);
    }
  }, [readIds, userId]);

  // Persist deletedIds
  useEffect(() => {
    try {
      localStorage.setItem(`gdg_deleted_notifs_${userId}`, JSON.stringify(deletedIds));
    } catch (e) {
      console.warn('Error saving deleted notifications:', e);
    }
  }, [deletedIds, userId]);

  // Fetch broadcasts from MongoDB via api.sections
  const loadBroadcastsFromDB = useCallback(async () => {
    try {
      const res = await api.sections.get('broadcast_notifications');
      if (res?.success && res?.data?.data?.broadcasts) {
        const dbBroadcasts = res.data.data.broadcasts;
        setBroadcasts(dbBroadcasts);
        localStorage.setItem('gdg_global_broadcasts', JSON.stringify(dbBroadcasts));
      }
    } catch (err) {
      // Graceful fallback to localStorage
      console.warn('Using local broadcasts fallback:', err.message);
    }
  }, []);

  useEffect(() => {
    loadBroadcastsFromDB();
  }, [loadBroadcastsFromDB]);

  // Welcome notification (only one single default for new users)
  const welcomeNotif = {
    ...DEFAULT_WELCOME_NOTIFICATION,
    id: `welcome-${userId}`,
  };

  // Compile full notifications for current user
  const allRawNotifications = [
    ...broadcasts.map((b) => ({
      ...b,
      type: b.type || 'broadcast',
    })),
    welcomeNotif,
  ];

  // Filter out deleted and compute read state
  const notifications = allRawNotifications
    .filter((n) => !deletedIds.includes(n.id))
    .map((n) => ({
      ...n,
      unread: !readIds.includes(n.id),
    }));

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds((prev) => Array.from(new Set([...prev, ...allIds])));
  };

  const markAsRead = (id) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const deleteNotification = (id) => {
    setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const clearAllNotifications = () => {
    const allIds = notifications.map((n) => n.id);
    setDeletedIds((prev) => Array.from(new Set([...prev, ...allIds])));
  };

  // Admin function: Send a broadcast message to all users and persist to DB
  const sendBroadcastNotification = async ({ title, category, message, priority = 'New' }) => {
    const newBroadcast = {
      id: `broadcast-${Date.now()}`,
      title: title.trim(),
      category: category || 'GDG Announcement',
      message: message.trim(),
      priority: priority || 'New',
      type: 'broadcast',
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      author: user?.name || 'Chapter Admin',
    };

    const updated = [newBroadcast, ...broadcasts];
    setBroadcasts(updated);
    try {
      localStorage.setItem('gdg_global_broadcasts', JSON.stringify(updated));
      await api.sections.update('broadcast_notifications', {
        title: 'Broadcast Notifications',
        description: 'System-wide announcements and updates for all users',
        data: { broadcasts: updated },
      });
    } catch (err) {
      console.warn('Failed to sync broadcast to DB, saved locally:', err.message);
    }
    return newBroadcast;
  };

  // Admin function: Delete broadcast notification from DB
  const deleteBroadcastNotification = async (broadcastId) => {
    const updated = broadcasts.filter((b) => b.id !== broadcastId);
    setBroadcasts(updated);
    try {
      localStorage.setItem('gdg_global_broadcasts', JSON.stringify(updated));
      await api.sections.update('broadcast_notifications', {
        title: 'Broadcast Notifications',
        description: 'System-wide announcements and updates for all users',
        data: { broadcasts: updated },
      });
    } catch (err) {
      console.warn('Failed to delete broadcast from DB:', err.message);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        broadcasts,
        unreadCount,
        markAllAsRead,
        markAsRead,
        deleteNotification,
        clearAllNotifications,
        sendBroadcastNotification,
        deleteBroadcastNotification,
        refreshNotifications: loadBroadcastsFromDB,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
