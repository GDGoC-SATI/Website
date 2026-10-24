import React, { useState, useMemo, useEffect, memo, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaChevronDown,
  FaArrowRight,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaTimes,
  FaSave,
} from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { eventsData as initialEvents } from '../data/eventsData';
import { useAuth } from '../context/AuthContext';
import ViewToggle from '../components/common/ViewToggle';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { usePageSEO } from '../hooks/usePageSEO';
import { api } from '../services/api';
import { useRealtimeSubscription } from '../context/RealtimeContext';
import { EVENT_TYPES, FormattedDateTimeInput, LocationSelect, StatusSelect } from '../utils/formHelpers';
import { autoFormatEventDescription } from '../components/common/StructuredDescription';
import { CardSkeleton, ListItemSkeleton } from '../components/common/Skeleton';
import { notifyIndexNow } from '../services/indexingService';

// --- Exact FluxWave Curve Generators ---
const generateHorizontalWave = (totalUnits = 3000) => {
  let path = 'M 0 200';
  const segmentWidth = 900;
  const numSegments = Math.ceil(totalUnits / segmentWidth);
  for (let i = 0; i < numSegments; i++) {
    const x0 = i * segmentWidth;
    path += ` C ${x0 + 300} 50, ${x0 + 600} 350, ${x0 + 900} 200`;
  }
  return path;
};

const generateVerticalWave = (count) => {
  // Smooth continuous S-curve matching FluxWave mobile without jagged kinks
  const cycles = Math.max(2, Math.ceil(count / 2));
  const step = 1000 / cycles;
  let path = 'M 50 0';
  for (let i = 0; i < cycles; i++) {
    const y0 = i * step;
    const cp1y = Math.round(y0 + step * 0.333);
    const cp2y = Math.round(y0 + step * 0.667);
    const yEnd = Math.round((i + 1) * step);
    path += ` C 150 ${cp1y}, -50 ${cp2y}, 50 ${yEnd}`;
  }
  return path;
};


// --- Event List Item (Memoized for zero redundant re-renders) ---
const EventListItem = memo(({
  id,
  title,
  date,
  location,
  description,
  imageUrl,
  type,
  index,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="relative bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group overflow-hidden"
    >
      <div className={`flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1 ${isAdmin ? 'pr-16 sm:pr-0' : ''}`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800 shadow-sm"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-google-blue/10 text-google-blue border border-google-blue/20 shrink-0">
              {type}
            </span>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 min-w-0">
              <FaCalendarAlt size={10} className="text-google-yellow shrink-0" />
              <span className="truncate max-w-[220px] sm:max-w-none">{date}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 min-w-0">
              <FaMapMarkerAlt size={10} className="text-google-red shrink-0" />
              <span className="truncate max-w-[220px] sm:max-w-[160px]">{location}</span>
            </div>
          </div>

          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors truncate max-w-[220px] sm:max-w-[950px]">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {description}
          </p>
        </div>
      </div>

      {/* Admin Controls Top-Right Inside Card */}
      {isAdmin && (
        <div className="absolute top-3.5 right-3.5 sm:static flex items-center gap-1 z-10 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-2">
          <button
            onClick={onEdit}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-google-blue rounded-lg hover:bg-google-blue/10 transition-colors text-xs"
            title="Edit Event"
          >
            <FaEdit size={12} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-google-red rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-xs"
            title="Delete Event"
          >
            <FaTrash size={12} />
          </button>
        </div>
      )}

      <div className="w-full sm:w-auto flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
        <Link
          to={`/events/${id}`}
          className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
        >
          <span>View Details</span>
          <FaArrowRight size={10} />
        </Link>
      </div>
    </motion.div>
  );
});

// --- Desktop Journey Card (Scroll-revealed on Horizontal Track) ---
const DesktopJourneyCard = memo(({
  event,
  isAdmin,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete
}) => {
  const { id, title, date, location, description, imageUrl, type } = event;

  return (
    <div className="w-72 sm:w-80 lg:w-[21rem] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:shadow-google-blue/15 transition-all duration-300 group overflow-hidden relative">
      {/* Admin Controls Overlay */}
      {isAdmin && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md px-1.5 py-0.5 rounded-lg shadow-xl border border-slate-700"
        >
          {canMoveUp && (
            <button
              title="Move Up"
              onClick={onMoveUp}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              <FaArrowUp size={9} />
            </button>
          )}
          {canMoveDown && (
            <button
              title="Move Down"
              onClick={onMoveDown}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              <FaArrowDown size={9} />
            </button>
          )}
          <button
            title="Edit Event"
            onClick={onEdit}
            className="p-1 text-google-blue hover:bg-google-blue/20 rounded transition-colors"
          >
            <FaEdit size={9} />
          </button>
          <button
            title="Delete Event"
            onClick={onDelete}
            className="p-1 text-google-red hover:bg-google-red/20 rounded transition-colors"
          >
            <FaTrash size={9} />
          </button>
        </div>
      )}

      {/* Image Banner */}
      {imageUrl && (
        <div className="relative w-full h-28 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-google-blue border border-google-blue/30 shadow-sm">
            {type}
          </div>
          <div className="absolute bottom-1.5 left-2.5 text-white text-[10px] font-semibold drop-shadow flex items-center gap-1">
            <FaCalendarAlt size={9} className="text-google-yellow" />
            <span>{date.split(',')[0]}</span>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-3.5">
        {!imageUrl && (
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-google-blue/10 text-google-blue border border-google-blue/20">
              {type}
            </span>
            <span className="text-[10px] font-semibold text-google-blue">
              {date.split(',')[0]}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
          <FaMapMarkerAlt size={10} className="text-google-red shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors line-clamp-1 mb-1 leading-snug">
          {title}
        </h3>

        {/* <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
          {description}
        </p> */}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">
            {date.split(',').slice(1).join(',')}
          </span>

          <Link
            to={`/events/${id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-google-blue group-hover:text-white text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all shadow-sm"
          >
            <span>View Details</span>
            <FaArrowRight size={9} className="transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
});

// --- Mobile Journey Card (Scroll-revealed on Vertical Sine Wave) ---
const MobileJourneyCard = memo(({
  event,
  isAdmin,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete
}) => {
  const { id, title, date, location, description, imageUrl, type } = event;

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xl relative group overflow-hidden">
      {/* Admin Controls */}
      {isAdmin && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md px-1.5 py-0.5 rounded-lg shadow border border-slate-700"
        >
          {canMoveUp && (
            <button
              title="Move Up"
              onClick={onMoveUp}
              className="p-1 text-slate-300 hover:text-white"
            >
              <FaArrowUp size={9} />
            </button>
          )}
          {canMoveDown && (
            <button
              title="Move Down"
              onClick={onMoveDown}
              className="p-1 text-slate-300 hover:text-white"
            >
              <FaArrowDown size={9} />
            </button>
          )}
          <button
            title="Edit Event"
            onClick={onEdit}
            className="p-1 text-google-blue"
          >
            <FaEdit size={9} />
          </button>
          <button
            title="Delete Event"
            onClick={onDelete}
            className="p-1 text-google-red"
          >
            <FaTrash size={9} />
          </button>
        </div>
      )}

      {imageUrl && (
        <div className="relative w-full h-20 sm:h-28 rounded-xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white">
            {type}
          </div>
        </div>
      )}

      <div className="inline-block px-2 py-0.5 bg-google-blue/10 dark:bg-google-blue/20 text-google-blue text-[10px] font-bold rounded-full mb-1.5 uppercase tracking-wider">
        {date.split(',')[0]}
      </div>

      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 leading-snug group-hover:text-google-blue transition-colors">
        {title}
      </h4>

      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 mb-1.5">
        <FaMapMarkerAlt size={9} className="text-google-red shrink-0" />
        <span className="truncate">{location}</span>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mb-2.5 leading-relaxed">
        {description}
      </p>

      <Link
        to={`/events/${id}`}
        className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-google-blue hover:text-blue-600 transition-colors"
      >
        <span>View Details</span>
        <FaArrowRight size={9} />
      </Link>
    </div>
  );
});

// Google Official Brand Colors: Blue, Red, Yellow, Green
const GOOGLE_BRAND_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

const renderGoogleGradientStops = (cycles = 8) => {
  const stops = [];
  const totalStops = cycles * 4;
  for (let i = 0; i <= totalStops; i++) {
    const offset = `${((i / totalStops) * 100).toFixed(2)}%`;
    const color = GOOGLE_BRAND_COLORS[i % GOOGLE_BRAND_COLORS.length];
    stops.push(<stop key={i} offset={offset} stopColor={color} />);
  }
  return stops;
};

// --- Scroll Reveal Journey Component (Inspired by FluxWave 'The Journey') ---
const EventsTimelineJourney = ({
  events,
  allEvents,
  isAdmin,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete
}) => {
  const containerRef = useRef(null);
  const n = events.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001
  });

  // Dynamic Horizontal Track Sizing:
  // Item 0 is initially placed at 32vw (clearly visible in viewport).
  // Subsequent items spaced by 36vw.
  const itemSpacingVw = 36;
  const startOffsetVw = 32;
  const trackWidthVw = n <= 1 ? 100 : Math.max(100, startOffsetVw + (n - 1) * itemSpacingVw + 40);
  const maxTranslateVw = n <= 1 ? 0 : (startOffsetVw + (n - 1) * itemSpacingVw) - 50;

  const xTransform = useTransform(smoothProgress, [0, 1], ['0vw', `-${maxTranslateVw}vw`]);

  // Container height dynamically scaled to number of events
  const containerHeightVh = n <= 1 ? 120 : Math.max(180, Math.min(600, n * 50 + 100));
  const svgWidth = Math.max(2500, n * 500);

  return (
    <div className="w-full relative">
      {/* DESKTOP HORIZONTAL SCROLL TIMELINE (≥ lg) */}
      <div className="hidden lg:block">
        <div
          ref={containerRef}
          className="relative z-10 w-full"
          style={{ height: `${containerHeightVh}vh` }}
        >
          <div className="sticky top-20 h-[calc(100vh-5rem)] w-full overflow-hidden flex flex-col justify-center">
            {/* Horizontally Moving Track */}
            <motion.div
              style={{ x: xTransform, width: `${trackWidthVw}vw` }}
              className="flex h-full items-center relative"
            >
              {/* Central Horizontal SVG Wave */}
              <svg
                className="absolute top-1/2 -translate-y-1/2 w-full h-[400px] pointer-events-none drop-shadow-[0_0_15px_rgba(66,133,244,0.35)]"
                viewBox={`0 0 ${svgWidth} 400`}
                preserveAspectRatio="none"
              >
                <path
                  d={generateHorizontalWave(svgWidth)}
                  fill="none"
                  stroke="url(#google_grad)"
                  strokeWidth="5"
                />
                <defs>
                  <linearGradient id="google_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    {renderGoogleGradientStops(Math.max(6, n * 2))}
                  </linearGradient>
                </defs>
              </svg>

              {/* Event Nodes & Connected Cards */}
              {events.map((event, idx) => {
                const isTop = idx % 2 === 0;
                const leftPosVw = n <= 1 ? 50 : startOffsetVw + idx * itemSpacingVw;
                const globalIndex = allEvents.findIndex((e) => e.id === event.id);
                const nodeColor = GOOGLE_BRAND_COLORS[idx % GOOGLE_BRAND_COLORS.length];

                return (
                  <div
                    key={event.id}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${leftPosVw}vw`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Center Glowing Dot Node in Google Brand Color */}
                    <div
                      className="w-10 h-10 rounded-full bg-white dark:bg-[#050505] border-4 z-20 flex items-center justify-center transition-transform hover:scale-125 duration-300"
                      style={{
                        borderColor: nodeColor,
                        boxShadow: `0 0 20px ${nodeColor}80`,
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: nodeColor }}
                      />
                    </div>

                    {/* Alternating Card + Connector Line */}
                    <div
                      className={`absolute flex flex-col items-center ${isTop ? 'bottom-full mb-3' : 'top-full mt-3'
                        }`}
                    >
                      <div
                        className="w-1 h-12"
                        style={{
                          background: isTop
                            ? `linear-gradient(to bottom, ${nodeColor}, transparent)`
                            : `linear-gradient(to top, ${nodeColor}, transparent)`,
                          order: isTop ? 2 : 1,
                        }}
                      />
                      <div className={isTop ? 'order-1' : 'order-2'}>
                        <DesktopJourneyCard
                          event={event}
                          isAdmin={isAdmin}
                          canMoveUp={globalIndex > 0}
                          canMoveDown={globalIndex < allEvents.length - 1}
                          onMoveUp={() => onMoveUp(globalIndex)}
                          onMoveDown={() => onMoveDown(globalIndex)}
                          onEdit={() => onEdit(event, globalIndex)}
                          onDelete={() => onDelete(globalIndex)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET VERTICAL TIMELINE (< lg) */}
      <div className="lg:hidden w-full px-3 sm:px-6 py-6 relative z-10 overflow-hidden">
        <div className="relative w-full max-w-lg mx-auto py-4">
          {/* Central Vertical Sine Wave SVG */}
          <svg
            className="absolute left-1/2 -translate-x-1/2 top-0 w-64 h-full z-0 pointer-events-none drop-shadow-[0_0_15px_rgba(66,133,244,0.35)]"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            <path
              d={generateVerticalWave(events.length)}
              fill="none"
              stroke="url(#google_grad-mobile)"
              strokeWidth="3"
            />
            <defs>
              <linearGradient id="google_grad-mobile" x1="0%" y1="0%" x2="0%" y2="100%">
                {renderGoogleGradientStops(Math.max(6, n * 2))}
              </linearGradient>
            </defs>
          </svg>

          {/* Alternating Scroll Reveal Cards */}
          <div className="space-y-16 sm:space-y-20 flex flex-col relative z-10">
            {events.map((event, idx) => {
              const isLeft = idx % 2 === 0;
              const globalIndex = allEvents.findIndex((e) => e.id === event.id);
              const nodeColor = GOOGLE_BRAND_COLORS[idx % GOOGLE_BRAND_COLORS.length];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0.15, scale: 0.9, x: isLeft ? -15 : 15 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'} relative items-center`}
                >
                  {/* Central Node on Wave in Google Brand Color */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#050505] border-4 z-20 flex items-center justify-center pointer-events-none"
                    style={{
                      borderColor: nodeColor,
                      boxShadow: `0 0 15px ${nodeColor}80`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: nodeColor }}
                    />
                  </div>

                  {/* Mobile Card */}
                  <div className={`w-[45%] sm:w-[44%] ${isLeft ? 'pr-1' : 'pl-1'}`}>
                    <MobileJourneyCard
                      event={event}
                      isAdmin={isAdmin}
                      canMoveUp={globalIndex > 0}
                      canMoveDown={globalIndex < allEvents.length - 1}
                      onMoveUp={() => onMoveUp(globalIndex)}
                      onMoveDown={() => onMoveDown(globalIndex)}
                      onEdit={() => onEdit(event, globalIndex)}
                      onDelete={() => onDelete(globalIndex)}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Edit/Add Event Modal ---
const EventModal = ({ event, onClose, onSave, isNew = false }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    type: event?.type || 'Workshop',
    status: event?.status || 'Planning',
    date: event?.date || '',
    location: event?.location || 'Smart Classroom, SATI Vidisha',
    description: event?.description || '',
    imageUrl: event?.imageUrl || '',
    originalUrl: event?.originalUrl || '',
    winners: event?.winners || [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        ...event,
        ...formData,
      });
      onClose();
    } catch (err) {
      console.error('Error submitting event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FaEdit className="text-google-blue" />
            {isNew ? 'Create New Event' : `Edit: ${event.title}`}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Type
              </label>
              <select
                value={formData.type || 'Workshop'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue font-medium"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <StatusSelect
              value={formData.status || 'Planning'}
              onChange={(val) => setFormData({ ...formData, status: val })}
              label="Status"
            />
            <LocationSelect
              value={formData.location || ''}
              onChange={(val) => setFormData({ ...formData, location: val })}
              label="Location"
            />
          </div>

          <FormattedDateTimeInput
            value={formData.date || ''}
            onChange={(val) => setFormData({ ...formData, date: val })}
            label="Date & Time"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registration / Link URL
            </label>
            <input
              type="text"
              value={formData.originalUrl}
              onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
              placeholder="https://gdg.community.dev/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Banner Image URL
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Description
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    description: autoFormatEventDescription(formData.description),
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold text-google-blue hover:text-white bg-blue-50 hover:bg-google-blue dark:bg-blue-950/40 dark:hover:bg-google-blue border border-blue-200 dark:border-blue-800 rounded-lg transition-all shadow-xs"
                title="Automatically organize pasted text into clean sections, bullet points, and key details"
              >
                <span>Auto-Structure Text</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Paste event overview, tracks, highlights, or schedule..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-google-blue hover:bg-blue-600 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-2"
            >
              <FaSave /> {isSubmitting ? 'Saving to Database...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Events Component ---
const Events = () => {
  usePageSEO({
    title: 'Events & Timeline',
    description: 'Explore tech workshops, hackathons, speaker meetups, and developer gatherings organized by GDG on Campus SATI Vidisha.',
    path: '/events',
  });

  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialYear = searchParams.get('year') || 'All';
  const initialQuery = searchParams.get('q') || '';
  const initialView = searchParams.get('view') || 'grid';

  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [filterYear, setFilterYearState] = useState(initialYear);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [view, setViewState] = useState(initialView);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  // Fetch events from MongoDB API on component mount
  const fetchEvents = async (showSkeleton = true) => {
    try {
      if (showSkeleton) setLoading(true);
      const res = await api.events.getAll(true);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((item) => ({
          ...item,
          id: item.slug || item.id || item._id,
        }));
        setEvents(mapped);
      }
    } catch (err) {
      console.warn('API event fetch notice, using cached events:', err.message);
    } finally {
      if (showSkeleton) setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Real-time zero-refresh instant updates whenever events change in DB
  useRealtimeSubscription('events', () => {
    fetchEvents(false);
  });

  // Debounced search query prevents excessive recalculation and router thrashing
  const debouncedSearch = useDebounce(searchQuery, 250);

  // Sync URL search parameters on debounced value change
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!debouncedSearch.trim()) next.delete('q');
      else next.set('q', debouncedSearch);
      return next;
    }, { replace: true });
  }, [debouncedSearch, setSearchParams]);

  const setFilterYear = (yr) => {
    setFilterYearState(yr);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (yr === 'All') next.delete('year');
      else next.set('year', yr);
      return next;
    }, { replace: true });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const setView = (v) => {
    setViewState(v);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('view', v);
      return next;
    }, { replace: true });
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Admin Modal state
  const [modalState, setModalState] = useState(null); // { event, index, isNew }

  const handleMoveEvent = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= events.length) return;
    const updated = [...events];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setEvents(updated);
  };

  const handleDeleteEvent = async (index) => {
    const targetEvent = events[index];
    if (!targetEvent) return;
    if (window.confirm(`Delete event "${targetEvent.title}"?`)) {
      try {
        const targetId = targetEvent._id || targetEvent.id || targetEvent.slug;
        await api.events.delete(targetId);
        await fetchEvents();
      } catch (err) {
        console.error('Failed to delete event from database:', err);
        // Local state fallback
        setEvents(events.filter((_, i) => i !== index));
      }
    }
  };

  const handleSaveEvent = async (saved) => {
    if (!modalState) return;
    try {
      const yearFromDate = saved.date?.match(/\b(20\d\d)\b/)?.[1] || new Date().getFullYear().toString();
      const payload = {
        title: saved.title,
        type: saved.type || 'Workshop',
        status: saved.status || 'Planning',
        date: saved.date,
        location: saved.location || 'Online',
        description: saved.description || '',
        imageUrl: saved.imageUrl || '',
        originalUrl: saved.originalUrl || '',
        timeline: saved.timeline || [],
        winners: saved.winners || [],
        year: saved.year || yearFromDate,
      };

      if (modalState.isNew) {
        const created = await api.events.create(payload);
        const targetSlug = created?.data?.slug || created?.data?.id || saved.slug || saved.id;
        if (targetSlug) notifyIndexNow(`/events/${targetSlug}`);
      } else {
        const targetId = saved._id || saved.id || saved.slug;
        await api.events.update(targetId, payload);
        const targetSlug = saved.slug || saved.id || targetId;
        if (targetSlug) notifyIndexNow(`/events/${targetSlug}`);
      }
      await fetchEvents();
    } catch (err) {
      console.error('Failed to persist event to MongoDB:', err);
      // Fallback local update
      if (modalState.isNew) {
        setEvents([{ ...saved, id: saved.id || `event-${Date.now()}` }, ...events]);
      } else {
        const updated = [...events];
        updated[modalState.index] = saved;
        setEvents(updated);
      }
      alert(`Notice: ${err.message || 'Could not persist to MongoDB'}`);
    }
  };

  // Memoized Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesYear = filterYear === 'All' ? true : event.date.includes(filterYear);
      const query = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);
      return matchesYear && matchesSearch;
    });
  }, [events, filterYear, debouncedSearch]);

  // Paginated subset of events (strictly for list view)
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredEvents.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredEvents, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-google-blue z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Header Banner - Standardized across pages */}
      <div className="relative bg-slate-50/70 dark:bg-slate-900/40 pt-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-google-blue/10 text-google-blue border border-google-blue/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            Timeline
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Our <span className="text-google-blue">Events</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explore workshops, hackathons, and community gatherings.
          </p>

          {/* Admin Add Event Button */}
          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() =>
                  setModalState({
                    event: {
                      title: '',
                      type: 'Workshop',
                      status: 'Planning',
                      date: 'Upcoming, 2026',
                      location: 'Smart Classroom, SATI Vidisha',
                      description: '',
                      imageUrl: 'https://res.cloudinary.com/startup-grind/image/upload/c_scale,w_2560/c_crop,h_640,w_2560,y_0.0_mul_h_sub_0.0_mul_640/c_crop,h_640,w_2560/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/event_banners/GDG_Bevy_DefaultEventBanner_9M7vWqs.png',
                      originalUrl: '',
                    },
                    index: -1,
                    isNew: true,
                  })
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-google-blue hover:bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
              >
                <FaPlus /> Add New Event
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full relative mt-3">
        {/* Controls: Search, Filter & View Switcher (Normal/static in grid view on desktop, sticky in list view and on mobile) */}
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 ${
            view === 'grid'
              ? 'sticky top-[80px] md:top-[80px] lg:static lg:top-auto z-30'
              : 'sticky top-[80px] md:top-[80px] z-30'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-1 px-3 sm:py-1.5 sm:px-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search events, topics, or venues..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
              {/* Year Filter Dropdown */}
              <div className="relative flex-1 md:flex-initial">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full md:w-40 flex items-center justify-between px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-google-blue transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-google-blue text-xs" />
                    <span>{filterYear === 'All' ? 'All Years' : filterYear}</span>
                  </div>
                  <FaChevronDown
                    className={`text-slate-400 transition-transform duration-200 text-xs ${isDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[90]"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-full md:w-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 py-1.5 z-[100]">
                      {['All', '2026', '2025', '2024'].map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setFilterYear(year);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${filterYear === year
                              ? 'text-google-blue font-bold'
                              : 'text-slate-600 dark:text-slate-300'
                            }`}
                        >
                          {year === 'All' ? 'All Years' : year}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* List / Grid View Switcher */}
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </div>

      {/* Content: List View vs Grid View (Timeline) */}
      {loading && events.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'list' ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <ListItemSkeleton key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          )}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <p className="text-base text-slate-500 dark:text-slate-400">
              No events found matching your criteria.
            </p>
          </div>
        </div>
      ) : view === 'list' ? (
        /* List View (Maintains Pagination) */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 relative z-10">
            {paginatedEvents.map((event, index) => (
              <EventListItem
                key={event.id}
                {...event}
                index={(currentPage - 1) * PAGE_SIZE + index}
                isAdmin={isAdmin}
                onEdit={() =>
                  setModalState({
                    event,
                    index: events.findIndex((e) => e.id === event.id),
                    isNew: false,
                  })
                }
                onDelete={() => handleDeleteEvent(events.findIndex((e) => e.id === event.id))}
              />
            ))}
          </div>

          {/* Pagination Controls - Strictly for list view */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredEvents.length}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
          />
        </div>
      ) : (
        /* Grid View: Full Width Viewport Screen (Line touches both edges) */
        <div className="w-full relative overflow-x-clip">
          <EventsTimelineJourney
            events={filteredEvents}
            allEvents={events}
            isAdmin={isAdmin}
            onMoveUp={(idx) => handleMoveEvent(idx, -1)}
            onMoveDown={(idx) => handleMoveEvent(idx, 1)}
            onEdit={(event, idx) => setModalState({ event, index: idx, isNew: false })}
            onDelete={(idx) => handleDeleteEvent(idx)}
          />
        </div>
      )}
      </div>

      {/* Admin Event Edit/Add Modal */}
      {modalState && (
        <EventModal
          event={modalState.event}
          isNew={modalState.isNew}
          onClose={() => setModalState(null)}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};

export default Events;
