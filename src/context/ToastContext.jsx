import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from 'react-icons/fa';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = 'info', title = '', duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { id, message, type, title, duration };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep up to 5 toasts max

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = 'Success', duration = 4000) =>
      addToast({ message, type: 'success', title, duration }),
    error: (message, title = 'Error', duration = 4500) =>
      addToast({ message, type: 'error', title, duration }),
    info: (message, title = 'Notice', duration = 4000) =>
      addToast({ message, type: 'info', title, duration }),
    warning: (message, title = 'Warning', duration = 4000) =>
      addToast({ message, type: 'warning', title, duration }),
    dismiss: removeToast,
  };

  const getTheme = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-google-green text-base shrink-0" />,
          accentBg: 'bg-google-green',
          border: 'border-google-green/30',
          badge: 'bg-google-green/10 text-google-green',
        };
      case 'error':
        return {
          icon: <FaTimesCircle className="text-google-red text-base shrink-0" />,
          accentBg: 'bg-google-red',
          border: 'border-google-red/30',
          badge: 'bg-google-red/10 text-google-red',
        };
      case 'warning':
        return {
          icon: <FaExclamationTriangle className="text-amber-500 text-base shrink-0" />,
          accentBg: 'bg-amber-500',
          border: 'border-amber-500/30',
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        };
      default:
        return {
          icon: <FaInfoCircle className="text-google-blue text-base shrink-0" />,
          accentBg: 'bg-google-blue',
          border: 'border-google-blue/30',
          badge: 'bg-google-blue/10 text-google-blue',
        };
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Professional Toast Notifications Container - Bottom Right */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const theme = getTheme(t.type);
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`pointer-events-auto w-full relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border ${theme.border} shadow-2xl rounded-2xl p-4 overflow-hidden group`}
              >
                {/* Accent Top Strip */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${theme.accentBg}`} />

                <div className="flex items-start gap-3">
                  <div className="pt-0.5">{theme.icon}</div>

                  <div className="min-w-0 flex-1">
                    {t.title && (
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-0.5">
                        {t.title}
                      </h5>
                    )}
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {t.message}
                    </p>
                  </div>

                  <button
                    onClick={() => removeToast(t.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Dismiss"
                  >
                    <FaTimes size={11} />
                  </button>
                </div>

                {/* Progress bar countdown animation */}
                {t.duration > 0 && (
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: t.duration / 1000, ease: 'linear' }}
                    className={`absolute bottom-0 left-0 h-0.5 ${theme.accentBg} opacity-60`}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
