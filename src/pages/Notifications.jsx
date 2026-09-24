import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBell,
  FaCheckDouble,
  FaTrash,
  FaArrowLeft,
  FaSearch,
  FaSyncAlt,
  FaBullhorn,
  FaCalendarAlt,
  FaProjectDiagram,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications,
  } = useNotifications();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || searchParams.get('tab') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [activeCategory, setActiveCategoryState] = useState(initialCategory);
  const [searchQuery, setSearchQueryState] = useState(initialQuery);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync category change with URL params
  const setActiveCategory = (cat) => {
    setActiveCategoryState(cat);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat === 'all') {
        next.delete('category');
      } else {
        next.set('category', cat);
      }
      next.delete('tab');
      return next;
    }, { replace: true });
  };

  // Sync search query change with URL params
  const setSearchQuery = (q) => {
    setSearchQueryState(q);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!q.trim()) {
        next.delete('q');
      } else {
        next.set('q', q);
      }
      return next;
    }, { replace: true });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshNotifications();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filter categories
  const categories = [
    { id: 'all', label: 'All Notifications', count: notifications.length },
    {
      id: 'broadcast',
      label: 'Broadcasts & Announcements',
      count: notifications.filter(
        (n) => n.type === 'broadcast' || n.category?.toLowerCase().includes('announcement') || n.category?.toLowerCase().includes('broadcast')
      ).length,
    },
    {
      id: 'event',
      label: 'Events & Workshops',
      count: notifications.filter((n) => n.category?.toLowerCase().includes('event') || n.category?.toLowerCase().includes('workshop')).length,
    },
    {
      id: 'project',
      label: 'Projects',
      count: notifications.filter((n) => n.category?.toLowerCase().includes('project')).length,
    },
    { id: 'unread', label: 'Unread Only', count: unreadCount },
  ];

  const filteredNotifications = notifications.filter((item) => {
    // Category filter
    if (activeCategory === 'unread' && !item.unread) return false;
    if (activeCategory === 'broadcast') {
      const isB = item.type === 'broadcast' || item.category?.toLowerCase().includes('announcement') || item.category?.toLowerCase().includes('broadcast');
      if (!isB) return false;
    }
    if (activeCategory === 'event') {
      const isE = item.category?.toLowerCase().includes('event') || item.category?.toLowerCase().includes('workshop');
      if (!isE) return false;
    }
    if (activeCategory === 'project') {
      const isP = item.category?.toLowerCase().includes('project');
      if (!isP) return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchMessage = item.message?.toLowerCase().includes(q);
      return matchTitle || matchCategory || matchMessage;
    }

    return true;
  });

  const getCategoryTheme = (category = '', type = '') => {
    const c = category.toLowerCase();
    if (type === 'broadcast' || c.includes('broadcast') || c.includes('announcement')) {
      return {
        icon: <FaBullhorn className="text-google-blue" />,
        badgeBg: 'bg-google-blue/10 text-google-blue border-google-blue/20',
        badgeText: 'BROADCAST',
      };
    }
    if (c.includes('event') || c.includes('workshop')) {
      return {
        icon: <FaCalendarAlt className="text-google-yellow" />,
        badgeBg: 'bg-google-yellow/10 text-google-yellow border-google-yellow/20',
        badgeText: 'EVENT',
      };
    }
    if (c.includes('project')) {
      return {
        icon: <FaProjectDiagram className="text-google-green" />,
        badgeBg: 'bg-google-green/10 text-google-green border-google-green/20',
        badgeText: 'PROJECT',
      };
    }
    return {
      icon: <FaInfoCircle className="text-purple-500" />,
      badgeBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      badgeText: 'UPDATE',
    };
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-google-blue dark:text-slate-400 transition-colors"
          >
            <FaArrowLeft /> Back to Home
          </Link>
        </div>

        {/* Header (Avyukt UI reference) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-google-red text-white shadow-sm shadow-google-red/20 animate-pulse">
                  {unreadCount} new
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  All caught up
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Consolidated community updates, broadcasts, and announcements from GDG on Campus SATI.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              title="Refresh notifications"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-google-blue transition-all"
            >
              <FaSyncAlt size={13} className={isRefreshing ? 'animate-spin text-google-blue' : ''} />
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 rounded-xl bg-google-red/10 hover:bg-google-red text-google-red hover:text-white border border-google-red/20 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <FaCheckDouble size={11} /> Mark all as read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-500 text-xs font-semibold transition-all"
                title="Clear all notifications"
              >
                <FaTrash size={11} />
              </button>
            )}
          </div>
        </div>

        {/* STICKY BAR: Search & Category Filter (Avyukt UI style, sticky below navbar) */}
        <div className="sticky top-[88px] md:top-[96px] z-30 mb-8 p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-3">
          {/* Top row: Search input & Status info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search notifications, announcements, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 focus:outline-none focus:border-google-blue text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
              />
            </div>

            <div className="text-right shrink-0 hidden sm:block">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {categories.find((c) => c.id === activeCategory)?.label || 'All'}
                </strong>{' '}
                <span className="text-google-blue font-bold">({filteredNotifications.length})</span>
              </span>
            </div>
          </div>

          {/* Bottom row: Filter tabs with counts */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar no-scrollbar pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-google-blue text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List (Avyukt UI reference layout) */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <FaBell className="text-4xl text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              No notifications found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No notifications matching "${searchQuery}".`
                : activeCategory === 'unread'
                ? 'All caught up! You have read all notifications.'
                : 'Your notifications inbox is clean.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredNotifications.map((notif) => {
                const theme = getCategoryTheme(notif.category, notif.type);
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer hover:shadow-md ${
                      notif.unread
                        ? 'border-google-blue/30 bg-blue-50/20 dark:bg-blue-950/10 shadow-sm'
                        : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Header Row of Notification */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Status Dot */}
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            notif.unread ? 'bg-google-blue animate-pulse' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        />

                        {/* Category Icon */}
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-sm">
                          {theme.icon}
                        </div>

                        {/* Category Title & Badge */}
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {notif.category || 'GDG SATI Update'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${theme.badgeBg}`}
                          >
                            {notif.priority || theme.badgeText}
                          </span>
                        </div>
                      </div>

                      {/* Right Meta: Date & Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-slate-400">
                          {notif.date || 'Today'} • {notif.timestamp || 'Recent'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Notification Inset Message Box (Avyukt UI style) */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 ml-5 sm:ml-6">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        {notif.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {notif.message || notif.title}
                      </p>

                      {notif.author && (
                        <p className="text-[11px] text-slate-400 mt-2 font-medium">
                          From: {notif.author}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
