import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaEdit,
  FaTimes,
  FaSave,
  FaCheckCircle,
  FaStream,
  FaPlus,
  FaTrash,
} from 'react-icons/fa';
import { getEventById } from '../data/eventsData';
import { useAuth } from '../context/AuthContext';
import usePageSEO from '../hooks/usePageSEO';
import {
  EVENT_TYPES,
  getStatusBadgeConfig,
  FormattedDateTimeInput,
  LocationSelect,
  StatusSelect,
} from '../utils/formHelpers';

// Google Brand Colors for timeline nodes
const GOOGLE_COLORS = [
  { bg: 'bg-google-blue/10', border: 'border-google-blue/20', text: 'text-google-blue', dot: 'bg-google-blue' },
  { bg: 'bg-google-red/10', border: 'border-google-red/20', text: 'text-google-red', dot: 'bg-google-red' },
  { bg: 'bg-google-yellow/10', border: 'border-google-yellow/20', text: 'text-google-yellow', dot: 'bg-google-yellow' },
  { bg: 'bg-google-green/10', border: 'border-google-green/20', text: 'text-google-green', dot: 'bg-google-green' },
];

const EventDetails = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  // Find event directly or via sub-activity match
  const initialEvent = getEventById(id);
  const [event, setEvent] = useState(initialEvent);
  const [isEditing, setIsEditing] = useState(false);

  // Form State for editing full content (including timeline sub-events)
  const [formData, setFormData] = useState(
    initialEvent
      ? {
        title: initialEvent.title || '',
        type: initialEvent.type || 'Workshop',
        date: initialEvent.date || '',
        location: initialEvent.location || '',
        description: initialEvent.description || '',
        imageUrl: initialEvent.imageUrl || '',
        originalUrl: initialEvent.originalUrl || '',
        timeline: initialEvent.timeline ? JSON.parse(JSON.stringify(initialEvent.timeline)) : [],
      }
      : {}
  );

  useEffect(() => {
    const found = getEventById(id);
    setEvent(found);
    if (found) {
      setFormData({
        title: found.title || '',
        type: found.type || 'Workshop',
        date: found.date || '',
        location: found.location || '',
        description: found.description || '',
        imageUrl: found.imageUrl || '',
        originalUrl: found.originalUrl || '',
        timeline: found.timeline ? JSON.parse(JSON.stringify(found.timeline)) : [],
      });
    }
  }, [id]);

  usePageSEO({
    title: event ? `${event.title} - Event` : 'Event Details',
    description: event?.description ? event.description.slice(0, 160) : 'Event details and timeline for GDG on Campus SATI Vidisha.',
    path: `/events/${id}`,
  });

  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const handleSave = (e) => {
    e.preventDefault();
    setEvent({
      ...event,
      ...formData,
      timeline: formData.timeline || [],
    });
    setIsEditing(false);
  };

  // Timeline sub-event management handlers for admin edit modal
  const handleAddTimelineItem = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...(prev.timeline || []),
        {
          id: `sub-event-${Date.now()}`,
          title: '',
          cardTitle: '',
          phase: `Stage 0${(prev.timeline?.length || 0) + 1}`,
          date: '',
          location: 'Online',
          description: '',
          originalUrl: '',
          status: 'Planning',
        },
      ],
    }));
  };

  const handleUpdateTimelineItem = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.timeline || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, timeline: updated };
    });
  };

  const handleRemoveTimelineItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeline: (prev.timeline || []).filter((_, i) => i !== index),
    }));
  };

  const hasTimeline = event.timeline && event.timeline.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 sm:pb-20 pt-8 sm:pt-12 md:pt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Header: Back Button and Admin Edit Button */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-slate-600 dark:text-slate-400 hover:text-google-blue dark:hover:text-google-blue transition-colors font-medium text-xs sm:text-sm px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <FaArrowLeft size={12} /> <span>Back to Events</span>
          </Link>

          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold shadow-md transition-all hover:scale-105 shrink-0"
            >
              <FaEdit size={12} /> <span>Edit Details</span>
            </button>
          )}
        </div>

        {/* Main Event Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800"
        >
          {/* Hero Banner Area */}
          <div className="relative w-full overflow-hidden group bg-slate-900">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-36 sm:h-44 bg-gradient-to-r from-google-blue via-indigo-600 to-google-green" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Content Section */}
          {hasTimeline ? (
            /* Events WITH Timeline (e.g. Genesis Hackathon, Hack&Verse Hackathon 2026): Responsive Full-width */
            <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-10">
              {/* About this event */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  About this event
                </h2>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm md:text-base break-words">
                  {event.description}
                </div>
              </div>

              {/* Event Timeline Section */}
              <div className="space-y-5 sm:space-y-6 pt-5 sm:pt-6 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2.5 sm:gap-3 pb-1 sm:pb-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center font-bold shrink-0">
                    <FaStream size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                      Event Timeline
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Step-by-step phases, workshop sessions, and pitching showdowns
                    </p>
                  </div>
                </div>

                {/* Timeline Cards Container */}
                <div className="relative pl-4 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-5 sm:space-y-8 my-3 sm:my-4 ml-2 sm:ml-4">
                  {event.timeline.map((activity, index) => {
                    const colorStyle = GOOGLE_COLORS[index % GOOGLE_COLORS.length];
                    const statusConfig = getStatusBadgeConfig(activity.status);

                    return (
                      <motion.div
                        key={activity.id || index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        className="relative group"
                      >
                        {/* Timeline Node Dot - Precisely centered on the vertical line */}
                        <div
                          className={`absolute -left-[25px] sm:-left-[43px] top-4 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 sm:border-4 border-white dark:border-slate-900 ${colorStyle.dot} shadow-md group-hover:scale-125 transition-transform`}
                        />

                        {/* Activity Card */}
                        <div className="bg-slate-50/80 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-lg transition-all space-y-3 sm:space-y-3.5">
                          {/* Card Header: Phase badge & Preferred Status Badge with color */}
                          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                            <span
                              className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border}`}
                            >
                              {activity.phase || `Stage 0${index + 1}`}
                            </span>

                            {activity.status && (
                              <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-sm ${statusConfig.className}`}>
                                {statusConfig.isLive ? (
                                  <span className="w-1.5 h-1.5 rounded-full bg-google-blue animate-pulse" />
                                ) : statusConfig.label === 'Completed' ? (
                                  <FaCheckCircle size={10} />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                )}
                                {statusConfig.label}
                              </span>
                            )}
                          </div>

                          {/* Activity Title */}
                          <h3 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-google-blue transition-colors break-words">
                            {activity.cardTitle || activity.title}
                          </h3>

                          {/* Date & Location Badges */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {activity.date && (
                              <div className="flex items-center gap-1.5 min-w-0">
                                <FaCalendarAlt className="text-google-yellow shrink-0" size={12} />
                                <span className="break-words">{activity.date}</span>
                              </div>
                            )}
                            {activity.location && (
                              <div className="flex items-center gap-1.5 min-w-0">
                                <FaMapMarkerAlt className="text-google-red shrink-0" size={12} />
                                <span className="break-words">{activity.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Activity Description */}
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line break-words">
                            {activity.description}
                          </p>

                          {/* Card Link / Action */}
                          {activity.originalUrl && (
                            <div className="pt-1 sm:pt-2 flex items-center justify-end">
                              <a
                                href={activity.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white dark:bg-slate-700/80 hover:bg-google-blue hover:text-white text-slate-800 dark:text-slate-100 text-xs font-bold border border-slate-200 dark:border-slate-600 transition-all shadow-sm hover:shadow"
                              >
                                <span>View Activity & Details</span>
                                <FaExternalLinkAlt size={10} />
                              </a>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Events WITHOUT Timeline (e.g. Workshops, Study Jams): Responsive 2-column layout with Date, Location & Link */
            <div className="p-4 sm:p-6 md:p-10">
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12">
                {/* Main Info */}
                <div className="flex-grow space-y-4 sm:space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    About this event
                  </h2>
                  <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm md:text-base break-words">
                    {event.description}
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="w-full lg:w-80 flex-shrink-0 space-y-4 sm:space-y-6">
                  <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4 sm:space-y-6">
                    {/* Date */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-google-red shrink-0">
                        <FaCalendarAlt size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wide mb-0.5 sm:mb-1">
                          Date & Time
                        </h3>
                        <p className="text-slate-900 dark:text-white text-xs sm:text-sm font-medium break-words">
                          {event.date}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-google-green shrink-0">
                        <FaMapMarkerAlt size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wide mb-0.5 sm:mb-1">
                          Location
                        </h3>
                        <p className="text-slate-900 dark:text-white text-xs sm:text-sm font-medium break-words">
                          {event.location}
                        </p>
                      </div>
                    </div>

                    {event.originalUrl && (
                      <>
                        <hr className="border-slate-200 dark:border-slate-700" />
                        {/* Registration Button */}
                        <a
                          href={event.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-3 sm:py-3.5 px-4 sm:px-6 text-center text-white bg-google-blue hover:bg-blue-600 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                          <span>View Original Page</span> <FaExternalLinkAlt size={12} />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Admin Edit Modal - Powered with Dropdowns, Date Formatter & Status Colors */}
      {isEditing && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FaEdit className="text-google-blue" />
                Edit Event Content
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Event Title & Event Type Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Title <span className="text-google-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.type || 'Hackathon'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue font-medium"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time Formatted Input */}
              <FormattedDateTimeInput
                value={formData.date || ''}
                onChange={(val) => setFormData({ ...formData, date: val })}
                label="Date & Time"
                required
              />

              {/* Location Dropdown & Link URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <LocationSelect
                  value={formData.location || ''}
                  onChange={(val) => setFormData({ ...formData, location: val })}
                  label="Location"
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Link / Original URL
                  </label>
                  <input
                    type="text"
                    value={formData.originalUrl || ''}
                    onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                    placeholder="https://gdg.community.dev/..."
                    className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-google-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
                />
              </div>

              {/* Sub-events / Timeline Activities Management */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FaStream className="text-google-green" />
                      Sub-events / Timeline Activities
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Add, edit, or remove stages, sessions, and hackathon showdowns
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTimelineItem}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-google-green/10 text-google-green hover:bg-google-green hover:text-white text-xs font-bold transition-all border border-google-green/20 self-start sm:self-auto"
                  >
                    <FaPlus size={11} /> Add Sub-event
                  </button>
                </div>

                {(!formData.timeline || formData.timeline.length === 0) ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                    No sub-events added. Click &ldquo;+ Add Sub-event&rdquo; above to add activities or timeline stages.
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 max-h-72 sm:max-h-80 overflow-y-auto pr-1">
                    {formData.timeline.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5 sm:space-y-3"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Sub-event #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTimelineItem(index)}
                            className="p-1 text-slate-400 hover:text-google-red transition-colors text-xs"
                            title="Remove this sub-event"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                              Activity Title *
                            </label>
                            <input
                              type="text"
                              required
                              value={item.title || item.cardTitle || ''}
                              onChange={(e) => {
                                handleUpdateTimelineItem(index, 'title', e.target.value);
                                handleUpdateTimelineItem(index, 'cardTitle', e.target.value);
                              }}
                              placeholder="e.g. Inaugural Kick-off"
                              className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                              Phase / Stage Label
                            </label>
                            <input
                              type="text"
                              value={item.phase || ''}
                              onChange={(e) => handleUpdateTimelineItem(index, 'phase', e.target.value)}
                              placeholder="e.g. Stage 01 • Orientation"
                              className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                            />
                          </div>
                        </div>

                        {/* Date & Time with Formatted Picker */}
                        <FormattedDateTimeInput
                          compact
                          value={item.date || ''}
                          onChange={(val) => handleUpdateTimelineItem(index, 'date', val)}
                          label="Activity Date & Time"
                        />

                        {/* Location Dropdown & Status Dropdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <LocationSelect
                            compact
                            value={item.location || ''}
                            onChange={(val) => handleUpdateTimelineItem(index, 'location', val)}
                            label="Venue / Location"
                          />

                          <StatusSelect
                            compact
                            value={item.status || 'Planning'}
                            onChange={(val) => handleUpdateTimelineItem(index, 'status', val)}
                            label="Stage Status"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                            Link / URL
                          </label>
                          <input
                            type="text"
                            value={item.originalUrl || ''}
                            onChange={(e) => handleUpdateTimelineItem(index, 'originalUrl', e.target.value)}
                            placeholder="https://gdg.community.dev/..."
                            className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">
                            Activity Description
                          </label>
                          <textarea
                            rows={2}
                            value={item.description || ''}
                            onChange={(e) => handleUpdateTimelineItem(index, 'description', e.target.value)}
                            placeholder="Brief description of this stage..."
                            className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 sm:py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <FaSave /> Save Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
