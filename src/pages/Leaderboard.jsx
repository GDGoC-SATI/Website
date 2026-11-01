import React, { useState, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaFilter,
  FaSortAmountDown,
  FaBookOpen,
  FaInfoCircle,
  FaTimes,
  FaArrowLeft,
  FaCloud,
  FaSyncAlt,
  FaList,
  FaThLarge,
  FaEdit,
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaSave,
  FaChevronDown,
  FaTable,
  FaExclamationTriangle,
  FaUserGraduate,
} from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  DEFAULT_SYLLABUS_LABS,
  DEFAULT_SYLLABUS_SOURCE_URL,
  convertToCsvUrl,
  parseParticipantsFromCsv,
  resolveCloudProfileAvatar,
} from '../data/cloudStudySyllabus';
import { getEventById, saveOrUpdateEvent } from '../data/eventsData';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import usePageSEO from '../hooks/usePageSEO';
import ViewToggle from '../components/common/ViewToggle';
import { ListItemSkeleton } from '../components/common/Skeleton';

// --- Badge Inspection Modal ---
const BadgeInspectionModal = ({ participant, syllabusLabs, onClose }) => {
  if (!participant) return null;

  const { name, avatar, profileUrl, completedLabs, verifiedCount } = participant;
  const labs = Array.isArray(syllabusLabs) && syllabusLabs.length > 0 ? syllabusLabs : DEFAULT_SYLLABUS_LABS;
  const completedIds = new Set((completedLabs || []).map((l) => l.id || l.title));

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 rounded-full p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 object-cover"
            />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-google-blue/10 text-google-blue font-bold">
                  {verifiedCount} / {labs.length} Labs
                </span>
              </h3>
              {profileUrl && (
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-google-blue hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  <span>Google Cloud Skills Boost Profile</span>
                  <FaExternalLinkAlt size={9} />
                </a>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Syllabus Progress Subtitle */}
        <div className="py-2.5 px-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl my-3 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 border border-blue-100 dark:border-blue-900/40 shrink-0">
          <FaInfoCircle className="text-google-blue shrink-0" size={13} />
          <span>
            Only completed badges matching this Study Jam's syllabus count towards milestone completion.
          </span>
        </div>

        {/* Syllabus Badges Checklist */}
        <div className="overflow-y-auto space-y-2 pr-1 flex-1">
          {labs.map((lab, idx) => {
            const isCompleted = completedIds.has(lab.id) || completedIds.has(lab.title);
            return (
              <div
                key={lab.id || idx}
                onClick={() => lab.url && window.open(lab.url, '_blank', 'noopener,noreferrer')}
                title={lab.url ? 'Click to open course in new tab' : undefined}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  lab.url ? 'cursor-pointer hover:border-google-blue/50 hover:shadow-sm' : ''
                } ${
                  isCompleted
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <FaCheckCircle size={12} /> : idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {lab.title}
                    </h4>
                    {lab.url && (
                      <span className="text-[11px] text-google-blue hover:underline inline-flex items-center gap-1 mt-0.5">
                        <span>Course Link</span>
                        <FaExternalLinkAlt size={8} />
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

// --- Official Syllabus Drawer/Modal ---
const SyllabusInfoModal = ({ syllabusLabs, sourceUrl, onClose }) => {
  const labs = Array.isArray(syllabusLabs) && syllabusLabs.length > 0 ? syllabusLabs : DEFAULT_SYLLABUS_LABS;
  const sourceSheet = sourceUrl || DEFAULT_SYLLABUS_SOURCE_URL;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <FaBookOpen className="text-google-blue text-xl" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Study Jam Syllabus Labs ({labs.length} Courses)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Required courses and skill badges for this program
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {sourceSheet && (
          <div className="py-2.5 px-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl my-3 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2 border border-blue-100 dark:border-blue-900/40 shrink-0">
            <div className="flex items-center gap-2">
              <FaInfoCircle size={13} className="text-google-blue shrink-0" />
              <span>Official Syllabus Spreadsheet Reference</span>
            </div>
            <a
              href={sourceSheet}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-google-blue underline shrink-0 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>Source Sheet</span>
              <FaExternalLinkAlt size={9} />
            </a>
          </div>
        )}

        <div className="overflow-y-auto space-y-2 pr-1 flex-1">
          {labs.map((lab, idx) => (
            <div
              key={lab.id || idx}
              onClick={() => lab.url && window.open(lab.url, '_blank', 'noopener,noreferrer')}
              title={lab.url ? 'Click to open course in new tab' : undefined}
              className={`p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between gap-3 transition-all ${
                lab.url ? 'cursor-pointer hover:border-google-blue/60 hover:shadow-md' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {lab.title}
                  </h4>
                  {lab.url && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{lab.url}</p>
                  )}
                </div>
              </div>
              {lab.url && (
                <div
                  className="p-2 rounded-xl text-slate-400 hover:text-google-blue hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                  title="Open Course"
                >
                  <FaExternalLinkAlt size={11} />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- Admin Edit Leaderboard Details Modal ---
const EditLeaderboardModal = ({
  event,
  currentConfig,
  onClose,
  onSave,
}) => {
  const [sheetUrl, setSheetUrl] = useState(currentConfig?.sheetUrl || '');
  const [syllabusSourceUrl, setSyllabusSourceUrl] = useState(
    currentConfig?.syllabusSourceUrl || DEFAULT_SYLLABUS_SOURCE_URL
  );
  const [labs, setLabs] = useState(() => {
    if (Array.isArray(currentConfig?.syllabusLabs) && currentConfig.syllabusLabs.length > 0) {
      return JSON.parse(JSON.stringify(currentConfig.syllabusLabs));
    }
    return JSON.parse(JSON.stringify(DEFAULT_SYLLABUS_LABS));
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleAddLab = () => {
    setLabs([
      ...labs,
      {
        id: `lab-${Date.now()}`,
        title: '',
        url: '',
      },
    ]);
  };

  const handleUpdateLab = (index, field, value) => {
    const updated = [...labs];
    updated[index] = { ...updated[index], [field]: value };
    setLabs(updated);
  };

  const handleRemoveLab = (index) => {
    setLabs(labs.filter((_, i) => i !== index));
  };

  const handleMoveLab = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= labs.length) return;
    const updated = [...labs];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setLabs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const config = {
        sheetUrl: sheetUrl.trim(),
        syllabusSourceUrl: syllabusSourceUrl.trim(),
        syllabusLabs: labs.filter((l) => l.title.trim().length > 0),
      };
      await onSave(config);
      onClose();
    } catch (err) {
      console.error('Failed to save leaderboard config:', err);
      alert(err.message || 'Error saving configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaEdit className="text-google-blue" />
              Configure Leaderboard & Syllabus
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For: {event?.title || 'Study Jam Event'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Participant Google Sheet URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <FaTable className="text-google-blue" />
              Participant Google Sheet Link / CSV URL
            </label>
            <input
              type="text"
              // required
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../pubhtml or /edit"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Paste your Google Sheet link (e.g. published web URL or view link). The system will fetch participant names, profile links, and completed badges.
            </p>
          </div>

          {/* Syllabus Source Sheet Reference URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <FaBookOpen className="text-google-green" />
              Syllabus Source Sheet Link
            </label>
            <input
              type="text"
              value={syllabusSourceUrl}
              onChange={(e) => setSyllabusSourceUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/e/.../pubhtml"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Link to the official syllabus spreadsheet shown in the syllabus modal for participants.
            </p>
          </div>

          {/* Syllabus Labs Interactive Manager */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FaCloud className="text-google-yellow" />
                  Syllabus Labs ({labs.length})
                </h4>
                <p className="text-[11px] text-slate-400">
                  Only badges matching these labs will count towards participant progress.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddLab}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-google-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors shadow-xs"
              >
                <FaPlus size={10} /> Add Lab
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {labs.map((lab, index) => (
                <div
                  key={lab.id || index}
                  className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-5 text-center text-xs font-bold text-slate-400">
                      {index + 1}.
                    </span>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveLab(index, -1)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                      title="Move Up"
                    >
                      <FaArrowUp size={10} />
                    </button>
                    <button
                      type="button"
                      disabled={index === labs.length - 1}
                      onClick={() => handleMoveLab(index, 1)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                      title="Move Down"
                    >
                      <FaArrowDown size={10} />
                    </button>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={lab.title}
                      onChange={(e) => handleUpdateLab(index, 'title', e.target.value)}
                      placeholder="Course / Lab Title"
                      className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-google-blue"
                    />
                    <input
                      type="text"
                      value={lab.url || ''}
                      onChange={(e) => handleUpdateLab(index, 'url', e.target.value)}
                      placeholder="https://www.skills.google/course_templates/..."
                      className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-google-blue"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveLab(index)}
                    className="p-1.5 text-google-red hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors shrink-0 self-end sm:self-center"
                    title="Delete Lab"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all"
            >
              <FaSave size={12} />
              <span>{isSaving ? 'Saving...' : 'Save & Sync Sheet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Study Jam Leaderboard Page ---
const Leaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const toast = useToast();

  const eventSlug = id || 'google-cloud-study-learn-2026';

  // Active event state
  const [event, setEvent] = useState(() => getEventById(id) || getEventById(eventSlug));
  const [loadingEvent, setLoadingEvent] = useState(!event);

  // Participant data from sheet
  const [participants, setParticipants] = useState([]);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [sheetError, setSheetError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('BADGES_DESC'); // BADGES_DESC, NAME_ASC
  const [viewMode, setViewMode] = useState('list'); // 'list' (Table) | 'grid' (Cards)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Modals
  const [inspectParticipant, setInspectParticipant] = useState(null);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Background resolver for real Cloud Skills Boost profile avatars
  useEffect(() => {
    let isCancelled = false;
    const resolveAvatars = async () => {
      for (const p of participants) {
        if (isCancelled) break;
        if (p.profileUrl && p.avatar && p.avatar.includes('ui-avatars.com')) {
          const resolved = await resolveCloudProfileAvatar(p.profileUrl);
          if (resolved && !isCancelled) {
            setParticipants((prev) =>
              prev.map((item) => (item.id === p.id ? { ...item, avatar: resolved } : item))
            );
          }
        }
      }
    };
    if (participants.length > 0) {
      resolveAvatars();
    }
    return () => {
      isCancelled = true;
    };
  }, [participants.length]);

  const handleParticipantClick = (e, profileUrl) => {
    if (e.target.closest('button')) return;
    if (profileUrl) {
      window.open(profileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // 1. Fetch Event Document
  useEffect(() => {
    let isMounted = true;
    const loadEvent = async () => {
      const local = getEventById(eventSlug);
      if (local && isMounted) {
        setEvent(local);
        setLoadingEvent(false);
      }

      try {
        const res = await api.events.getBySlug(eventSlug);
        if (res?.success && res?.data && isMounted) {
          const apiEvt = {
            ...res.data,
            id: res.data.slug || res.data.id || res.data._id,
          };
          setEvent(apiEvt);
          saveOrUpdateEvent(apiEvt);
        }
      } catch (err) {
        console.warn('API event fetch notice:', err.message);
      } finally {
        if (isMounted) setLoadingEvent(false);
      }
    };

    loadEvent();
    return () => {
      isMounted = false;
    };
  }, [eventSlug]);

  // Read leaderboard config from event or local cache
  const leaderboardConfig = useMemo(() => {
    const fromEvent = event?.leaderboard;
    if (fromEvent && typeof fromEvent === 'object' && Object.keys(fromEvent).length > 0) {
      return fromEvent;
    }
    // Fallback: check local storage cache keyed by event id/slug
    if (typeof window !== 'undefined' && eventSlug) {
      try {
        const cached = localStorage.getItem(`gdg_leaderboard_cfg_${eventSlug}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') return parsed;
        }
      } catch {}
    }
    return null;
  }, [event, eventSlug]);

  const syllabusLabs = useMemo(() => {
    if (
      Array.isArray(leaderboardConfig?.syllabusLabs) &&
      leaderboardConfig.syllabusLabs.length > 0
    ) {
      return leaderboardConfig.syllabusLabs;
    }
    return DEFAULT_SYLLABUS_LABS;
  }, [leaderboardConfig]);

  const syllabusSourceUrl = leaderboardConfig?.syllabusSourceUrl || DEFAULT_SYLLABUS_SOURCE_URL;

  // 2. Fetch and Parse Participants directly from the Google Sheet URL
  const fetchSheetData = async (config = leaderboardConfig) => {
    const sheetLink = config?.sheetUrl;
    if (!sheetLink) {
      setParticipants([]);
      setSheetError(null);
      return;
    }

    setLoadingSheet(true);
    setSheetError(null);

    try {
      const csvUrl = convertToCsvUrl(sheetLink);
      const res = await fetch(csvUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch spreadsheet (HTTP ${res.status}). Ensure the sheet is public or published.`);
      }

      const csvText = await res.text();
      if (!csvText || csvText.length < 10) {
        throw new Error('Spreadsheet returned empty content.');
      }

      const parsed = parseParticipantsFromCsv(csvText, config?.syllabusLabs || syllabusLabs);
      setParticipants(parsed);
    } catch (err) {
      console.error('Error fetching/parsing Google Sheet:', err);
      setSheetError(err.message || 'Could not load participant data from Google Sheet.');
      setParticipants([]);
    } finally {
      setLoadingSheet(false);
    }
  };

  useEffect(() => {
    if (leaderboardConfig?.sheetUrl) {
      fetchSheetData(leaderboardConfig);
    }
  }, [leaderboardConfig?.sheetUrl]);

  // Page SEO
  usePageSEO({
    title: event ? `${event.title} - Leaderboard` : 'Study Jam Leaderboard',
    description: `Official student progress and syllabus lab tracking for ${event?.title || 'Study Jams'} at GDG on Campus SATI Vidisha.`,
    path: `/events/${id || eventSlug}/leaderboard`,
  });

  // Filtered and Sorted participants (NO RANK CRITERIA)
  const filteredParticipants = useMemo(() => {
    return participants
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          return p.name.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'BADGES_DESC') {
          return b.verifiedCount - a.verifiedCount;
        }
        if (sortBy === 'NAME_ASC') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [participants, searchQuery, sortBy]);

  // Handle Save from Admin Edit Modal
  const handleSaveConfig = async (newConfig) => {
    const updated = {
      ...(event || {}),
      leaderboard: newConfig,
    };

    setEvent(updated);
    saveOrUpdateEvent(updated);

    // Save in localStorage for instant offline access
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gdg_leaderboard_cfg_${eventSlug}`, JSON.stringify(newConfig));
      } catch {}
    }

    // Persist to backend MongoDB
    try {
      const targetId = event?._id || event?.slug || eventSlug;
      let res;
      try {
        res = await api.events.updateLeaderboard(targetId, newConfig);
      } catch {
        const cleanPayload = { ...updated };
        delete cleanPayload._id;
        delete cleanPayload.id;
        delete cleanPayload.__v;
        res = await api.events.update(targetId, cleanPayload);
      }

      if (res?.success && res?.data) {
        const savedEvt = {
          ...res.data,
          id: res.data.slug || res.data.id || res.data._id,
        };
        setEvent(savedEvt);
        saveOrUpdateEvent(savedEvt);
      }
      toast?.success('Leaderboard configuration saved to database successfully!');
    } catch (err) {
      console.error('Could not persist leaderboard config to DB:', err);
      toast?.error(err.message || 'Failed to save configuration to database');
      throw err;
    }

    // Immediately fetch fresh sheet data with the new config
    await fetchSheetData(newConfig);
  };

  const totalLabsCount = syllabusLabs.length;
  const eventTitle = event?.title || 'Google Cloud Study Learn 2026';
  const eventBackId = event?.slug || event?.id || id || '';

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Header Banner - Standardized matching other website pages */}
      <div className="relative bg-slate-50/70 dark:bg-slate-900/40 pt-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-google-blue/10 text-google-blue border border-google-blue/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4"
          >
            <span>{event?.type || 'Study Jam'} Leaderboard</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3"
          >
            <span className="text-google-blue">{eventTitle}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Track participant syllabus badges and lab completions for this Study Jam.
          </motion.p>

          {/* Action buttons inside header */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            

            <button
              onClick={() => setShowSyllabusModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-google-blue border border-blue-200 dark:border-blue-800 hover:bg-google-blue hover:text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <FaBookOpen size={11} />
              <span>Syllabus Labs ({totalLabsCount})</span>
            </button>

            {leaderboardConfig?.sheetUrl && (
              <button
                onClick={() => fetchSheetData(leaderboardConfig)}
                disabled={loadingSheet}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-google-blue font-bold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                title="Fetch latest updates from Google Sheet"
              >
                <FaSyncAlt size={11} className={loadingSheet ? 'animate-spin' : ''} />
                <span>{loadingSheet ? 'Syncing...' : 'Sync Sheet'}</span>
              </button>
            )}

            {/* Admin Edit Details Button */}
            {isAdmin && (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-2 hover:opacity-90"
              >
                <FaEdit size={11} />
                <span>Edit Details</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container with Sticky Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        {/* Sticky Controls Bar - Standardized height, width and UI matching Events.jsx & Projects.jsx */}
        <div className="sticky top-[80px] md:top-[80px] z-30 flex flex-col sm:flex-row items-center justify-between gap-2 py-1 px-3 sm:py-1.5 sm:px-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md mb-6">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search participants by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
              {filteredParticipants.length} {filteredParticipants.length === 1 ? 'Participant' : 'Participants'}
            </span>

            {/* Sort Dropdown matching website UI */}
            <div className="relative flex-1 sm:flex-initial">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="w-full sm:w-44 flex items-center justify-between px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-google-blue transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <FaSortAmountDown className="text-google-blue text-xs shrink-0" />
                  <span className="truncate">
                    {sortBy === 'BADGES_DESC' ? 'Most Badges' : 'Name (A-Z)'}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-slate-400 transition-transform duration-200 text-xs shrink-0 ${
                    isSortDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isSortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setIsSortDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-full sm:w-44 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 py-1.5 z-[100]">
                    {[
                      { key: 'BADGES_DESC', label: 'Most Badges Completed' },
                      { key: 'NAME_ASC', label: 'Name (A to Z)' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSortBy(opt.key);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors ${
                          sortBy === opt.key
                            ? 'text-google-blue bg-blue-50/50 dark:bg-blue-900/20 font-bold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* View Switcher matching website UI */}
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* Error Notice if Sheet fetch failed */}
        {sheetError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <FaExclamationTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <p className="font-bold mb-1">Notice reading Google Sheet:</p>
              <p>{sheetError}</p>
              <p className="mt-1 text-[11px] opacity-80">
                Please make sure the Google Sheet is shared with "Anyone with the link can view" or published via File &gt; Share &gt; Publish to web.
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        {loadingSheet ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <ListItemSkeleton key={n} />
            ))}
          </div>
        ) : !leaderboardConfig?.sheetUrl ? (
          /* Empty State: No Google Sheet configured yet */
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-google-blue/10 text-google-blue flex items-center justify-center mx-auto mb-3">
              <FaTable size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No Participant Sheet Configured
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
              Connect a Google Sheet for this Study Jam to display participants, their Google Cloud Skills Boost profiles, and their completed syllabus badges.
            </p>
            {isAdmin ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all"
              >
                <FaEdit size={12} />
                <span>Configure Leaderboard & Syllabus</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 italic">
                The community organizer has not configured the participant sheet for this Study Jam yet.
              </p>
            )}
          </div>
        ) : filteredParticipants.length === 0 ? (
          /* Empty Search Filter State */
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
            <FaUserGraduate className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={32} />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No participants match your search criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Try adjusting your search query.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-google-blue text-white text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : viewMode === 'list' ? (
          /* Table / List View (Avatar directly in front of Name, Row Clickable to open profile) */
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-3 sm:px-4  w-14 sm:w-16">S. No.</th>
                    <th className="py-3 px-4 min-w-[240px]">Participant</th>
                    <th className="py-3 px-4 min-w-[200px]">Syllabus Badges Completed</th>
                    <th className="py-3 px-4 text-right">Cloud Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredParticipants.map((p, index) => (
                    <tr
                      key={p.id}
                      onClick={(e) => handleParticipantClick(e, p.profileUrl)}
                      title={p.profileUrl ? 'Click to view Google Cloud Skills Boost Profile' : undefined}
                      className="hover:bg-blue-50/60 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
                    >
                      {/* Serial Number on the left side of Participant Name */}
                      <td className="py-3.5 px-3 sm:px-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
                        {index + 1}
                      </td>

                      {/* Participant: Avatar directly in front of name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                p.name || 'User'
                              )}&background=4285F4&color=fff&bold=true&rounded=true&size=128`;
                            }}
                            className="w-10 h-10 rounded-full object-cover p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                            loading="lazy"
                          />
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors truncate">
                            {p.name}
                          </p>
                        </div>
                      </td>

                      {/* Syllabus Badges Progress */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {p.verifiedCount} / {totalLabsCount} Labs
                          </span>
                          <span className="text-[10px] text-slate-400">({p.percentage}%)</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectParticipant(p);
                            }}
                            className="ml-auto text-[11px] text-google-blue font-semibold hover:underline"
                          >
                            Inspect
                          </button>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-google-blue to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${p.percentage}%` }}
                          />
                        </div>
                      </td>

                      {/* Cloud Skills Boost Profile URL */}
                      <td className="py-3.5 px-4 text-right">
                        {p.profileUrl ? (
                          <a
                            href={p.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-google-blue group-hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors shadow-xs"
                            title="View official Cloud Skills Boost profile"
                          >
                            <span>Profile</span>
                            <FaExternalLinkAlt size={9} />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards / Grid View (Card Clickable to open profile) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredParticipants.map((p, index) => (
              <div
                key={p.id}
                onClick={(e) => handleParticipantClick(e, p.profileUrl)}
                title={p.profileUrl ? 'Click to view Google Cloud Skills Boost Profile' : undefined}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-google-blue/40 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                      S. No. #{index + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectParticipant(p);
                      }}
                      className="text-xs text-google-blue font-semibold hover:underline"
                    >
                      View Badges
                    </button>
                  </div>

                  {/* Avatar directly in front of name */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          p.name || 'User'
                        )}&background=4285F4&color=fff&bold=true&rounded=true&size=128`;
                      }}
                      className="w-12 h-12 rounded-full object-cover p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors truncate">
                        {p.name}
                      </h4>
                    </div>
                  </div>

                  {/* Badges Progress */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 mb-3 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Syllabus Progress</span>
                      <span className="text-google-blue font-bold">
                        {p.verifiedCount} / {totalLabsCount} Labs
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-google-blue to-emerald-500 rounded-full"
                        style={{ width: `${p.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  {p.profileUrl ? (
                    <a
                      href={p.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-google-blue group-hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                    >
                      <span>Cloud Skills Boost Profile</span>
                      <FaExternalLinkAlt size={9} />
                    </a>
                  ) : (
                    <span className="block text-center text-xs text-slate-400 py-1">
                      No Profile Link Provided
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {inspectParticipant && (
          <BadgeInspectionModal
            participant={inspectParticipant}
            syllabusLabs={syllabusLabs}
            onClose={() => setInspectParticipant(null)}
          />
        )}
        {showSyllabusModal && (
          <SyllabusInfoModal
            syllabusLabs={syllabusLabs}
            sourceUrl={syllabusSourceUrl}
            onClose={() => setShowSyllabusModal(false)}
          />
        )}
        {showEditModal && (
          <EditLeaderboardModal
            event={event}
            currentConfig={leaderboardConfig}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveConfig}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
