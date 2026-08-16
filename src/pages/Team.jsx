import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaCode, FaCamera, FaCalendarAlt, FaBullhorn, FaTimes, FaGraduationCap, FaLayerGroup, FaExternalLinkAlt } from 'react-icons/fa';
import { leads, teams } from '../data/teamData';

// --- Components ---

const ProfileModal = ({ member, onClose }) => {
    if (!member) return null;

    const themeColor = member.themeColor || '#4285F4'; // Default to Google Blue

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
            >
                {/* Header Banner */}
                <div
                    className="h-28 md:h-28 w-full relative overflow-hidden"
                    style={{ backgroundColor: themeColor }}
                >
                    {/* Abstract decorative circles */}
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-black/5 blur-lg"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-all backdrop-blur-md"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="px-8 pb-8 -mt-20">
                    <div className="flex justify-between items-end mb-6">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-lg">
                                {/* Profile Image or Initials */}
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl md:text-6xl font-bold text-slate-400">
                                        {member.name.charAt(0)}
                                    </span>
                                )}
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div> */}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 text-google-blue">
                                <FaCode size={14} style={{ color: themeColor }} />
                            </div>
                        </div>

                        {/* Quick Actions (Socials) */}
                        <div className="flex gap-2 mb-0 pl-5">
                            {member.socials?.linkedin && (
                                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform hover:bg-[#0077b5] hover:text-white">
                                    <FaLinkedin size={18} />
                                </a>
                            )}
                            {member.socials?.instagram && (
                                <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform hover:bg-pink-600 hover:text-white">
                                    <FaInstagram size={18} />
                                </a>
                            )}
                            {member.socials?.github && (
                                <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black">
                                    <FaGithub size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* content */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                {member.team || 'Core Team'}
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {member.name}
                        </h2>
                        <p className="text-base font-medium" style={{ color: themeColor }}>
                            {member.role}
                        </p>
                        {member.class && (
                            <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-sm">
                                <FaGraduationCap size={14} style={{ color: themeColor }} />
                                <span>{member.class}</span>
                            </div>
                        )}

                        <div className="my-6 h-px w-full bg-slate-100 dark:bg-slate-800"></div>

                        {/* Bio & Details */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <FaBullhorn size={10} /> Bio
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FaLayerGroup size={10} /> Expertise
                                    </h3>
                                    <div className="flex  gap-2">
                                        {member.tags.map((tag, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                            <button className="text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
                                View Full Profile <FaExternalLinkAlt size={10} />
                            </button>
                        </div> */}

                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ProfileCard = ({ member, onClick, color = '#4285F4' }) => {
    return (
        <motion.div
            layoutId={`card-${member.name}`}
            whileHover={{ y: -8 }}
            onClick={onClick}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden cursor-pointer border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
        >
            {/* Top colored accent bar */}
            <div className="h-1 w-full" style={{ backgroundColor: color }} />

            <div className="p-6 md:p-8 flex flex-col items-center text-center">
                <div className="w-28 h-28 mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900 shadow-md group-hover:scale-105 transition-transform duration-300">
                        {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-slate-400">
                                {member.name.charAt(0)}
                            </span>
                        )}
                    </div>
                    {/* Badge/Icon overlay */}
                    <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 text-google-blue">
                        <FaCode size={14} />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-google-blue transition-colors">
                    {member.name}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">
                    {member.role}
                </p>
                {member.class && (
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1">
                        <FaGraduationCap size={10} /> {member.class}
                    </p>
                )}
                {!member.class && <div className="mb-4" />}

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {member.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                            {tag}
                        </span>
                    ))}
                    {member.tags.length > 2 && (
                        <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-100 dark:border-slate-700">
                            +{member.tags.length - 2}
                        </span>
                    )}
                </div>

                <div className="w-full pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-center">
                    <span className="text-xs font-semibold text-google-blue flex items-center gap-1">
                        View Profile <FaExternalLinkAlt size={10} />
                    </span>
                </div>
            </div>
        </motion.div>
    );
};


const ToggleButton = ({ icon: Icon, color, isActive, onClick, label }) => (
    <button
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center transition-all duration-300 group`}
    >
        <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 
                ${isActive
                    ? 'scale-110 ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 shadow-lg'
                    : 'hover:scale-105 opacity-80 hover:opacity-100 hover:shadow-lg'
                }`}
            style={{
                backgroundColor: color,
                boxShadow: isActive ? `0 10px 25px -5px ${color}60` : undefined
            }}
        >
            <Icon className="text-xl md:text-2xl" />
        </div>
        <span className={`absolute -bottom-8 text-xs font-bold transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0 text-slate-900 dark:text-white' : 'opacity-0 -translate-y-2 text-slate-500'}`}>
            {label}
        </span>
    </button>
);

// --- Main Page Component ---

const Team = () => {
    const [activeTeam, setActiveTeam] = useState('technical');
    const [selectedMember, setSelectedMember] = useState(null);

    return (
        <div className="min-h-screen pb-10 bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* Header */}
            <div className="relative bg-slate-50 dark:bg-slate-900/50 py-10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-google-blue/10 text-google-blue text-xs font-bold tracking-widest uppercase mb-4">
                        Community
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Meet The <span className="text-google-blue">GDG</span> Crew
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        The talented individuals working behind the scenes to bring you the best events, workshops, and community experiences.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-20">

                {/* Leads Section */}
                <div className='flex flex-col items-center'>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-800"></div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center uppercase tracking-wide">Chapter Leads</h2>
                        <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                        {leads.map((member, i) => (
                            <ProfileCard
                                key={i}
                                member={member}
                                onClick={() => setSelectedMember({ ...member, themeColor: '#57caff' })}
                                color="#57caff"
                            />
                        ))}
                    </div>
                </div>

                {/* Team Toggles & Grid */}
                <div className="flex flex-col items-center space-y-12">
                    {/* Toggles */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        <ToggleButton
                            icon={FaCode}
                            color="#EA4335"
                            isActive={activeTeam === 'technical'}
                            onClick={() => setActiveTeam(activeTeam === 'technical' ? null : 'technical')}
                            label="Technical"
                        />
                        <ToggleButton
                            icon={FaCamera}
                            color="#4285F4"
                            isActive={activeTeam === 'media'}
                            onClick={() => setActiveTeam(activeTeam === 'media' ? null : 'media')}
                            label="Media"
                        />
                        <ToggleButton
                            icon={FaCalendarAlt}
                            color="#34A853"
                            isActive={activeTeam === 'events'}
                            onClick={() => setActiveTeam(activeTeam === 'events' ? null : 'events')}
                            label="Events"
                        />
                        <ToggleButton
                            icon={FaBullhorn}
                            color="#FBBC04"
                            isActive={activeTeam === 'management'}
                            onClick={() => setActiveTeam(activeTeam === 'management' ? null : 'management')}
                            label="Management"
                        />
                    </div>

                    {/* Active Team Grid */}
                    <AnimatePresence mode="wait">
                        {activeTeam ? (
                            <motion.div
                                key={activeTeam}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="w-full"
                            >
                                <div className="text-center mb-10">
                                    <h2
                                        className="text-3xl md:text-4xl font-bold mb-2"
                                        style={{ color: teams[activeTeam].color }}
                                    >
                                        {teams[activeTeam].title}
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400">Powering the community forward</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {teams[activeTeam].members.map((member, i) => (
                                        <ProfileCard
                                            key={i}
                                            member={{ ...member, team: teams[activeTeam].title }}
                                            onClick={() => setSelectedMember({
                                                ...member,
                                                team: teams[activeTeam].title,
                                                themeColor: teams[activeTeam].color
                                            })}
                                            color={teams[activeTeam].color}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-slate-400 py-10"
                            >
                                <p className="text-lg">Select a team button above to view members</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Global Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <ProfileModal
                        member={selectedMember}
                        onClose={() => setSelectedMember(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Team;

