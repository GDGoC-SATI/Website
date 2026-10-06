import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaUserFriends, FaCalendarAlt, FaEdit, FaTimes, FaSave, FaSync } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const DEFAULT_MEMBERS = 1020;
const DEFAULT_EVENTS = 15;

const StatsCard = ({ icon, count, label, suffix = "" }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    return (
        <div ref={ref} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center hover:shadow-md transition-shadow">
            <div className="text-4xl text-google-blue mb-4 flex justify-center">{icon}</div>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {inView ? <CountUp end={count} duration={2.5} /> : 0}{suffix}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">{label}</p>
        </div>
    );
};

const WhatWeDo = () => {
    const { isAdmin } = useAuth();

    // Stats State
    const [communityMembers, setCommunityMembers] = useState(() => {
        try {
            const saved = localStorage.getItem('gdg_who_we_are_stats');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.communityMembers) return parsed.communityMembers;
            }
        } catch {
            // ignore
        }
        return DEFAULT_MEMBERS;
    });

    const [eventsCount, setEventsCount] = useState(() => {
        try {
            const savedWho = localStorage.getItem('gdg_who_we_are_stats');
            if (savedWho) {
                const parsed = JSON.parse(savedWho);
                if (parsed.eventsCount) return parsed.eventsCount;
            }
            const savedEvents = localStorage.getItem('gdg_who_we_are_events_count');
            if (savedEvents) return parseInt(savedEvents, 10) || DEFAULT_EVENTS;
        } catch {
            // ignore
        }
        return DEFAULT_EVENTS;
    });

    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalMembers, setModalMembers] = useState(communityMembers);
    const [modalEvents, setModalEvents] = useState(eventsCount);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Fetch from backend on mount
    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await api.sections.get('who_we_are');
                if (res.success && res.data && res.data.data) {
                    const data = res.data.data;
                    if (data.communityMembers !== undefined) {
                        setCommunityMembers(data.communityMembers);
                    }
                    if (data.eventsCount !== undefined) {
                        const num = parseInt(String(data.eventsCount).replace(/[^0-9]/g, ''), 10);
                        if (!isNaN(num)) setEventsCount(num);
                    }
                }
            } catch (err) {
                console.warn('Could not load who_we_are section from API:', err);
            }
        };
        loadStats();
    }, []);

    // Listen for cross-section sync events (e.g. when Instagram section updates events count)
    useEffect(() => {
        const handleSync = (event) => {
            if (!event.detail) return;
            if (event.detail.numericEventsCount !== undefined) {
                setEventsCount(event.detail.numericEventsCount);
            } else if (event.detail.eventsCount !== undefined) {
                const num = parseInt(String(event.detail.eventsCount).replace(/[^0-9]/g, ''), 10);
                if (!isNaN(num)) {
                    setEventsCount(num);
                }
            }
            if (event.detail.communityMembers !== undefined) {
                setCommunityMembers(event.detail.communityMembers);
            }
        };

        window.addEventListener('gdg_stats_updated', handleSync);
        return () => window.removeEventListener('gdg_stats_updated', handleSync);
    }, []);

    const openEditModal = () => {
        setModalMembers(communityMembers);
        setModalEvents(eventsCount);
        setSaveError('');
        setIsEditModalOpen(true);
    };

    const handleSaveStats = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError('');

        try {
            const numMembers = parseInt(String(modalMembers).replace(/[^0-9]/g, ''), 10) || DEFAULT_MEMBERS;
            const numEvents = parseInt(String(modalEvents).replace(/[^0-9]/g, ''), 10) || DEFAULT_EVENTS;
            const formattedEvents = `${numEvents}+`;

            // 1. Update component state
            setCommunityMembers(numMembers);
            setEventsCount(numEvents);

            // 2. Persist locally
            const whoWeArePayload = {
                communityMembers: numMembers,
                eventsCount: numEvents,
            };
            localStorage.setItem('gdg_who_we_are_stats', JSON.stringify(whoWeArePayload));
            localStorage.setItem('gdg_who_we_are_events_count', String(numEvents));
            localStorage.setItem('gdg_social_media_events_count', formattedEvents);

            // 3. Save to backend who_we_are section
            await api.sections.update('who_we_are', {
                sectionKey: 'who_we_are',
                title: 'Who We Are',
                data: whoWeArePayload,
            });

            // 4. Auto-sync with social_media section in backend
            try {
                const socialRes = await api.sections.get('social_media');
                const currentSocial = socialRes?.data?.data || {};
                await api.sections.update('social_media', {
                    sectionKey: 'social_media',
                    title: 'Latest Happenings On Instagram',
                    data: {
                        ...currentSocial,
                        eventsCount: formattedEvents,
                    },
                });
            } catch (err) {
                console.warn('Could not sync events count to backend social_media section:', err);
            }

            // 5. Broadcast to any other live sections on page
            window.dispatchEvent(
                new CustomEvent('gdg_stats_updated', {
                    detail: {
                        eventsCount: formattedEvents,
                        numericEventsCount: numEvents,
                        communityMembers: numMembers,
                    },
                })
            );

            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Failed to save who we are stats:', err);
            setSaveError(err.message || 'Failed to save stats to server.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="py-15 bg-slate-50 dark:bg-slate-900/50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    <div>
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                Who We Are
                            </h2>
                            {isAdmin && (
                                <button
                                    onClick={openEditModal}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-google-blue text-white text-xs font-semibold hover:bg-blue-600 transition-all shadow-md shadow-google-blue/20 hover:scale-105 cursor-pointer"
                                    title="Edit Who We Are statistics"
                                >
                                    <FaEdit className="text-xs" />
                                    <span>Edit Stats</span>
                                </button>
                            )}
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            Google Developer Groups On Campus SATI Vidisha is a community-driven initiative for students to grow as developers. We bridge the gap between theory and practice by providing a platform for peer-to-peer learning.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            From hosting hands-on workshops and hackathons to building real-world projects, we aim to foster a culture of innovation and collaboration. Whether you are a beginner or an expert, there is a place for you here.
                        </p>
                        <a
                            href="https://gdg.community.dev/gdg-on-campus-samrat-ashok-technological-institute-vidisha-india/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-google-blue hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
                        >
                            Join Our Community
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-6 relative">
                        <StatsCard icon={<FaUserFriends />} count={communityMembers} label="Community Members" suffix="+" />
                        <StatsCard icon={<FaCalendarAlt />} count={eventsCount} label="Events Hosted" suffix="+" />
                        <div className="col-span-2">
                            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-64 overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29266.43797179915!2d77.8151027!3d23.5215392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c048a269d1ab7%3A0xf7b28bf51d19bbcc!2sSamrat%20Ashok%20Technological%20Institute!5e0!3m2!1sen!2sin!4v1769781361896!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="SATI Vidisha Location"
                                    className="rounded-xl w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Who We Are Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FaEdit className="text-google-blue" />
                                        Edit Who We Are Stats
                                    </h3>
                                    <p className="text-xs text-slate-500">Configure community metrics and event numbers</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSaveStats} className="p-6 space-y-4">
                                {saveError && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs">
                                        {saveError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Community Members Count
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={modalMembers}
                                        onChange={(e) => setModalMembers(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-google-blue"
                                        placeholder="e.g. 1020"
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">Displayed with '+' suffix (e.g. {modalMembers || 0}+)</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Events Hosted Count
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={modalEvents}
                                        onChange={(e) => setModalEvents(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-google-blue"
                                        placeholder="e.g. 15"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-5 py-2 text-xs font-bold bg-google-blue hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-google-blue/20 flex items-center gap-1.5 disabled:opacity-50 transition-all hover:scale-105"
                                    >
                                        <FaSave size={12} /> {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default WhatWeDo;
