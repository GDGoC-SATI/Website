import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaCamera,
  FaSave,
  FaCheck,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGlobe,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const ProfileModal = () => {
  const { user, isProfileOpen, setIsProfileOpen, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [socials, setSocials] = useState({
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
      setSocials({
        github: user.socials?.github || '',
        linkedin: user.socials?.linkedin || '',
        twitter: user.socials?.twitter || '',
        instagram: user.socials?.instagram || '',
        website: user.socials?.website || '',
      });
    }
  }, [user, isProfileOpen]);

  if (!isProfileOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await updateProfile({ name, username, bio, avatar, socials });
      if (res.success) {
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitial = () => {
    return (user.name || user.email || 'U').charAt(0).toUpperCase();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-28 bg-gradient-to-r from-google-blue via-blue-600 to-indigo-600 p-6 flex justify-between items-start">
            <div className="text-white">
              <h3 className="text-xl font-bold">User Profile</h3>
              <p className="text-white/80 text-xs mt-0.5">Manage your personal information</p>
            </div>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Profile Picture Overlap */}
          <div className="px-6 -mt-12 flex items-end justify-between">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-lg flex items-center justify-center">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={() => setAvatar('')}
                  />
                ) : (
                  <span className="text-3xl font-black text-google-blue">{getInitial()}</span>
                )}
              </div>
            </div>
            <div className="pb-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-google-red/10 text-google-red border border-google-red/20'
                    : 'bg-google-blue/10 text-google-blue border border-google-blue/20'
                }`}
              >
                <FaShieldAlt size={11} /> {user.role === 'admin' ? 'Admin' : 'Member'}
              </span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {successMsg && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-xl text-xs flex items-center gap-2">
                <FaCheck /> {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-google-blue outline-none text-slate-800 dark:text-white"
                  />
                  <FaUser className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 text-xs">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-google-blue outline-none text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Email (Read-Only)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-500 cursor-not-allowed"
                />
                <FaEnvelope className="absolute left-3 top-2.5 text-slate-400 text-xs" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Avatar Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-google-blue outline-none text-slate-800 dark:text-white"
                />
                <FaCamera className="absolute left-3 top-2.5 text-slate-400 text-xs" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Bio / About You
              </label>
              <textarea
                rows="2"
                placeholder="Developer, GDG enthusiast..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-google-blue outline-none resize-none text-slate-800 dark:text-white"
              />
            </div>

            {/* Social Media Links Section */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <FaGlobe className="text-google-blue" /> Social Media & Portfolio Links
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* GitHub */}
                <div className="relative">
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    value={socials.github}
                    onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-google-blue outline-none text-slate-800 dark:text-white"
                  />
                  <FaGithub className="absolute left-2.5 top-2 text-slate-400 text-xs" />
                </div>

                {/* LinkedIn */}
                <div className="relative">
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={socials.linkedin}
                    onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-google-blue outline-none text-slate-800 dark:text-white"
                  />
                  <FaLinkedin className="absolute left-2.5 top-2 text-[#0A66C2] text-xs" />
                </div>

                {/* Twitter / X */}
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Twitter / X URL"
                    value={socials.twitter}
                    onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-google-blue outline-none text-slate-800 dark:text-white"
                  />
                  <FaTwitter className="absolute left-2.5 top-2 text-[#1DA1F2] text-xs" />
                </div>

                {/* Instagram */}
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Instagram URL"
                    value={socials.instagram}
                    onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-google-blue outline-none text-slate-800 dark:text-white"
                  />
                  <FaInstagram className="absolute left-2.5 top-2 text-[#E4405F] text-xs" />
                </div>

                {/* Website */}
                <div className="sm:col-span-2 relative">
                  <input
                    type="url"
                    placeholder="Website / Portfolio URL"
                    value={socials.website}
                    onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-google-blue outline-none text-slate-800 dark:text-white"
                  />
                  <FaGlobe className="absolute left-2.5 top-2 text-google-green text-xs" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-google-blue hover:bg-blue-600 text-white shadow-lg shadow-google-blue/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <FaSave size={12} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;
