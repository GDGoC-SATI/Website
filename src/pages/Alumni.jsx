import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLinkedin, 
  FaGithub, 
  FaInstagram, 
  FaQuoteLeft, 
  FaExternalLinkAlt,
  FaChevronDown,
  FaRocket
} from 'react-icons/fa';
import { alumniData } from '../data/alumniData';

const LegacyProfileCard = ({ alumni, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full group overflow-hidden rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl dark:shadow-google-blue/5 transition-all duration-500 mb-12 last:mb-0"
    >
      {/* Background Decorative Glow */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" 
        style={{ backgroundColor: alumni.color }}
      />

      <div className="flex flex-col lg:flex-row min-h-[400px] items-stretch">
        {/* Left Section: Visual & Photo */}
        <div className="lg:w-2/5 relative overflow-hidden bg-slate-50 dark:bg-slate-800/50 p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
            <div className="relative mb-8">
                <motion.div 
                    animate={{ rotate: isHovered ? 360 : 0 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 opacity-50"
                    style={{ borderColor: isHovered ? alumni.color : undefined }}
                />
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                    <img 
                        src={alumni.image} 
                        alt={alumni.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-6xl font-black text-slate-300">${alumni.name.charAt(0)}</div>`;
                        }}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                {alumni.linkedin && (
                <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#0077b5] dark:hover:text-[#0077b5] border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 shadow-lg group/icon">
                    <FaLinkedin size={22} />
                </a>
                )}
                {alumni.github && (
                <a href={alumni.github} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 shadow-lg group/icon">
                    <FaGithub size={22} />
                </a>
                )}
                {alumni.instagram && (
                <a href={alumni.instagram} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#e4405f] dark:hover:text-[#e4405f] border border-slate-100 dark:border-slate-700 transition-all hover:scale-110 shadow-lg group/icon">
                    <FaInstagram size={22} />
                </a>
                )}
            </div>
        </div>

        {/* Right Section: Core Info */}
        <div className="lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative ">
            <div className="absolute top-12 right-12 text-slate-100 dark:text-white/5 pointer-events-none group-hover:text-google-blue/10 transition-colors hidden md:block">
                <FaQuoteLeft size={120} />
            </div>

            <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ backgroundColor: alumni.color }}>
                    {alumni.era}
                </span>
            </div>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 z-[10]">
                {alumni.name}
            </h3>
            
            <p className="text-lg md:text-xl font-bold text-google-blue mb-8">
                {alumni.role}
            </p>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg italic mb-10 border-l-4 border-slate-100 dark:border-slate-800 pl-6">
                "{alumni.bio}"
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
                {alumni.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const Alumni = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [selectedOrg, setSelectedOrg] = useState("All");
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isOrgOpen, setIsOrgOpen] = useState(false);

  const batches = ["All", ...new Set(alumniData.map(a => a.batch))].sort();
  const orgs = ["All", "GDG", "GDSC", "GDGoC"];

  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         alumni.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBatch = selectedBatch === "All" || alumni.batch === selectedBatch;
    const matchesOrg = selectedOrg === "All" || alumni.org.includes(selectedOrg);

    return matchesSearch && matchesBatch && matchesOrg;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 transition-colors duration-500 pt-10 pb-40 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] bg-google-blue/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[60vw] h-[60vw] bg-google-red/5 blur-[140px] rounded-full animate-pulse-slow" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Simplified Header */}
        <div className="mb-16 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-google-blue/10 text-google-blue text-xs font-black uppercase tracking-widest mb-8"
            >
                <FaRocket /> Community Legacy
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white tracking-tighter mb-4"
            >
                Our <span className="text-google-blue">Alumni.</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 font-light"
            >
                Search through our archive of legends who shaped the tech ecosystem at SATI.
            </motion.p>
        </div>

        {/* Filter Controls */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-20 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-50"
        >
            <div className="md:col-span-2 relative group">
                <input 
                    type="text" 
                    placeholder="Search by name, role or skill..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-google-blue transition-all text-slate-600 dark:text-slate-200"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-google-blue transition-colors">
                    <FaExternalLinkAlt className="rotate-45" size={18} />
                </div>
            </div>

            {/* Batch Dropdown */}
            <div className="relative">
                <button
                    onClick={() => {
                        setIsBatchOpen(!isBatchOpen);
                        setIsOrgOpen(false);
                    }}
                    className="w-full h-full flex items-center justify-between px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-700 text-slate-600 dark:text-slate-200 transition-all hover:ring-google-blue "
                >
                    <span className="truncate">{selectedBatch === "All" ? "Vintage Batch (All)" : selectedBatch}</span>
                    <FaChevronDown className={`transition-transform duration-300 ${isBatchOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence mode='wait'>
                    {isBatchOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-2"
                        >
                            {batches.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => {
                                        setSelectedBatch(year);
                                        setIsBatchOpen(false);
                                    }}
                                    className={`w-full text-left px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${selectedBatch === year ? 'text-google-blue font-bold bg-google-blue/5' : 'text-slate-600 dark:text-slate-300'}`}
                                >
                                    {year === "All" ? "Vintage Batch (All)" : year}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                {isBatchOpen && <div className="fixed inset-0 z-[40]" onClick={() => setIsBatchOpen(false)} />}
            </div>

            {/* Org Dropdown */}
            <div className="relative">
                <button
                    onClick={() => {
                        setIsOrgOpen(!isOrgOpen);
                        setIsBatchOpen(false);
                    }}
                    className="w-full h-full flex items-center justify-between px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-700 text-slate-600 dark:text-slate-200 transition-all hover:ring-google-blue"
                >
                    <span className="truncate">{selectedOrg === "All" ? "Community Realm (All)" : selectedOrg}</span>
                    <FaChevronDown className={`transition-transform duration-300 ${isOrgOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence mode='wait'>
                    {isOrgOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-2"
                        >
                            {orgs.map((org) => (
                                <button
                                    key={org}
                                    onClick={() => {
                                        setSelectedOrg(org);
                                        setIsOrgOpen(false);
                                    }}
                                    className={`w-full text-left px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${selectedOrg === org ? 'text-google-blue font-bold bg-google-blue/5' : 'text-slate-600 dark:text-slate-300'}`}
                                >
                                    {org === "All" ? "Community Realm (All)" : org}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                {isOrgOpen && <div className="fixed inset-0 z-[40]" onClick={() => setIsOrgOpen(false)} />}
            </div>
        </motion.div>

        {/* Continuous Stream of Profiles */}
        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {filteredAlumni.length > 0 ? (
                filteredAlumni.map((alumni, i) => (
                    <LegacyProfileCard key={alumni.id} alumni={alumni} index={i} />
                ))
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-40 text-center"
                >
                    <div className="text-8xl mb-8">🔍</div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">No Legacy Found</h3>
                    <p className="text-slate-400">Try adjusting your filters or search keywords.</p>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Simple Footer CTA */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-40 text-center"
        >
            <div className="inline-block p-1 bg-gradient-to-r from-google-blue via-google-red to-google-yellow rounded-[3rem]">
                <div className="bg-white dark:bg-slate-900 px-12 py-8 rounded-[2.9rem]">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">Want to be part of the legacy?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto italic">"The best way to predict the future is to create it."</p>
                    <a href="/contact" className="px-10 py-5 rounded-2xl bg-google-blue text-white font-black hover:scale-105 transition-all shadow-xl inline-block">
                        Join Our Community
                    </a>
                </div>
            </div>
        </motion.div>
      </div>

      <style jsx="true">{`
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default Alumni;
