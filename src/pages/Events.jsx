import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
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
  FaSave
} from 'react-icons/fa';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { eventsData as initialEvents } from '../data/eventsData';
import { useAuth } from '../context/AuthContext';
import ViewToggle from '../components/common/ViewToggle';

// --- Event List Item (for List View) ---
const EventListItem = ({
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
};

// --- Event Card (Exact Original with Admin Controls) ---
const EventCard = ({
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
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50, y: 50 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`relative md:w-[calc(50%-2rem)] mb-12 md:mb-24 ${
        isEven ? 'md:ml-auto md:pl-8 pl-8' : 'md:mr-auto md:pr-8 pl-8'
      }`}
    >
      {/* Timeline Connector Dot & Date */}
      <div
        className={`absolute top-8 w-4 h-4 rounded-full bg-white border-4 border-google-blue z-10 shadow-[0_0_15px_rgba(66,133,244,0.5)] 
                -left-[41px]
                ${isEven ? 'md:-left-[calc(2rem+9px)]' : 'md:left-auto md:-right-[calc(2rem+9px)]'}`}
      >
        {/* Date Text (Desktop: Opposite Side, Mobile: Right of dot) */}
        <div
          className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-max text-sm font-bold text-slate-500 dark:text-slate-400
                    ${isEven ? 'right-[calc(100%+1.5rem)]' : 'left-[calc(100%+1.5rem)]'}`}
        >
          {date.split(',')[0]}
        </div>
      </div>

      {/* Mobile Date (Always visible on mobile, hidden on desktop) */}
      <div className="md:hidden absolute -top-8 left-0 text-sm font-bold text-google-blue mb-2">
        {date.split(',')[0]}
      </div>

      {/* Card Content */}
      <div className="relative group">
        {/* Admin In-place Controls */}
        {isAdmin && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-xl border border-slate-700"
          >
            {canMoveUp && (
              <button
                title="Move Up in timeline"
                onClick={onMoveUp}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <FaArrowUp size={11} />
              </button>
            )}
            {canMoveDown && (
              <button
                title="Move Down in timeline"
                onClick={onMoveDown}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <FaArrowDown size={11} />
              </button>
            )}
            <button
              title="Edit Event"
              onClick={onEdit}
              className="p-1.5 text-google-blue hover:bg-google-blue/20 rounded-lg transition-colors"
            >
              <FaEdit size={11} />
            </button>
            <button
              title="Delete Event"
              onClick={onDelete}
              className="p-1.5 text-google-red hover:bg-google-red/20 rounded-lg transition-colors"
            >
              <FaTrash size={11} />
            </button>
          </div>
        )}

        <Link to={`/events/${id}`} className="block">
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-google-blue/10 transition-all duration-300 transform group-hover:-translate-y-2">
            {/* Image Area */}
            <div className="relative w-full overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Type Badge */}
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                {type}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full blur-3xl -z-10 transition-all group-hover:bg-google-blue/10" />

              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <FaMapMarkerAlt className="text-google-red" />
                <span className="truncate max-w-[200px]">{location}</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-google-blue transition-colors">
                {title}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-2 leading-relaxed">
                {description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-xs font-medium text-slate-400">
                  {date.split(',').slice(1).join(',')}
                </span>

                <span className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-google-blue group-hover:bg-google-blue group-hover:text-white transition-all duration-300">
                  <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

// --- Edit/Add Event Modal ---
const EventModal = ({ event, onClose, onSave, isNew = false }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    type: event?.type || 'Workshop',
    date: event?.date || '',
    location: event?.location || 'SATI Campus',
    description: event?.description || '',
    imageUrl: event?.imageUrl || '',
    originalUrl: event?.originalUrl || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...event,
      id: event?.id || `event-${Date.now()}`,
      ...formData,
    });
    onClose();
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Type
              </label>
              <input
                type="text"
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Workshop, Hackathon, etc."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date & Time String *
              </label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. Nov 15, 2024, 10:00 AM"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registration / Link URL
              </label>
              <input
                type="text"
                value={formData.originalUrl}
                onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              className="px-5 py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2"
            >
              <FaSave /> Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Events Component (Exact Original) ---
const Events = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialYear = searchParams.get('year') || 'All';
  const initialQuery = searchParams.get('q') || '';
  const initialView = searchParams.get('view') || (typeof window !== 'undefined' && window.innerWidth < 768 ? 'list' : 'grid');

  const [events, setEvents] = useState(initialEvents);
  const [filterYear, setFilterYearState] = useState(initialYear);
  const [searchQuery, setSearchQueryState] = useState(initialQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [view, setViewState] = useState(initialView);

  const setFilterYear = (yr) => {
    setFilterYearState(yr);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (yr === 'All') next.delete('year');
      else next.set('year', yr);
      return next;
    }, { replace: true });
  };

  const setSearchQuery = (q) => {
    setSearchQueryState(q);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!q.trim()) next.delete('q');
      else next.set('q', q);
      return next;
    }, { replace: true });
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

  const handleDeleteEvent = (index) => {
    if (window.confirm(`Delete event "${events[index].title}"?`)) {
      setEvents(events.filter((_, i) => i !== index));
    }
  };

  const handleSaveEvent = (saved) => {
    if (!modalState) return;
    if (modalState.isNew) {
      setEvents([saved, ...events]);
    } else {
      const updated = [...events];
      updated[modalState.index] = saved;
      setEvents(updated);
    }
  };

  // Filter logic
  const filteredEvents = events.filter((event) => {
    const matchesYear =
      filterYear === 'All' ? true : event.date.includes(filterYear);
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20 pt-10">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-google-blue z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Header (Exact Original) */}
      <div className="relative py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-google-blue/10 text-google-blue text-xs font-bold tracking-widest uppercase mb-4">
            Timeline
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Our <span className="text-google-blue">Journey</span> & Events
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explore our past workshops, hackathons, and speaker sessions. Learn, build, and grow with
            the community.
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
                      date: 'Upcoming, 2025',
                      location: 'SATI Campus',
                      description: '',
                      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
                      originalUrl: '#',
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* Sticky Controls: Search, Filter & View Switcher */}
        <div className="sticky top-[88px] md:top-[96px] z-30 flex flex-col md:flex-row items-center justify-between gap-3 mb-12 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events, topics, or venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Year Filter Dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full md:w-44 flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-google-blue transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-google-blue" />
                  <span>{filterYear === 'All' ? 'All Years' : filterYear}</span>
                </div>
                <FaChevronDown
                  className={`text-slate-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-full md:w-44 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 py-2 z-[100]">
                    {['All', '2024', '2025'].map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setFilterYear(year);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                          filterYear === year
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

        {/* Content: List View vs Grid View (Timeline) */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <p className="text-base text-slate-500 dark:text-slate-400">
              No events found matching your criteria.
            </p>
          </div>
        ) : view === 'list' ? (
          /* List View */
          <div className="space-y-3 relative z-10">
            {filteredEvents.map((event, index) => (
              <EventListItem
                key={event.id}
                {...event}
                index={index}
                isAdmin={isAdmin}
                onEdit={() =>
                  setModalState({
                    event,
                    index,
                    isNew: false,
                  })
                }
                onDelete={() => handleDeleteEvent(index)}
              />
            ))}
          </div>
        ) : (
          /* Grid View (Vertical Timeline) */
          <div className="relative">
            {/* Central Line */}
            <div className="absolute top-0 bottom-0 left-[23px] md:left-1/2 w-0.5 bg-gradient-to-b from-google-blue via-google-red to-google-yellow -translate-x-1/2" />

            <div className="relative z-10">
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  {...event}
                  index={index}
                  isAdmin={isAdmin}
                  canMoveUp={index > 0}
                  canMoveDown={index < filteredEvents.length - 1}
                  onMoveUp={() => handleMoveEvent(index, -1)}
                  onMoveDown={() => handleMoveEvent(index, 1)}
                  onEdit={() =>
                    setModalState({
                      event,
                      index,
                      isNew: false,
                    })
                  }
                  onDelete={() => handleDeleteEvent(index)}
                />
              ))}
            </div>
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
