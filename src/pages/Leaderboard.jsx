import React, { useState, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrophy,
  FaMedal,
  FaSearch,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaSortAmountDown,
  FaAward,
  FaBookOpen,
  FaInfoCircle,
  FaTimes,
  FaArrowLeft,
  FaUserGraduate,
  FaCloud,
  FaSyncAlt,
  FaList,
  FaThLarge,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {
  OFFICIAL_SYLLABUS_BADGES,
  TOTAL_SYLLABUS_BADGES,
  SYLLABUS_SOURCE_URL,
  filterAndCountSyllabusBadges,
  getMilestoneTier,
} from '../data/cloudStudySyllabus';
import {
  getSavedLeaderboardData,
  saveLeaderboardData,
} from '../data/mockLeaderboardData';
import { useAuth } from '../context/AuthContext';
import usePageSEO from '../hooks/usePageSEO';

const GOOGLE_COLORS = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
};

// --- Top 3 Podium Card ---
const TopPodiumCard = memo(({ participant, rank, onInspect }) => {
  const { name, avatar, profileUrl, department, verifiedCount, percentage, completedBadges } = participant;
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;

  const medalConfig = isFirst
    ? {
        border: 'border-amber-400 dark:border-amber-500',
        bg: 'from-amber-500/10 via-yellow-500/5 to-transparent dark:from-amber-500/20',
        badge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900',
        glow: 'shadow-amber-500/20',
        ring: 'ring-amber-400/50',
        title: 'Rank #1 Champion',
      }
    : isSecond
    ? {
        border: 'border-slate-300 dark:border-slate-600',
        bg: 'from-slate-300/10 via-slate-400/5 to-transparent dark:from-slate-500/20',
        badge: 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900',
        glow: 'shadow-slate-400/20',
        ring: 'ring-slate-400/50',
        title: 'Rank #2 Runner Up',
      }
    : {
        border: 'border-amber-700/50 dark:border-amber-600/50',
        bg: 'from-amber-700/10 via-amber-800/5 to-transparent dark:from-amber-700/20',
        badge: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
        glow: 'shadow-amber-700/20',
        ring: 'ring-amber-600/50',
        title: 'Rank #3 Finalist',
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank * 0.1 }}
      className={`relative bg-gradient-to-b ${medalConfig.bg} bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border-2 ${medalConfig.border} shadow-xl ${medalConfig.glow} flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Rank Badge */}
      <div
        className={`absolute -top-3.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 ${medalConfig.badge}`}
      >
        <FaMedal size={12} />
        <span>Rank #{rank}</span>
      </div>

      {/* Avatar in front of name / prominent */}
      <div className="relative mt-2 mb-3">
        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 bg-white dark:bg-slate-800 ring-4 ${medalConfig.ring} shadow-lg`}>
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        </div>
        <div className="absolute -bottom-1.5 -right-1.5 bg-google-blue text-white p-1.5 rounded-full shadow-md">
          <FaCloud size={12} />
        </div>
      </div>

      {/* Name and Details */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
        {name}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
        {department}
      </p>

      {/* Badges Progress */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 mb-3 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-600 dark:text-slate-300">Syllabus Badges</span>
          <span className="text-google-blue font-bold">
            {verifiedCount} / {TOTAL_SYLLABUS_BADGES}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-google-blue via-blue-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Profile Link & Inspection Actions */}
      <div className="flex items-center gap-2 w-full pt-1">
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Google Cloud Skills Boost Profile"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <span>Cloud Profile</span>
            <FaExternalLinkAlt size={10} />
          </a>
        )}
        <button
          onClick={() => onInspect(participant)}
          className="px-3 py-2 rounded-xl bg-google-blue/10 hover:bg-google-blue/20 text-google-blue dark:text-blue-400 text-xs font-semibold transition-colors"
          title="Inspect syllabus badges"
        >
          View Badges
        </button>
      </div>
    </motion.div>
  );
});

// --- Badge Inspection Modal ---
const BadgeInspectionModal = ({ participant, onClose }) => {
  if (!participant) return null;

  const { name, avatar, profileUrl, verifiedBadges, verifiedCount } = participant;
  const completedIdSet = new Set((verifiedBadges || []).map((b) => b.id));

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
              className="w-12 h-12 rounded-full p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-google-blue/10 text-google-blue font-bold">
                  {verifiedCount} / {TOTAL_SYLLABUS_BADGES} Labs
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
        <div className="py-3 px-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl my-3 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 border border-blue-100 dark:border-blue-900/40 shrink-0">
          <FaInfoCircle className="text-google-blue shrink-0" size={14} />
          <span>
            Only badges from the <strong>10 official syllabus labs</strong> count towards the leaderboard milestone.
          </span>
        </div>

        {/* 10 Syllabus Badges Checklist */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {OFFICIAL_SYLLABUS_BADGES.map((badge, idx) => {
            const isCompleted = completedIdSet.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/30'
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
                    {isCompleted ? <FaCheckCircle size={13} /> : idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {badge.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{badge.category}</span>
                      <span>•</span>
                      <span>{badge.credits} Credits</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <a
                    href={badge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-google-blue hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View lab on Skills Boost"
                  >
                    <FaExternalLinkAlt size={11} />
                  </a>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

// --- Official Syllabus Drawer/Modal ---
const SyllabusInfoModal = ({ onClose }) => {
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
                Official Syllabus Labs (10 Courses)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Google Cloud Study Jams 2026 Curriculum
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

        <div className="py-3 px-4 bg-amber-500/10 rounded-2xl my-3 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between gap-2 border border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2">
            <FaInfoCircle size={14} className="shrink-0" />
            <span>Only completions of these 10 labs earn official milestones and credits.</span>
          </div>
          <a
            href={SYLLABUS_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline shrink-0 hover:text-amber-900 dark:hover:text-amber-100"
          >
            Source Sheet
          </a>
        </div>

        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {OFFICIAL_SYLLABUS_BADGES.map((badge, idx) => (
            <a
              key={badge.id}
              href={badge.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-google-blue/40 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{badge.category}</span>
                    <span>•</span>
                    <span>Template #{badge.templateId}</span>
                    <span>•</span>
                    <span>{badge.credits} Credits</span>
                  </p>
                </div>
              </div>
              <FaExternalLinkAlt size={12} className="text-slate-400 group-hover:text-google-blue shrink-0" />
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Leaderboard Page Component ---
const Leaderboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL'); // ALL, TIER1, MILESTONE2, MILESTONE1, IN_PROGRESS
  const [sortBy, setSortBy] = useState('RANK'); // RANK, BADGES_DESC, NAME_ASC
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modals
  const [inspectParticipant, setInspectParticipant] = useState(null);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  // Participants Data
  const [participants, setParticipants] = useState(() => getSavedLeaderboardData());

  usePageSEO({
    title: 'Google Cloud Study Jams 2026 - Leaderboard',
    description:
      'Official participant rankings and syllabus progress for Google Cloud Study Jams 2026 at GDG on Campus SATI Vidisha.',
    path: '/leaderboard',
  });

  // Calculate verified syllabus badge completions for each participant
  const processedParticipants = useMemo(() => {
    return participants.map((p) => {
      const { completedBadges, count, percentage } = filterAndCountSyllabusBadges(p.completedBadges);
      const tierInfo = getMilestoneTier(count);
      return {
        ...p,
        verifiedBadges: completedBadges,
        verifiedCount: count,
        percentage,
        tierInfo,
      };
    });
  }, [participants]);

  // Sort and assign official ranking
  const rankedParticipants = useMemo(() => {
    // Primary rank order: verifiedCount DESC, then lastActive ASC/earlier completion
    const sorted = [...processedParticipants].sort((a, b) => {
      if (b.verifiedCount !== a.verifiedCount) {
        return b.verifiedCount - a.verifiedCount;
      }
      return (a.lastActive || '').localeCompare(b.lastActive || '');
    });

    return sorted.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [processedParticipants]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const total = rankedParticipants.length;
    const tier1Count = rankedParticipants.filter((p) => p.verifiedCount >= 10).length;
    const milestone2Count = rankedParticipants.filter((p) => p.verifiedCount >= 6).length;
    const milestone1Count = rankedParticipants.filter((p) => p.verifiedCount >= 3).length;
    const totalBadgesEarned = rankedParticipants.reduce((sum, p) => sum + p.verifiedCount, 0);

    return {
      total,
      tier1Count,
      milestone2Count,
      milestone1Count,
      totalBadgesEarned,
    };
  }, [rankedParticipants]);

  // Filtered & User-sorted participants
  const filteredParticipants = useMemo(() => {
    return rankedParticipants.filter((p) => {
      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDept = (p.department || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDept) return false;
      }

      // Tier filtering
      if (tierFilter === 'TIER1' && p.verifiedCount < 10) return false;
      if (tierFilter === 'MILESTONE2' && (p.verifiedCount < 6 || p.verifiedCount >= 10)) return false;
      if (tierFilter === 'MILESTONE1' && (p.verifiedCount < 3 || p.verifiedCount >= 6)) return false;
      if (tierFilter === 'IN_PROGRESS' && p.verifiedCount >= 3) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'RANK') return a.rank - b.rank;
      if (sortBy === 'BADGES_DESC') return b.verifiedCount - a.verifiedCount;
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [rankedParticipants, searchQuery, tierFilter, sortBy]);

  // Top 3 for Podium
  const topThree = useMemo(() => {
    return rankedParticipants.slice(0, 3);
  }, [rankedParticipants]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-google-blue transition-colors"
          >
            <FaArrowLeft size={12} />
            <span>Back to Events</span>
          </Link>

          <button
            onClick={() => setShowSyllabusModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-google-blue border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-google-blue hover:text-white transition-all shadow-sm"
          >
            <FaBookOpen size={12} />
            <span>Official 10-Lab Syllabus</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-6 sm:p-10 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-google-blue/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-google-yellow/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3">
              <FaTrophy className="text-google-yellow" />
              <span>Google Cloud Study Jams 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              Participant Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              Track student progress through the 10 official syllabus labs. Only completed skill badges
              from the verified curriculum count towards milestone ranking and certification credits.
            </p>
          </div>
        </div>

        {/* Metrics Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Enrolled</span>
              <FaUserGraduate className="text-google-blue" size={14} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</p>
            <span className="text-[10px] text-slate-400">Active participants</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tier 1 (Completed 10)</span>
              <FaAward className="text-emerald-500" size={14} />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.tier1Count}</p>
            <span className="text-[10px] text-emerald-500 font-medium">All 10 Badges Completed</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Milestone 2 (6+)</span>
              <FaMedal className="text-blue-500" size={14} />
            </div>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.milestone2Count}</p>
            <span className="text-[10px] text-blue-500 font-medium">6 to 9 Badges</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Milestone 1 (3+)</span>
              <FaMedal className="text-amber-500" size={14} />
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.milestone1Count}</p>
            <span className="text-[10px] text-amber-500 font-medium">3 to 5 Badges</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Badges</span>
              <FaCloud className="text-google-yellow" size={14} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalBadgesEarned}</p>
            <span className="text-[10px] text-slate-400">Syllabus labs finished</span>
          </div>
        </div>

        {/* Top 3 Podium Section */}
        {topThree.length >= 3 && (
          <div className="mb-10">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-google-blue">
                Hall of Fame
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Top Performing Champions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {/* Order on desktop: 2nd, 1st, 3rd for realistic podium */}
              <div className="order-2 md:order-1 md:mt-6">
                <TopPodiumCard participant={topThree[1]} rank={2} onInspect={setInspectParticipant} />
              </div>
              <div className="order-1 md:order-2">
                <TopPodiumCard participant={topThree[0]} rank={1} onInspect={setInspectParticipant} />
              </div>
              <div className="order-3 md:order-3 md:mt-8">
                <TopPodiumCard participant={topThree[2]} rank={3} onInspect={setInspectParticipant} />
              </div>
            </div>
          </div>
        )}

        {/* Sticky Filter & Search Toolbar */}
        <div className="sticky top-16 z-30 mb-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-lg">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <input
                type="text"
                placeholder="Search participant by name or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <FaFilter size={11} className="text-slate-400 shrink-0" />
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                >
                  <option value="ALL">All Milestones ({rankedParticipants.length})</option>
                  <option value="TIER1">Tier 1 (Completed 10 Badges)</option>
                  <option value="MILESTONE2">Milestone 2 (6+ Badges)</option>
                  <option value="MILESTONE1">Milestone 1 (3+ Badges)</option>
                  <option value="IN_PROGRESS">In Progress (&lt;3 Badges)</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <FaSortAmountDown size={11} className="text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                >
                  <option value="RANK">Sort by Rank</option>
                  <option value="BADGES_DESC">Most Badges First</option>
                  <option value="NAME_ASC">Name (A-Z)</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-700 text-google-blue shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                  title="Table View"
                >
                  <FaList size={13} />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-slate-700 text-google-blue shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                  title="Card View"
                >
                  <FaThLarge size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content: Table or Cards */}
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <FaTrophy className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={36} />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No participants match your criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Try adjusting your search query or milestone filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setTierFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-google-blue text-white text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4 text-center w-16">Rank</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Participant</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Department / Year</th>
                    <th className="py-3.5 px-4 min-w-[180px]">Syllabus Badges (Out of 10)</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Milestone Tier</th>
                    <th className="py-3.5 px-4 text-right">Cloud Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredParticipants.map((p) => {
                    const isPodium = p.rank <= 3;
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center">
                          {p.rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-sm">
                              1
                            </span>
                          ) : p.rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs shadow-sm">
                              2
                            </span>
                          ) : p.rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs shadow-sm">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">
                              #{p.rank}
                            </span>
                          )}
                        </td>

                        {/* Participant: Avatar IN FRONT OF Name (Strict requirement) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={p.avatar}
                                alt={p.name}
                                className="w-10 h-10 rounded-full object-cover p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
                                loading="lazy"
                              />
                              {isPodium && (
                                <div className="absolute -top-1 -right-1 text-amber-500 text-[10px]">
                                  ★
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors truncate">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-slate-400 md:hidden truncate">
                                {p.department}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Department / Year */}
                        <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 dark:text-slate-300 text-xs">
                          <div>{p.department}</div>
                          <div className="text-[10px] text-slate-400">{p.year}</div>
                        </td>

                        {/* Syllabus Badges Progress */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              {p.verifiedCount} / {TOTAL_SYLLABUS_BADGES}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({p.percentage}%)
                            </span>
                            <button
                              onClick={() => setInspectParticipant(p)}
                              className="ml-auto text-[11px] text-google-blue font-semibold hover:underline"
                            >
                              Check
                            </button>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-google-blue to-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${p.percentage}%` }}
                            />
                          </div>
                        </td>

                        {/* Milestone Tier Badge */}
                        <td className="py-3.5 px-4 hidden sm:table-cell">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${p.tierInfo.badgeClass}`}
                          >
                            {p.tierInfo.tier}
                          </span>
                        </td>

                        {/* Cloud Profile Link */}
                        <td className="py-3.5 px-4 text-right">
                          {p.profileUrl ? (
                            <a
                              href={p.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors shadow-xs"
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParticipants.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Rank #{p.rank}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.tierInfo.badgeClass}`}
                    >
                      {p.tierInfo.tier}
                    </span>
                  </div>

                  {/* Avatar in front of name */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-12 h-12 rounded-full object-cover p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {p.department}
                      </p>
                    </div>
                  </div>

                  {/* Badges Progress */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 mb-3 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Syllabus Badges</span>
                      <span className="text-google-blue font-bold">
                        {p.verifiedCount} / {TOTAL_SYLLABUS_BADGES}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-google-blue to-emerald-500 rounded-full"
                        style={{ width: `${p.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {p.profileUrl && (
                    <a
                      href={p.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                    >
                      <span>Cloud Profile</span>
                      <FaExternalLinkAlt size={9} />
                    </a>
                  )}
                  <button
                    onClick={() => setInspectParticipant(p)}
                    className="px-3 py-1.5 rounded-lg bg-google-blue/10 text-google-blue hover:bg-google-blue/20 text-xs font-semibold transition-colors"
                  >
                    View Badges
                  </button>
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
            onClose={() => setInspectParticipant(null)}
          />
        )}
        {showSyllabusModal && (
          <SyllabusInfoModal onClose={() => setShowSyllabusModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
