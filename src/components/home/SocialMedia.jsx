import React, { useState, useEffect } from 'react';
import {
    FaInstagram,
    FaEdit,
    FaPlus,
    FaTrash,
    FaArrowUp,
    FaArrowDown,
    FaExternalLinkAlt,
    FaTimes,
    FaSave,
    FaSync
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const DEFAULT_REEL_IDS = [
    "Dd8SoS5k6DN",
    "DeEdRZYiHgp",
];

const DEFAULT_EVENTS = "15+";
const DEFAULT_FOLLOWERS = "100+";

/**
 * Extracts the Instagram shortcode ID from any URL or raw ID input.
 * Supports:
 * - https://www.instagram.com/reel/SHORTCODE/...
 * - https://www.instagram.com/reels/SHORTCODE/...
 * - https://www.instagram.com/p/SHORTCODE/...
 * - raw shortcodes like "Dd8SoS5k6DN"
 */
export const extractInstagramId = (input) => {
    if (!input) return '';
    const trimmed = input.trim();
    const match = trimmed.match(/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) {
        return match[1];
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        try {
            const url = new URL(trimmed);
            const segments = url.pathname.split('/').filter(Boolean);
            if (segments.length >= 2 && ['reel', 'reels', 'p'].includes(segments[0])) {
                return segments[1];
            }
            if (segments.length > 0) {
                return segments[segments.length - 1];
            }
        } catch {
            // fallback
        }
    }
    return trimmed.replace(/[^a-zA-Z0-9_-]/g, '');
};

const SocialMedia = () => {
    const { isAdmin } = useAuth();

    // Section Data State
    const [reels, setReels] = useState(() => {
        try {
            const saved = localStorage.getItem('gdg_social_media_data');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed.reels) && parsed.reels.length > 0) {
                    return parsed.reels;
                }
            }
        } catch {
            // ignore
        }
        return DEFAULT_REEL_IDS;
    });

    const [eventsCount, setEventsCount] = useState(() => {
        try {
            const savedData = localStorage.getItem('gdg_social_media_data');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.eventsCount) return parsed.eventsCount;
            }
            const savedEvents = localStorage.getItem('gdg_social_media_events_count');
            if (savedEvents) return savedEvents;
            const savedWhoEvents = localStorage.getItem('gdg_who_we_are_events_count');
            if (savedWhoEvents) return `${savedWhoEvents}+`;
        } catch {
            // ignore
        }
        return DEFAULT_EVENTS;
    });

    const [followers, setFollowers] = useState(() => {
        try {
            const saved = localStorage.getItem('gdg_social_media_data');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.followers) return parsed.followers;
            }
        } catch {
            // ignore
        }
        return DEFAULT_FOLLOWERS;
    });

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [tempReels, setTempReels] = useState(reels);
    const [newReelInput, setNewReelInput] = useState('');
    const [modalEvents, setModalEvents] = useState(eventsCount);
    const [modalFollowers, setModalFollowers] = useState(followers);
    const [isSaving, setIsSaving] = useState(false);
    const [inputError, setInputError] = useState('');
    const [saveError, setSaveError] = useState('');

    // Fetch from backend on mount
    useEffect(() => {
        const loadSectionData = async () => {
            try {
                const res = await api.sections.get('social_media');
                if (res.success && res.data && res.data.data) {
                    const data = res.data.data;
                    if (Array.isArray(data.reels) && data.reels.length > 0) {
                        setReels(data.reels);
                    }
                    if (data.eventsCount) {
                        setEventsCount(data.eventsCount);
                    }
                    if (data.followers) {
                        setFollowers(data.followers);
                    }
                }
            } catch (err) {
                console.warn('Could not load social_media section from API:', err);
            }
        };
        loadSectionData();
    }, []);

    // Synchronize events count when updated from Who We Are section
    useEffect(() => {
        const handleSync = (event) => {
            if (!event.detail) return;
            if (event.detail.eventsCount !== undefined) {
                const val = String(event.detail.eventsCount);
                setEventsCount(val.endsWith('+') ? val : `${val}+`);
            } else if (event.detail.numericEventsCount !== undefined) {
                setEventsCount(`${event.detail.numericEventsCount}+`);
            }
        };

        window.addEventListener('gdg_stats_updated', handleSync);
        return () => window.removeEventListener('gdg_stats_updated', handleSync);
    }, []);

    const openEditModal = () => {
        setTempReels([...reels]);
        setNewReelInput('');
        setModalEvents(eventsCount);
        setModalFollowers(followers);
        setInputError('');
        setSaveError('');
        setIsEditModalOpen(true);
    };

    // Add reel/post from input
    const handleAddReel = () => {
        setInputError('');
        if (!newReelInput.trim()) return;

        // Support single or multiple comma/newline separated entries
        const inputs = newReelInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
        const added = [];

        for (const raw of inputs) {
            const extractedId = extractInstagramId(raw);
            if (!extractedId) continue;

            if (tempReels.includes(extractedId) || added.includes(extractedId)) {
                setInputError(`"${extractedId}" is already added to the list.`);
                continue;
            }
            added.push(extractedId);
        }

        if (added.length > 0) {
            setTempReels((prev) => [...prev, ...added]);
            setNewReelInput('');
        } else if (!inputError) {
            setInputError('Could not recognize a valid Instagram Reel or Post URL/ID.');
        }
    };

    const handleKeyDownAdd = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddReel();
        }
    };

    // Reorder reels
    const handleMoveReel = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= tempReels.length) return;
        const updated = [...tempReels];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        setTempReels(updated);
    };

    // Remove reel
    const handleRemoveReel = (index) => {
        setTempReels((prev) => prev.filter((_, i) => i !== index));
    };

    // Save changes
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError('');

        try {
            const cleanedEvents = modalEvents.trim() || DEFAULT_EVENTS;
            const formattedEvents = cleanedEvents.endsWith('+')
                ? cleanedEvents
                : `${cleanedEvents.replace(/[^0-9]/g, '') || '0'}+`;

            const cleanedFollowers = modalFollowers.trim() || DEFAULT_FOLLOWERS;
            const formattedFollowers = cleanedFollowers.endsWith('+')
                ? cleanedFollowers
                : (cleanedFollowers.includes('K') || cleanedFollowers.includes('M') ? cleanedFollowers : `${cleanedFollowers}+`);

            const finalReels = tempReels.length > 0 ? tempReels : DEFAULT_REEL_IDS;

            // 1. Update component state
            setReels(finalReels);
            setEventsCount(formattedEvents);
            setFollowers(formattedFollowers);

            // 2. Persist locally
            const socialPayload = {
                reels: finalReels,
                eventsCount: formattedEvents,
                followers: formattedFollowers,
            };
            localStorage.setItem('gdg_social_media_data', JSON.stringify(socialPayload));
            localStorage.setItem('gdg_social_media_events_count', formattedEvents);

            // 3. Save to backend social_media section
            await api.sections.update('social_media', {
                sectionKey: 'social_media',
                title: 'Latest Happenings On Instagram',
                data: socialPayload,
            });

            // 4. Auto-sync with Who We Are section in backend
            const numericEvents = parseInt(formattedEvents.replace(/[^0-9]/g, ''), 10) || 15;
            try {
                const whoRes = await api.sections.get('who_we_are');
                const currentWho = whoRes?.data?.data || {};
                await api.sections.update('who_we_are', {
                    sectionKey: 'who_we_are',
                    title: 'Who We Are',
                    data: {
                        ...currentWho,
                        eventsCount: numericEvents,
                    },
                });
                localStorage.setItem('gdg_who_we_are_events_count', String(numericEvents));
            } catch (err) {
                console.warn('Could not sync events count to backend who_we_are section:', err);
            }

            // 5. Broadcast to live components across the page
            window.dispatchEvent(
                new CustomEvent('gdg_stats_updated', {
                    detail: {
                        eventsCount: formattedEvents,
                        numericEventsCount: numericEvents,
                    },
                })
            );

            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Failed to save social media section:', err);
            setSaveError(err.message || 'Failed to save changes to server.');
        } finally {
            setIsSaving(false);
        }
    };

    // Duplicate for seamless vertical scroller loop
    const displayReelIds = reels.length === 1
        ? [reels[0], reels[0]]
        : (reels.length > 0 ? [...reels, ...reels] : DEFAULT_REEL_IDS);

    return (
        <section className="py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-google-yellow/10 rounded-full blur-3xl -z-10 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-google-red/10 rounded-full blur-3xl -z-10 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="text-center lg:text-left order-2 lg:order-1">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                            
                            {isAdmin && (
                                <button
                                    onClick={openEditModal}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-md hover:scale-105 border border-slate-700/60 cursor-pointer"
                                    title="Edit Instagram Reels, Events & Followers"
                                >
                                    <FaEdit className="text-google-yellow text-xs" />
                                    <span>Edit Section</span>
                                </button>
                            )}
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            Latest Happenings <br />
                            <span className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent">On Instagram</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                            Dive into the energy of our community! Catch the latest event highlights, workshop snippets, and behind-the-scenes fun directly from our Instagram feed.
                        </p>

                        <a
                            href="https://www.instagram.com/gdgsatividisha"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold hover:shadow-xl hover:scale-105 transition-all shadow-lg group"
                        >
                            <FaInstagram className="text-2xl group-hover:rotate-12 transition-transform" />
                            <span>Follow @gdgoc.sati</span>
                        </a>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-slate-900 dark:text-white">{eventsCount}</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">Events</span>
                            </div>
                            <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-slate-900 dark:text-white">{followers}</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">Followers</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Mockup */}
                    <div className="relative order-1 lg:order-2 flex justify-center">
                        {/* Phone Frame */}
                        <div className="relative w-[300px] h-[600px] border-8 border-slate-900 dark:border-slate-800 rounded-[3rem] bg-slate-900 shadow-2xl overflow-hidden z-10">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>

                            {/* Screen Content */}
                            <div className="w-full h-full bg-white dark:bg-black overflow-hidden relative">
                                {/* Instagram Header Mockup */}
                                <div className="absolute top-0 left-0 right-0 h-16 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 flex items-end pb-2 px-4 shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Reels</h3>
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    </div>
                                </div>

                                {/* Scrolling Container */}
                                <div className="animate-scroll-vertical w-full">
                                    {displayReelIds.map((id, index) => (
                                        <div key={`${id}-${index}`} className="w-full h-[580px] relative border-b border-slate-100 dark:border-slate-800 bg-black">
                                            <iframe
                                                src={`https://www.instagram.com/reel/${id}/embed`}
                                                className="w-full h-full"
                                                frameBorder="0"
                                                scrolling="no"
                                                allowTransparency="true"
                                                allow="autoplay; encrypted-media"
                                                title={`Instagram Content ${index + 1}`}
                                            ></iframe>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Phone Shadow/Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600 to-orange-600 rounded-[3.5rem] blur-xl opacity-30 -z-10 animate-pulse"></div>
                    </div>

                </div>
            </div>

            {/* Social Media Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FaInstagram className="text-pink-500" />
                                        Edit Social Media Section
                                    </h3>
                                    <p className="text-xs text-slate-500">Configure reel links, order, events count and followers</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
                                {saveError && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs">
                                        {saveError}
                                    </div>
                                )}

                                {/* REEL URL INPUT & MANAGEMENT */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Instagram Reels & Posts ({tempReels.length})
                                        </label>

                                    </div>

                                    {/* URL Entry Input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newReelInput}
                                            onChange={(e) => setNewReelInput(e.target.value)}
                                            onKeyDown={handleKeyDownAdd}
                                            placeholder="Paste URL (e.g. https://www.instagram.com/reel/Dd8SoS5k6DN/) or ID"
                                            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddReel}
                                            className="px-4 py-2.5 bg-gradient-to-r from-[#833ab4] to-[#fd1d1d] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0 cursor-pointer"
                                        >
                                            <FaPlus size={11} />
                                            <span>Add</span>
                                        </button>
                                    </div>

                                    {inputError && (
                                        <p className="text-[11px] text-red-500 mt-1.5">{inputError}</p>
                                    )}

                                 

                                    {/* Reel List with Reordering */}
                                    <div className="mt-4 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                                        {tempReels.length === 0 ? (
                                            <div className="p-6 text-center text-xs text-slate-400">
                                                No reels currently added. Paste a link above to add.
                                            </div>
                                        ) : (
                                            tempReels.map((id, index) => (
                                                <div
                                                    key={`${id}-${index}`}
                                                    className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <span className="w-6 h-6 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold flex items-center justify-center shrink-0">
                                                            {index + 1}
                                                        </span>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                                                    {id}
                                                                </span>
                                                                <a
                                                                    href={`https://www.instagram.com/reel/${id}/`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-slate-400 hover:text-pink-500 transition-colors text-xs"
                                                                    title="Open Reel on Instagram"
                                                                >
                                                                    <FaExternalLinkAlt size={10} />
                                                                </a>
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 truncate block">
                                                                instagram.com/reel/{id}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Order Buttons & Delete */}
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMoveReel(index, -1)}
                                                            disabled={index === 0}
                                                            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                                                            title="Move Up"
                                                        >
                                                            <FaArrowUp size={11} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMoveReel(index, 1)}
                                                            disabled={index === tempReels.length - 1}
                                                            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                                                            title="Move Down"
                                                        >
                                                            <FaArrowDown size={11} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveReel(index)}
                                                            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                                                            title="Remove Reel"
                                                        >
                                                            <FaTrash size={11} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* METRICS & STATS */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Events Count
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={modalEvents}
                                            onChange={(e) => setModalEvents(e.target.value)}
                                            placeholder="e.g. 15 or 15+"
                                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />

                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Followers Count
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={modalFollowers}
                                            onChange={(e) => setModalFollowers(e.target.value)}
                                            placeholder="e.g. 100 or 100+"
                                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                      
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white rounded-xl shadow-lg shadow-pink-500/20 flex items-center gap-1.5 disabled:opacity-50 transition-all hover:scale-105 cursor-pointer"
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

export default SocialMedia;

