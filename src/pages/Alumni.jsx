import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaQuoteLeft,
  FaExternalLinkAlt,
  FaChevronDown,
  FaRocket,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaTimes,
  FaSave,
  FaSpinner,
  FaGraduationCap,
  FaLayerGroup,
} from 'react-icons/fa';
import { alumniData as initialAlumni } from '../data/alumniData';
import { useAuth } from '../context/AuthContext';
import ViewToggle from '../components/common/ViewToggle';
import usePageSEO from '../hooks/usePageSEO';
import { api } from '../services/api';

// --- Alumni List Item (for List View) ---
const AlumniListItem = ({
  alumni,
  index,
  isAdmin,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.25) }}
      className="relative bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group overflow-hidden"
    >
      <div className={`flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1 ${isAdmin ? 'pr-20 sm:pr-0' : ''}`}>
        <img
          src={alumni.image}
          alt={alumni.name}
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800 shadow-sm"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
            <span
              className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shrink-0"
              style={{ backgroundColor: alumni.color || '#4285F4' }}
            >
              {alumni.era}
            </span>
            <span className="text-xs font-semibold text-google-blue shrink-0">
              Batch {alumni.batch}
            </span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-[130px] sm:max-w-none">
              ({alumni.org})
            </span>
          </div>

          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {alumni.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[220px] sm:max-w-[1020px]">
            {alumni.role}
          </p>

          {alumni.skills && alumni.skills.length > 0 && (
            <div className="flex gap-1 mt-2 max-w-[220px] sm:max-w-[1020px] overflow-hidden">
              {alumni.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-[9px] sm:text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 truncate max-w-[150px]"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Controls Top-Right Inside Card */}
      {isAdmin && (
        <div className="absolute top-3.5 right-3.5 sm:static flex items-center gap-1 z-10 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-2">
          {canMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Move Up"
            >
              <FaArrowUp size={11} />
            </button>
          )}
          {canMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Move Down"
            >
              <FaArrowDown size={11} />
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 text-slate-400 hover:text-google-blue rounded-lg hover:bg-google-blue/10 transition-colors cursor-pointer"
            title="Edit Alumni"
          >
            <FaEdit size={11} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-google-red rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            title="Delete Alumni"
          >
            <FaTrash size={11} />
          </button>
        </div>
      )}

      {/* Social Links on mobile sit cleanly at the bottom */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1">
          {alumni.linkedin && (
            <a
              href={alumni.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-[#0077b5] transition-colors"
              title="LinkedIn"
            >
              <FaLinkedin size={14} />
            </a>
          )}
          {alumni.github && (
            <a
              href={alumni.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="GitHub"
            >
              <FaGithub size={14} />
            </a>
          )}
          {alumni.instagram && (
            <a
              href={alumni.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-[#e4405f] transition-colors"
              title="Instagram"
            >
              <FaInstagram size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Legacy Profile Card (Exact Original with Admin Controls) ---
const LegacyProfileCard = ({
  alumni,
  index,
  isAdmin,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full group overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl dark:shadow-google-blue/5 hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Background Decorative Glow */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: alumni.color }}
      />

      {/* Admin Controls Overlay */}
      {isAdmin && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-6 right-6 z-30 flex items-center gap-1.5 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border border-slate-700"
        >
          {canMoveUp && (
            <button
              type="button"
              title="Move Up"
              onClick={onMoveUp}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <FaArrowUp size={12} />
            </button>
          )}
          {canMoveDown && (
            <button
              type="button"
              title="Move Down"
              onClick={onMoveDown}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <FaArrowDown size={12} />
            </button>
          )}
          <button
            type="button"
            title="Edit Alumni"
            onClick={onEdit}
            className="p-1.5 text-google-blue hover:bg-google-blue/20 rounded-lg transition-colors cursor-pointer"
          >
            <FaEdit size={12} />
          </button>
          <button
            type="button"
            title="Delete Alumni"
            onClick={onDelete}
            className="p-1.5 text-google-red hover:bg-google-red/20 rounded-lg transition-colors cursor-pointer"
          >
            <FaTrash size={12} />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row min-h-[400px] items-stretch">
        {/* Left Section: Visual & Photo */}
        <div className="lg:w-2/5 relative overflow-hidden bg-slate-50 dark:bg-slate-800/50 p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
          <div className="relative mb-8">
            <div
              className={`absolute -inset-4 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 opacity-50 transition-transform duration-700 ease-out ${
                isHovered ? 'rotate-45 scale-105' : 'rotate-0 scale-100'
              }`}
              style={{ borderColor: isHovered ? alumni.color : undefined }}
            />
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-slate-100 dark:bg-slate-800">
              {imgError || !alumni.image ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-6xl font-black text-slate-400 select-none">
                  {(alumni.name || 'A').charAt(0)}
                </div>
              ) : (
                <img
                  src={alumni.image}
                  alt={alumni.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {alumni.linkedin && (
              <a
                href={alumni.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#0077b5] dark:hover:text-[#0077b5] border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 shadow-lg group/icon"
              >
                <FaLinkedin size={22} />
              </a>
            )}
            {alumni.github && (
              <a
                href={alumni.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 shadow-lg group/icon"
              >
                <FaGithub size={22} />
              </a>
            )}
            {alumni.instagram && (
              <a
                href={alumni.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#e4405f] dark:hover:text-[#e4405f] border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 shadow-lg group/icon"
              >
                <FaInstagram size={22} />
              </a>
            )}
          </div>
        </div>

        {/* Right Section: Core Info */}
        <div className="lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          <div className="absolute top-12 right-12 text-slate-100 dark:text-white/5 pointer-events-none group-hover:text-google-blue/10 transition-colors hidden md:block">
            <FaQuoteLeft size={120} />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: alumni.color }}
            >
              {alumni.era}
            </span>
          </div>

          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 z-[10]">
            {alumni.name}
          </h3>

          <p className="text-lg md:text-xl font-bold text-google-blue mb-8">{alumni.role}</p>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg italic mb-10 border-l-4 border-slate-100 dark:border-slate-800 pl-6">
            "{alumni.bio}"
          </p>

          <div className="flex flex-wrap gap-2 pt-4">
            {(Array.isArray(alumni.skills) ? alumni.skills : []).map((skill, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Edit/Add Alumni Modal ---
const AlumniModal = ({ alumni, onClose, onSave, isNew = false }) => {
  const [formData, setFormData] = useState({
    name: alumni?.name || '',
    role: alumni?.role || '',
    batch: alumni?.batch || '2024',
    org: alumni?.org || 'GDG',
    era: alumni?.era || '2023 - 2024 Lead',
    color: alumni?.color || '#4285F4',
    bio: alumni?.bio || '',
    image: alumni?.image || '',
    linkedin: alumni?.linkedin || '',
    github: alumni?.github || '',
    instagram: alumni?.instagram || '',
    skills: alumni?.skills ? alumni.skills.join(', ') : '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...alumni,
      id: alumni?.id || `alumni-${Date.now()}`,
      ...formData,
      skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FaEdit className="text-google-blue" />
            {isNew ? 'Add Alumni Profile' : `Edit: ${alumni.name}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Batch Year
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                placeholder="2024"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Era Badge
              </label>
              <input
                type="text"
                value={formData.era}
                onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                placeholder="2023 - 2024 Lead"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization / Realm
              </label>
              <input
                type="text"
                value={formData.org}
                onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                placeholder="GDG, GDSC, or GDGoC"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Image URL / Path
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bio / Quote
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Skills / Technologies (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="System Architecture, Mentorship, Go"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">LinkedIn</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">GitHub</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2"
            >
              <FaSave /> Save Alumni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Alumni Component (Exact Original) ---
const Alumni = () => {
  usePageSEO({
    title: 'Alumni Network',
    description: 'Explore the journey and success of GDG on Campus SATI Vidisha alumni working at top technology companies and high-growth startups globally.',
    path: '/alumni',
  });

  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBatch = searchParams.get('batch') || 'All';
  const initialOrg = searchParams.get('org') || 'All';
  const initialQuery = searchParams.get('q') || '';
  const initialView = searchParams.get('view') || (typeof window !== 'undefined' && window.innerWidth < 768 ? 'list' : 'grid');

  const [alumniList, setAlumniList] = useState(() => {
    try {
      const saved = localStorage.getItem('gdg_alumni_list');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAlumni;
    } catch {
      return initialAlumni;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch alumni directly from MongoDB backend
  const fetchAlumniFromDb = useCallback(async (skipCache = false) => {
    try {
      const res = await api.alumni.getAll(skipCache);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      if (list.length > 0) {
        const normalized = list.map((a) => ({
          ...a,
          id: a._id || a.id,
          _id: a._id || a.id,
          skills: Array.isArray(a.skills) ? a.skills : [],
        }));
        setAlumniList(normalized);
        try {
          localStorage.setItem('gdg_alumni_list', JSON.stringify(normalized));
        } catch {}
      }
    } catch (err) {
      console.warn('Could not fetch alumni from DB, using cache/fallback:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumniFromDb();
  }, [fetchAlumniFromDb]);

  const saveAlumniToStorage = (updated) => {
    setAlumniList(updated);
    try {
      localStorage.setItem('gdg_alumni_list', JSON.stringify(updated));
    } catch {}
  };
  const [searchQuery, setSearchQueryState] = useState(initialQuery);
  const [selectedBatch, setSelectedBatchState] = useState(initialBatch);
  const [selectedOrg, setSelectedOrgState] = useState(initialOrg);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isOrgOpen, setIsOrgOpen] = useState(false);
  const [view, setViewState] = useState(initialView);

  // Prevent auto-scrolling to bottom when list changes
  const scrollAnchorToControls = useCallback(() => {
    const controlsEl = document.getElementById('alumni-controls');
    if (controlsEl) {
      const rect = controlsEl.getBoundingClientRect();
      if (rect.top < 0) {
        if (window.lenis) {
          window.lenis.scrollTo(controlsEl, { offset: -90, duration: 0.4 });
        } else {
          window.scrollTo({
            top: window.scrollY + rect.top - 90,
            behavior: 'smooth',
          });
        }
      }
    }
  }, []);

  const setSearchQuery = (q) => {
    setSearchQueryState(q);
    scrollAnchorToControls();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!q.trim()) next.delete('q');
      else next.set('q', q);
      return next;
    }, { replace: true });
  };

  const setSelectedBatch = (batch) => {
    setSelectedBatchState(batch);
    scrollAnchorToControls();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (batch === 'All') next.delete('batch');
      else next.set('batch', batch);
      return next;
    }, { replace: true });
  };

  const setSelectedOrg = (org) => {
    setSelectedOrgState(org);
    scrollAnchorToControls();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (org === 'All') next.delete('org');
      else next.set('org', org);
      return next;
    }, { replace: true });
  };

  const setView = (v) => {
    setViewState(v);
    scrollAnchorToControls();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('view', v);
      return next;
    }, { replace: true });
  };

  // Admin Modal state
  const [modalState, setModalState] = useState(null); // { alumni, index, isNew }

  const batches = ['All', ...new Set(alumniList.map((a) => a.batch).filter(Boolean))].sort();
  const orgs = ['All', 'GDG', 'GDSC', 'GDGoC'];

  const handleMoveAlumni = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= alumniList.length) return;
    const updated = [...alumniList];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    saveAlumniToStorage(updated);

    if (isAdmin) {
      const orderedIds = updated.map((a) => a._id).filter(Boolean);
      if (orderedIds.length > 0) {
        try {
          await api.alumni.reorder(orderedIds);
        } catch (err) {
          console.error('Failed to sync alumni reorder with DB:', err);
        }
      }
    }
  };

  const handleDeleteAlumni = async (index) => {
    const member = alumniList[index];
    if (!member) return;
    if (window.confirm(`Delete alumni entry for "${member.name}"?`)) {
      const updated = alumniList.filter((_, i) => i !== index);
      saveAlumniToStorage(updated);
      if (member._id) {
        try {
          await api.alumni.delete(member._id);
        } catch (err) {
          console.error('Failed to delete alumni from DB:', err);
        }
      }
    }
  };

  const handleSaveAlumni = async (saved) => {
    if (!modalState) return;

    const payload = {
      name: saved.name,
      role: saved.role,
      era: saved.era || 'The Pioneers',
      batch: saved.batch || '2024',
      org: saved.org || 'GDSC',
      color: saved.color || '#4285F4',
      bio: saved.bio || '',
      image: saved.image || '',
      skills: Array.isArray(saved.skills) ? saved.skills : [],
      linkedin: saved.linkedin || '',
      github: saved.github || '',
      instagram: saved.instagram || '',
    };

    if (modalState.isNew) {
      try {
        const res = await api.alumni.create(payload);
        if (res?.data?._id) {
          saved._id = res.data._id;
          saved.id = res.data._id;
        }
      } catch (err) {
        console.error('Failed to create alumni in DB:', err);
      }
      saveAlumniToStorage([saved, ...alumniList]);
    } else {
      const targetId = saved._id || saved.id;
      if (targetId) {
        try {
          await api.alumni.update(targetId, payload);
        } catch (err) {
          console.error('Failed to update alumni in DB:', err);
        }
      }
      const updated = [...alumniList];
      updated[modalState.index] = saved;
      saveAlumniToStorage(updated);
    }
    fetchAlumniFromDb(true);
  };

  const filteredAlumni = alumniList.filter((alumni) => {
    const name = alumni.name || '';
    const role = alumni.role || '';
    const skills = Array.isArray(alumni.skills) ? alumni.skills : [];
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !q ||
      name.toLowerCase().includes(q) ||
      role.toLowerCase().includes(q) ||
      skills.some((s) => typeof s === 'string' && s.toLowerCase().includes(q));

    const matchesBatch = selectedBatch === 'All' || alumni.batch === selectedBatch;
    const matchesOrg =
      selectedOrg === 'All' ||
      (alumni.org && alumni.org.toLowerCase().includes(selectedOrg.toLowerCase()));

    return matchesSearch && matchesBatch && matchesOrg;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 transition-colors duration-500 pb-40 relative">
      {/* Background Ambience (Exact Original) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] bg-google-blue/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[60vw] h-[60vw] bg-google-red/5 blur-[140px] rounded-full animate-pulse-slow" />
      </div>

      {/* Header Banner - Standardized across pages */}
      <div className="relative bg-slate-50/70 dark:bg-slate-900/40 pt-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden mb-1">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-google-blue/10 text-google-blue border border-google-blue/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4"
          >
            <FaRocket className="text-xs" />
            <span>Community Legacy</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4"
          >
            Our <span className="text-google-blue">Alumni</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Search through our archive of legends who shaped the tech ecosystem at SATI.
          </motion.p>

          {/* Admin Add Alumni Button */}
          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setModalState({
                    alumni: {
                      name: '',
                      era: 'THE PIONEERS',
                      batch: '2024',
                      color: '#4285F4',
                      org: 'GDSC',
                      role: '',
                      company: '',
                      bio: '',
                      image: '',
                      skills: ['Leadership'],
                    },
                    index: -1,
                    isNew: true,
                  })
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-google-blue hover:bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
              >
                <FaPlus /> Add New Alumni
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">

        {/* Sticky Filter Controls Bar with View Switcher */}
        <div
          id="alumni-controls"
          className="sticky top-[80px] md:top-[80px] z-30 mb-8 py-1 px-3 sm:py-1.5 sm:px-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-center gap-2 sm:gap-2.5"
        >
          <div className="relative w-full md:flex-1 group">
            <input
              type="text"
              placeholder="Search by name, role or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-google-blue transition-colors">
              <FaExternalLinkAlt className="rotate-45" size={11} />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap sm:flex-nowrap">
            {/* Batch Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <button
                type="button"
                onClick={() => {
                  setIsBatchOpen(!isBatchOpen);
                  setIsOrgOpen(false);
                }}
                className="w-full sm:w-36 flex items-center justify-between px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-google-blue transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <FaGraduationCap className="text-google-blue text-xs shrink-0" />
                  <span className="truncate">
                    {selectedBatch === 'All' ? 'All Batches' : `Batch ${selectedBatch}`}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-slate-400 transition-transform duration-200 text-xs shrink-0 ${isBatchOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isBatchOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setIsBatchOpen(false)}
                  />
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-full sm:w-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 py-1.5 z-[100] max-h-60 overflow-y-auto">
                    {batches.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setSelectedBatch(year);
                          setIsBatchOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between cursor-pointer ${
                          selectedBatch === year
                            ? 'text-google-blue font-bold bg-google-blue/5'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span>{year === 'All' ? 'All Batches' : `Batch ${year}`}</span>
                        {selectedBatch === year && (
                          <span className="w-1.5 h-1.5 rounded-full bg-google-blue shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Org Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <button
                type="button"
                onClick={() => {
                  setIsOrgOpen(!isOrgOpen);
                  setIsBatchOpen(false);
                }}
                className="w-full sm:w-36 flex items-center justify-between px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-google-blue transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <FaLayerGroup className="text-google-green text-xs shrink-0" />
                  <span className="truncate">
                    {selectedOrg === 'All' ? 'All Realms' : selectedOrg}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-slate-400 transition-transform duration-200 text-xs shrink-0 ${isOrgOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOrgOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setIsOrgOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-full sm:w-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 py-1.5 z-[100] max-h-60 overflow-y-auto">
                    {orgs.map((org) => (
                      <button
                        key={org}
                        type="button"
                        onClick={() => {
                          setSelectedOrg(org);
                          setIsOrgOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between cursor-pointer ${
                          selectedOrg === org
                            ? 'text-google-green font-bold bg-green-500/5'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span>{org === 'All' ? 'All Realms' : org}</span>
                        {selectedOrg === org && (
                          <span className="w-1.5 h-1.5 rounded-full bg-google-green shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* List / Grid Switcher */}
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>

        {/* Content: List View vs Grid View (Cards Stream) */}
        {isLoading && alumniList.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <FaSpinner className="animate-spin text-google-blue text-4xl mb-4" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading alumni network...</p>
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              No Legacy Found
            </h3>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
        ) : view === 'list' ? (
          <div className="space-y-3 min-h-[450px]">
            {filteredAlumni.map((alumni, i) => (
              <AlumniListItem
                key={alumni.id || alumni._id || i}
                alumni={alumni}
                index={i}
                isAdmin={isAdmin}
                canMoveUp={i > 0}
                canMoveDown={i < filteredAlumni.length - 1}
                onMoveUp={() => handleMoveAlumni(i, -1)}
                onMoveDown={() => handleMoveAlumni(i, 1)}
                onEdit={() =>
                  setModalState({
                    alumni,
                    index: i,
                    isNew: false,
                  })
                }
                onDelete={() => handleDeleteAlumni(i)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8 min-h-[500px]">
            {filteredAlumni.map((alumni, i) => (
              <LegacyProfileCard
                key={alumni.id || alumni._id || i}
                alumni={alumni}
                index={i}
                isAdmin={isAdmin}
                canMoveUp={i > 0}
                canMoveDown={i < filteredAlumni.length - 1}
                onMoveUp={() => handleMoveAlumni(i, -1)}
                onMoveDown={() => handleMoveAlumni(i, 1)}
                onEdit={() =>
                  setModalState({
                    alumni,
                    index: i,
                    isNew: false,
                  })
                }
                onDelete={() => handleDeleteAlumni(i)}
              />
            ))}
          </div>
        )}

        {/* Simple Footer CTA (Exact Original) */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-40 text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-google-blue via-google-red to-google-yellow rounded-[3rem]">
            <div className="bg-white dark:bg-slate-900 px-12 py-8 rounded-[2.9rem]">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                Want to be part of the legacy?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto italic">
                "The best way to predict the future is to create it."
              </p>
              <a
                href="/contact"
                className="px-10 py-5 rounded-2xl bg-google-blue text-white font-black hover:scale-105 transition-all shadow-xl inline-block"
              >
                Join Our Community
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Admin Edit/Add Modal */}
      {modalState && (
        <AlumniModal
          alumni={modalState.alumni}
          isNew={modalState.isNew}
          onClose={() => setModalState(null)}
          onSave={handleSaveAlumni}
        />
      )}

      <style jsx="true">{`
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default Alumni;
