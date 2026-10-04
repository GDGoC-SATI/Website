import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCog,
  FaShieldAlt,
  FaMoon,
  FaSun,
  FaArrowLeft,
  FaUserSecret,
  FaEnvelope,
  FaBellSlash,
  FaCheck,
  FaTrashAlt,
  FaExclamationTriangle,
  FaTimes,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserAvatar } from '../utils/avatarHelper';
import { SettingsSkeleton } from '../components/common/Skeleton';
import usePageSEO from '../hooks/usePageSEO';

const Settings = () => {
  usePageSEO({
    title: 'Account Settings',
    description: 'Manage account credentials, profile privacy settings, notifications, and security options.',
    path: '/settings',
  });

  const { user, loading, isAuthenticated, updateProfile, deleteAccount } = useAuth();
  const toast = useToast();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  // Storage key helper for privacy
  const getPrivacyKey = (userIdOrUsername) => `gdg_privacy_${userIdOrUsername}`;

  // Privacy & Preference settings:
  // - Email is hidden by default for ALL users
  // - Admin profiles are private by default
  const [isPrivate, setIsPrivate] = useState(user?.role === 'admin');
  const [hideEmail, setHideEmail] = useState(true);
  const [noEmailNotifications, setNoEmailNotifications] = useState(false);
  const [autoSaveFeedback, setAutoSaveFeedback] = useState('');

  // Account Deletion Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, user, navigate]);

  // Load existing privacy settings with smart defaults
  useEffect(() => {
    if (user) {
      const defaultIsPrivate = user.role === 'admin';
      const key = getPrivacyKey(user.username || user._id);
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setIsPrivate(parsed.isPrivate !== undefined ? Boolean(parsed.isPrivate) : defaultIsPrivate);
          setHideEmail(parsed.hideEmail !== undefined ? Boolean(parsed.hideEmail) : true);
          setNoEmailNotifications(Boolean(parsed.noEmailNotifications));
          return;
        } catch { }
      }

      // Check user model settings if any
      if (user.privacySettings) {
        setIsPrivate(
          user.privacySettings.isPrivate !== undefined
            ? Boolean(user.privacySettings.isPrivate)
            : defaultIsPrivate
        );
        setHideEmail(
          user.privacySettings.hideEmail !== undefined
            ? Boolean(user.privacySettings.hideEmail)
            : true
        );
        setNoEmailNotifications(Boolean(user.privacySettings.noEmailNotifications));
      } else {
        setIsPrivate(defaultIsPrivate);
        setHideEmail(true);
      }
    }
  }, [user]);

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success('Your account has been deleted successfully.');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete account. Please try again.');
      console.error('Delete account error:', err);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', nextTheme);
  };

  // Instant auto-save handler for checkboxes
  const handleToggle = (settingKey, currentVal, setter) => {
    const newVal = !currentVal;
    setter(newVal);

    if (!user) return;

    const key = getPrivacyKey(user.username || user._id);
    const existing = {
      isPrivate,
      hideEmail,
      noEmailNotifications,
      [settingKey]: newVal,
    };

    // Save to local storage immediately
    localStorage.setItem(key, JSON.stringify(existing));

    // Also persist via updateProfile API
    updateProfile({
      privacySettings: existing,
    }).catch((err) => {
      console.warn('Privacy settings saved locally (API warning):', err.message);
    });

    setAutoSaveFeedback('Setting updated and saved automatically');
    const labelMap = {
      isPrivate: newVal ? 'Profile is now Private (Admins can still view)' : 'Profile is now Public to all members',
      hideEmail: newVal ? 'Your email is now hidden from other members' : 'Your email is now visible to other members',
      noEmailNotifications: newVal ? 'Email notifications disabled' : 'Email notifications enabled',
    };
    toast.success(labelMap[settingKey] || 'Privacy preference saved');
    setTimeout(() => {
      setAutoSaveFeedback('');
    }, 2500);
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-15 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-google-blue dark:text-slate-400 transition-colors"
          >
            <FaArrowLeft /> Back to Profile
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-google-blue/10 text-google-blue flex items-center justify-center text-2xl">
              <FaCog />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Account Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your privacy options, visibility, and notification preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <UserAvatar user={user} size="sm" />
            <div className="pr-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">@{user.username || 'user'}</p>
            </div>
          </div>
        </div>

        {/* Auto-save notification feedback */}
        <AnimatePresence>
          {autoSaveFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold flex items-center gap-2"
            >
              <FaCheck /> {autoSaveFeedback}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Section: Profile Privacy Settings (Only requested settings, auto-saving) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center text-base">
                <FaShieldAlt />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Profile & Privacy Settings
                </h2>
                <p className="text-xs text-slate-500">
                  Settings update and save automatically as soon as you toggle them
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {/* 1. Make my profile private / public */}
              <div
                onClick={() => handleToggle('isPrivate', isPrivate, setIsPrivate)}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-google-blue/40 cursor-pointer transition-all"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                    <FaUserSecret size={15} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      Make my profile private / public
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      When turned on, no one can view your profile details and the private profile interface will appear to other users
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => { }} // Handled by container onClick
                  className="w-5 h-5 text-google-blue rounded focus:ring-google-blue shrink-0 cursor-pointer"
                />
              </div>

              {/* 2. Hide my email */}
              <div
                onClick={() => handleToggle('hideEmail', hideEmail, setHideEmail)}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-google-blue/40 cursor-pointer transition-all"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-google-red/10 text-google-red flex items-center justify-center shrink-0 mt-0.5">
                    <FaEnvelope size={14} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      Hide my email
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Your email address will be completely hidden from others when they visit your profile
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={hideEmail}
                  onChange={() => { }} // Handled by container onClick
                  className="w-5 h-5 text-google-blue rounded focus:ring-google-blue shrink-0 cursor-pointer"
                />
              </div>

              {/* 3. Don't send Email notifications */}
              <div
                onClick={() =>
                  handleToggle('noEmailNotifications', noEmailNotifications, setNoEmailNotifications)
                }
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-google-blue/40 cursor-pointer transition-all"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                    <FaBellSlash size={14} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      Don't send Email notifications
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Disable all promotional, event alerts, and community reminder emails
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={noEmailNotifications}
                  onChange={() => { }} // Handled by container onClick
                  className="w-5 h-5 text-google-blue rounded focus:ring-google-blue shrink-0 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>

          {/* Danger Zone: Account Deletion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-red-200 dark:border-red-950/60 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <FaTrashAlt size={16} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">
                  Danger Zone
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Irreversible account actions
                </p>
              </div>
            </div>

            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete Account
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
                  Permanently delete your profile, showcased projects, credentials, and chapter membership records. This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmationText('');
                  setIsDeleteModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95 transition-all shrink-0"
              >
                <FaTrashAlt size={12} />
                Delete My Account
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-200 dark:border-red-900/50 relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Close modal"
              >
                <FaTimes size={15} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <FaExclamationTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Delete Your Account
                  </h3>
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                    Warning: This action is permanent!
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                All your profile details, portfolio items, achievements, and settings will be permanently erased from GDG on Campus SATI Vidisha.
              </p>

              <div className="mb-6 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  To confirm, type <span className="font-mono font-bold text-red-600 dark:text-red-400">DELETE</span> below:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${deleteConfirmationText.trim().toUpperCase() === 'DELETE' && !isDeleting
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95'
                      : 'bg-red-300 dark:bg-red-950 text-white/50 cursor-not-allowed'
                    }`}
                >
                  <FaTrashAlt size={12} />
                  {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
