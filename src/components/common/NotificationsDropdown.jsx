import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheckDouble, FaBell, FaCircle } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';

const NotificationsDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="fixed left-3 right-3 top-[76px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-96 max-w-sm sm:max-w-none mx-auto sm:mx-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-3 z-[110] overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-google-blue/15 text-google-blue">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-semibold text-google-blue hover:underline flex items-center gap-1 transition-colors"
            >
              <FaCheckDouble size={10} /> Mark all read
            </button>
          )}
        </div>

        {/* Vertical Scrollable List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <FaBell className="mx-auto mb-2 opacity-30 text-2xl" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 6).map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors relative flex items-start gap-3 ${
                  notif.unread ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                }`}
              >
                {notif.unread && (
                  <span className="w-2 h-2 rounded-full bg-google-blue shrink-0 mt-1.5" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                      {notif.category}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                    {notif.title}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 px-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            to="/notifications"
            onClick={onClose}
            className="inline-block py-1.5 text-xs font-bold text-google-blue hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationsDropdown;
