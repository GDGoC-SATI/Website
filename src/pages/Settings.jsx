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
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserAvatar } from '../utils/avatarHelper';
import { SettingsSkeleton } from '../components/common/Skeleton';

const Settings = () => {
  const { user, loading, isAuthenticated, updateProfile } = useAuth();
  const toast = useToast();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  // Storage key helper for privacy
  const getPrivacyKey = (userIdOrUsername) => `gdg_privacy_${userIdOrUsername}`;

  // Privacy & Preference settings (Defaults)
  const [isPrivate, setIsPrivate] = useState(false);
  const [hideEmail, setHideEmail] = useState(false);
  const [noEmailNotifications, setNoEmailNotifications] = useState(false);
  const [autoSaveFeedback, setAutoSaveFeedback] = useState('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, user, navigate]);

  // Load existing privacy settings
  useEffect(() => {
    if (user) {
      const key = getPrivacyKey(user.username || user._id);
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setIsPrivate(Boolean(parsed.isPrivate));
          setHideEmail(Boolean(parsed.hideEmail));
          setNoEmailNotifications(Boolean(parsed.noEmailNotifications));
          return;
        } catch {}
      }

      // Check user model settings if any
      if (user.privacySettings) {
        setIsPrivate(Boolean(user.privacySettings.isPrivate));
        setHideEmail(Boolean(user.privacySettings.hideEmail));
        setNoEmailNotifications(Boolean(user.privacySettings.noEmailNotifications));
      }
    }
  }, [user]);

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
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
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
                  onChange={() => {}} // Handled by container onClick
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
                  onChange={() => {}} // Handled by container onClick
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
                  onChange={() => {}} // Handled by container onClick
                  className="w-5 h-5 text-google-blue rounded focus:ring-google-blue shrink-0 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
