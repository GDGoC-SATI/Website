import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaCode,
  FaCamera,
  FaCalendarAlt,
  FaBullhorn,
  FaTimes,
  FaGraduationCap,
  FaLayerGroup,
  FaExternalLinkAlt,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaSave
} from 'react-icons/fa';
import { leads as initialLeads, teams as initialTeams } from '../data/teamData';
import { useAuth } from '../context/AuthContext';

// --- Profile Details Modal (Exact Original) ---
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
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl md:text-6xl font-bold text-slate-400">
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 text-google-blue">
                <FaCode size={14} style={{ color: themeColor }} />
              </div>
            </div>

            {/* Quick Actions (Socials) */}
            <div className="flex gap-2 mb-0 pl-5">
              {member.socials?.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform hover:bg-[#0077b5] hover:text-white"
                >
                  <FaLinkedin size={18} />
                </a>
              )}
              {member.socials?.instagram && (
                <a
                  href={member.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform hover:bg-pink-600 hover:text-white"
                >
                  <FaInstagram size={18} />
                </a>
              )}
              {member.socials?.github && (
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black"
                >
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
                  <div className="flex flex-wrap gap-2">
                    {member.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Edit/Add Member Modal for Admin ---
const MemberEditModal = ({ member, onClose, onSave, isNew = false }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    class: member?.class || '',
    bio: member?.bio || '',
    image: member?.image || '',
    linkedin: member?.socials?.linkedin || '',
    github: member?.socials?.github || '',
    instagram: member?.socials?.instagram || '',
    tags: member?.tags ? member.tags.join(', ') : '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...member,
      name: formData.name,
      role: formData.role,
      class: formData.class,
      bio: formData.bio,
      image: formData.image,
      socials: {
        linkedin: formData.linkedin || null,
        github: formData.github || null,
        instagram: formData.instagram || null,
      },
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FaEdit className="text-google-blue" />
            {isNew ? 'Add Team Member' : `Edit: ${member.name}`}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
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
                Role *
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
                Class / Year
              </label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                placeholder="e.g. CSE - 3rd Year"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://... or /assets/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-google-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bio
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
              Tags / Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="React, Leadership, Cloud"
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
                placeholder="URL"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">GitHub</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="URL"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="URL"
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
              <FaSave /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Profile Card (Exact Original with Admin Controls) ---
const ProfileCard = ({
  member,
  onClick,
  color = '#4285F4',
  isAdmin,
  onEdit,
  onDelete,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight
}) => {
  return (
    <motion.div
      layoutId={`card-${member.name}`}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden cursor-pointer border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top colored accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: color }} />

      {/* Admin Action Bar (Only visible to admin) */}
      {isAdmin && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md px-2 py-1 rounded-xl shadow-lg border border-slate-700"
        >
          {canMoveLeft && (
            <button
              title="Move backward"
              onClick={onMoveLeft}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FaArrowLeft size={11} />
            </button>
          )}
          {canMoveRight && (
            <button
              title="Move forward"
              onClick={onMoveRight}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FaArrowRight size={11} />
            </button>
          )}
          <button
            title="Edit member"
            onClick={onEdit}
            className="p-1.5 text-google-blue hover:bg-google-blue/20 rounded-lg transition-colors"
          >
            <FaEdit size={11} />
          </button>
          <button
            title="Delete member"
            onClick={onDelete}
            className="p-1.5 text-google-red hover:bg-google-red/20 rounded-lg transition-colors"
          >
            <FaTrash size={11} />
          </button>
        </div>
      )}

      <div className="p-6 md:p-8 flex flex-col items-center text-center">
        <div className="w-28 h-28 mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900 shadow-md group-hover:scale-105 transition-transform duration-300">
            {member.image ? (
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-slate-400">{member.name.charAt(0)}</span>
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
          {member.tags?.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700"
            >
              {tag}
            </span>
          ))}
          {member.tags?.length > 2 && (
            <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-100 dark:border-slate-700">
              +{member.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      <div className="w-full pt-4 pb-4 border-t border-slate-50 dark:border-slate-800 flex justify-center">
        <span className="text-xs font-semibold text-google-blue flex items-center gap-1">
          View Profile <FaExternalLinkAlt size={10} />
        </span>
      </div>
    </motion.div>
  );
};

// --- Toggle Button (Exact Original) ---
const ToggleButton = ({ icon: Icon, color, isActive, onClick, label }) => (
  <button
    onClick={onClick}
    className="relative flex flex-col items-center justify-center transition-all duration-300 group"
  >
    <div
      className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 
                ${
                  isActive
                    ? 'scale-110 ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 shadow-lg'
                    : 'hover:scale-105 opacity-80 hover:opacity-100 hover:shadow-lg'
                }`}
      style={{
        backgroundColor: color,
        boxShadow: isActive ? `0 10px 25px -5px ${color}60` : undefined,
      }}
    >
      <Icon className="text-xl md:text-2xl" />
    </div>
    <span
      className={`absolute -bottom-8 text-xs font-bold transition-all duration-300 ${
        isActive
          ? 'opacity-100 translate-y-0 text-slate-900 dark:text-white'
          : 'opacity-0 -translate-y-2 text-slate-500'
      }`}
    >
      {label}
    </span>
  </button>
);

// --- Main Page Component ---
const Team = () => {
  const { isAdmin } = useAuth();
  const [activeTeam, setActiveTeam] = useState('technical');
  const [selectedMember, setSelectedMember] = useState(null);

  // Leads & Teams data stored in local state for live in-place admin operations
  const [leadsList, setLeadsList] = useState(initialLeads);
  const [teamsData, setTeamsData] = useState(initialTeams);

  // Edit Modal State
  const [editingTarget, setEditingTarget] = useState(null); // { type: 'lead' | 'team', teamKey?: string, index: number, member: object, isNew?: boolean }

  // Lead Actions
  const handleMoveLead = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= leadsList.length) return;
    const updated = [...leadsList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setLeadsList(updated);
  };

  const handleDeleteLead = (index) => {
    if (window.confirm(`Delete chapter lead "${leadsList[index].name}"?`)) {
      setLeadsList(leadsList.filter((_, i) => i !== index));
    }
  };

  // Team Member Actions
  const handleMoveMember = (teamKey, index, direction) => {
    const members = [...teamsData[teamKey].members];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= members.length) return;
    const temp = members[index];
    members[index] = members[targetIndex];
    members[targetIndex] = temp;
    setTeamsData({
      ...teamsData,
      [teamKey]: { ...teamsData[teamKey], members },
    });
  };

  const handleDeleteMember = (teamKey, index) => {
    const memberName = teamsData[teamKey].members[index].name;
    if (window.confirm(`Delete team member "${memberName}"?`)) {
      const members = teamsData[teamKey].members.filter((_, i) => i !== index);
      setTeamsData({
        ...teamsData,
        [teamKey]: { ...teamsData[teamKey], members },
      });
    }
  };

  // Save changes from Edit Modal
  const handleSaveMember = (savedMember) => {
    if (!editingTarget) return;
    const { type, teamKey, index, isNew } = editingTarget;

    if (type === 'lead') {
      if (isNew) {
        setLeadsList([...leadsList, savedMember]);
      } else {
        const updated = [...leadsList];
        updated[index] = savedMember;
        setLeadsList(updated);
      }
    } else if (type === 'team') {
      const members = [...teamsData[teamKey].members];
      if (isNew) {
        members.push(savedMember);
      } else {
        members[index] = savedMember;
      }
      setTeamsData({
        ...teamsData,
        [teamKey]: { ...teamsData[teamKey], members },
      });
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Header (Exact Original) */}
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
            The talented individuals working behind the scenes to bring you the best events, workshops,
            and community experiences.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-20">
        {/* Leads Section */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-800"></div>
            <div className="flex items-center gap-3 px-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center uppercase tracking-wide">
                Chapter Leads
              </h2>
              {isAdmin && (
                <button
                  onClick={() =>
                    setEditingTarget({
                      type: 'lead',
                      index: -1,
                      member: { name: '', role: 'Lead', class: '', bio: '', tags: [] },
                      isNew: true,
                    })
                  }
                  className="flex items-center gap-1 px-3 py-1 bg-google-blue text-white rounded-lg text-xs font-bold shadow hover:bg-blue-600 transition-colors"
                >
                  <FaPlus size={10} /> Add Lead
                </button>
              )}
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-800"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {leadsList.map((member, i) => (
              <ProfileCard
                key={i}
                member={member}
                onClick={() => setSelectedMember({ ...member, themeColor: '#57caff' })}
                color="#57caff"
                isAdmin={isAdmin}
                canMoveLeft={i > 0}
                canMoveRight={i < leadsList.length - 1}
                onMoveLeft={() => handleMoveLead(i, -1)}
                onMoveRight={() => handleMoveLead(i, 1)}
                onEdit={() =>
                  setEditingTarget({
                    type: 'lead',
                    index: i,
                    member,
                    isNew: false,
                  })
                }
                onDelete={() => handleDeleteLead(i)}
              />
            ))}
          </div>
        </div>

        {/* Team Toggles & Grid (Exact Original) */}
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
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full"
              >
                <div className="text-center mb-10 flex flex-col items-center">
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ color: teamsData[activeTeam].color }}
                  >
                    {teamsData[activeTeam].title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-3">Powering the community forward</p>
                  {isAdmin && (
                    <button
                      onClick={() =>
                        setEditingTarget({
                          type: 'team',
                          teamKey: activeTeam,
                          index: -1,
                          member: {
                            name: '',
                            role: `${teamsData[activeTeam].title} Member`,
                            class: '',
                            bio: '',
                            tags: [],
                          },
                          isNew: true,
                        })
                      }
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow hover:opacity-90 transition-opacity"
                    >
                      <FaPlus size={10} /> Add Member to {teamsData[activeTeam].title}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {teamsData[activeTeam].members.map((member, i) => (
                    <ProfileCard
                      key={i}
                      member={{ ...member, team: teamsData[activeTeam].title }}
                      onClick={() =>
                        setSelectedMember({
                          ...member,
                          team: teamsData[activeTeam].title,
                          themeColor: teamsData[activeTeam].color,
                        })
                      }
                      color={teamsData[activeTeam].color}
                      isAdmin={isAdmin}
                      canMoveLeft={i > 0}
                      canMoveRight={i < teamsData[activeTeam].members.length - 1}
                      onMoveLeft={() => handleMoveMember(activeTeam, i, -1)}
                      onMoveRight={() => handleMoveMember(activeTeam, i, 1)}
                      onEdit={() =>
                        setEditingTarget({
                          type: 'team',
                          teamKey: activeTeam,
                          index: i,
                          member,
                          isNew: false,
                        })
                      }
                      onDelete={() => handleDeleteMember(activeTeam, i)}
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

      {/* Global Profile Details Modal (Exact Original) */}
      <AnimatePresence>
        {selectedMember && (
          <ProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
        )}
      </AnimatePresence>

      {/* Admin Member Edit/Add Modal */}
      {editingTarget && (
        <MemberEditModal
          member={editingTarget.member}
          isNew={editingTarget.isNew}
          onClose={() => setEditingTarget(null)}
          onSave={handleSaveMember}
        />
      )}
    </div>
  );
};

export default Team;
