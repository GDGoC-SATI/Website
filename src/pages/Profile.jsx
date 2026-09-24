import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaTrash,
  FaExternalLinkAlt,
  FaIdCard,
  FaTrophy,
  FaBriefcase,
  FaSave,
  FaTimes,
  FaCheck,
  FaLock,
  FaCode,
  FaGraduationCap,
  FaCamera,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGlobe,
} from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { UserAvatar } from '../utils/avatarHelper';
import { ProfileSkeleton } from '../components/common/Skeleton';

const renderSocialBadges = (socialObj) => {
  if (!socialObj) return null;
  const items = [
    { key: 'github', label: 'GitHub', icon: FaGithub, href: socialObj.github, color: 'hover:text-black dark:hover:text-white hover:border-slate-400' },
    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, href: socialObj.linkedin, color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]' },
    { key: 'twitter', label: 'Twitter', icon: FaTwitter, href: socialObj.twitter, color: 'hover:text-[#1DA1F2] hover:border-[#1DA1F2]' },
    { key: 'instagram', label: 'Instagram', icon: FaInstagram, href: socialObj.instagram, color: 'hover:text-[#E4405F] hover:border-[#E4405F]' },
    { key: 'website', label: 'Website', icon: FaGlobe, href: socialObj.website, color: 'hover:text-google-green hover:border-google-green' },
  ].filter((item) => Boolean(item.href && item.href.trim()));

  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mt-3">
      {items.map((item) => {
        const url = item.href.startsWith('http://') || item.href.startsWith('https://')
          ? item.href
          : `https://${item.href}`;
        return (
          <a
            key={item.key}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all shadow-sm ${item.color}`}
            title={item.label}
          >
            <item.icon size={13} />
            <span>{item.label}</span>
            <FaExternalLinkAlt size={9} className="opacity-60" />
          </a>
        );
      })}
    </div>
  );
};

const Profile = () => {
  const { username: paramUsername } = useParams();
  const { user, loading, isAuthenticated, isAdmin, updateProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Determine if viewing another user's profile
  const isViewingOther = Boolean(paramUsername && (!user || paramUsername !== user.username));

  // Viewing other user state
  const [otherUser, setOtherUser] = useState(null);
  const [otherLoading, setOtherLoading] = useState(false);
  const [otherError, setOtherError] = useState('');

  // Edit Mode toggle
  const [isEditMode, setIsEditMode] = useState(false);

  // Profile fields state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [college, setCollege] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [socials, setSocials] = useState({
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    website: '',
  });

  // Modals for adding Project & Achievement
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    techStack: '',
    link: '',
    description: '',
  });

  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    roleOrOrg: '',
    year: '',
    description: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Storage key helper
  const getStorageKey = (userIdOrUsername) => `gdg_profile_meta_${userIdOrUsername}`;
  const getPrivacyKey = (userIdOrUsername) => `gdg_privacy_${userIdOrUsername}`;

  // Fetch other user profile when isViewingOther is true
  useEffect(() => {
    if (isViewingOther && paramUsername) {
      const fetchOtherProfile = async () => {
        setOtherLoading(true);
        setOtherError('');
        try {
          const res = await api.auth.getUserByUsername(paramUsername);
          if (res.success && res.user) {
            // Merge with any local extra data or privacy settings
            const localMeta = localStorage.getItem(getStorageKey(res.user.username)) || localStorage.getItem(getStorageKey(res.user._id));
            const localPrivacy = localStorage.getItem(getPrivacyKey(res.user.username)) || localStorage.getItem(getPrivacyKey(res.user._id));
            
            let extra = {};
            if (localMeta) {
              try { extra = JSON.parse(localMeta); } catch {}
            }
            let privacy = {};
            if (localPrivacy) {
              try { privacy = JSON.parse(localPrivacy); } catch {}
            }

            setOtherUser({
              ...res.user,
              ...extra,
              privacySettings: {
                ...(res.user.privacySettings || {}),
                ...privacy,
              },
            });
          } else {
            setOtherError('User not found');
          }
        } catch (err) {
          setOtherError(err.message || 'User profile could not be loaded');
        } finally {
          setOtherLoading(false);
        }
      };
      fetchOtherProfile();
    }
  }, [isViewingOther, paramUsername]);

  // Sync own profile data
  useEffect(() => {
    if (loading) return;
    if (!isViewingOther) {
      if (!isAuthenticated && !paramUsername) {
        navigate('/login');
      } else if (user) {
        setName(user.name || '');
        setUsername(user.username || '');
        setBio(user.bio || '');
        setAvatar(user.avatar || '');

        const defaultSocials = {
          github: '',
          linkedin: '',
          twitter: '',
          instagram: '',
          website: '',
          ...(user.socials || {}),
        };

        // Load meta from localStorage if available
        const localMeta = localStorage.getItem(getStorageKey(user.username)) || localStorage.getItem(getStorageKey(user._id));
        if (localMeta) {
          try {
            const parsed = JSON.parse(localMeta);
            setEnrollmentNo(parsed.enrollmentNo || user.enrollmentNo || '');
            setCollege(parsed.college || user.college || 'SATI Vidisha');
            setSkills(parsed.skills || user.skills || ['React', 'JavaScript', 'TailwindCSS']);
            setProjects(parsed.projects || user.projects || []);
            setAchievements(parsed.achievements || user.achievements || []);
            setSocials({
              ...defaultSocials,
              ...(parsed.socials || {}),
            });
            return;
          } catch {}
        }

        setEnrollmentNo(user.enrollmentNo || '');
        setCollege(user.college || 'SATI Vidisha');
        setSkills(user.skills || ['React', 'JavaScript', 'TailwindCSS']);
        setProjects(user.projects || []);
        setAchievements(user.achievements || []);
        setSocials(defaultSocials);
      }
    }
  }, [user, loading, isAuthenticated, isViewingOther, navigate, paramUsername]);

  // Handle Save Own Profile
  const handleProfileSave = async (e) => {
    if (e) e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const payload = {
        name,
        username,
        bio,
        avatar,
        enrollmentNo,
        college,
        skills,
        projects,
        achievements,
        socials,
      };

      // Call API
      await updateProfile(payload).catch((err) => {
        console.warn('API updateProfile returned warning:', err);
      });

      // Also persist to localStorage for instant persistence
      if (user) {
        localStorage.setItem(
          getStorageKey(user.username || user._id),
          JSON.stringify({
            enrollmentNo,
            college,
            skills,
            projects,
            achievements,
            socials,
          })
        );
      }

      setProfileSuccess('Profile updated successfully!');
      toast.success('Your profile details have been saved successfully!');
      setIsEditMode(false);
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Add Project
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const updatedProjects = [
      ...projects,
      {
        id: `proj-${Date.now()}`,
        title: newProject.title.trim(),
        techStack: newProject.techStack ? newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean) : [],
        link: newProject.link.trim(),
        description: newProject.description.trim(),
      },
    ];

    setProjects(updatedProjects);
    setNewProject({ title: '', techStack: '', link: '', description: '' });
    setIsProjectModalOpen(false);
    toast.success(`Project "${newProject.title.trim()}" added to showcase!`);

    // Save to local storage
    if (user) {
      localStorage.setItem(
        getStorageKey(user.username || user._id),
        JSON.stringify({
          enrollmentNo,
          college,
          skills,
          projects: updatedProjects,
          achievements,
        })
      );
    }
  };

  const handleDeleteProject = (projId) => {
    const updated = projects.filter((p) => p.id !== projId);
    setProjects(updated);
    toast.info('Project removed from showcase');
    if (user) {
      localStorage.setItem(
        getStorageKey(user.username || user._id),
        JSON.stringify({
          enrollmentNo,
          college,
          skills,
          projects: updated,
          achievements,
        })
      );
    }
  };

  // Add Achievement
  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!newAchievement.title.trim()) return;

    const updatedAchievements = [
      ...achievements,
      {
        id: `ach-${Date.now()}`,
        title: newAchievement.title.trim(),
        roleOrOrg: newAchievement.roleOrOrg.trim(),
        year: newAchievement.year.trim() || new Date().getFullYear().toString(),
        description: newAchievement.description.trim(),
      },
    ];

    setAchievements(updatedAchievements);
    setNewAchievement({ title: '', roleOrOrg: '', year: '', description: '' });
    setIsAchievementModalOpen(false);
    toast.success(`Achievement "${newAchievement.title.trim()}" added!`);

    // Save to local storage
    if (user) {
      localStorage.setItem(
        getStorageKey(user.username || user._id),
        JSON.stringify({
          enrollmentNo,
          college,
          skills,
          projects,
          achievements: updatedAchievements,
        })
      );
    }
  };

  const handleDeleteAchievement = (achId) => {
    const updated = achievements.filter((a) => a.id !== achId);
    setAchievements(updated);
    toast.info('Achievement entry removed');
    if (user) {
      localStorage.setItem(
        getStorageKey(user.username || user._id),
        JSON.stringify({
          enrollmentNo,
          college,
          skills,
          projects,
          achievements: updated,
        })
      );
    }
  };

  // Add / Remove Skills
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!skillInput.trim()) return;
      if (!skills.includes(skillInput.trim())) {
        const updatedSkills = [...skills, skillInput.trim()];
        setSkills(updatedSkills);
        if (user) {
          localStorage.setItem(
            getStorageKey(user.username || user._id),
            JSON.stringify({
              enrollmentNo,
              skills: updatedSkills,
              projects,
              achievements,
            })
          );
        }
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(updatedSkills);
    if (user) {
      localStorage.setItem(
        getStorageKey(user.username || user._id),
        JSON.stringify({
          enrollmentNo,
          skills: updatedSkills,
          projects,
          achievements,
        })
      );
    }
  };

  // ----------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------
  if ((!paramUsername && loading) || (isViewingOther && otherLoading)) {
    return <ProfileSkeleton />;
  }

  // ----------------------------------------------------
  // VIEWING ANOTHER USER
  // ----------------------------------------------------
  if (isViewingOther) {
    if (otherError || !otherUser) {
      return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-google-blue dark:text-slate-400 mb-6"
            >
              <FaArrowLeft /> Back
            </button>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-800">
              <FaUser className="text-4xl text-slate-300 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">User Not Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                The requested profile @{paramUsername} could not be found or has been removed.
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 rounded-xl bg-google-blue text-white text-xs font-bold"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Check if otherUser has private profile turned ON - Admins can view ANY profile
    const isProfilePrivate = Boolean(otherUser.privacySettings?.isPrivate && !isAdmin);
    const isEmailHidden = Boolean(otherUser.privacySettings?.hideEmail && !isAdmin);

    return (
      <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-google-blue dark:text-slate-400 mb-6 transition-colors"
          >
            <FaArrowLeft /> Back
          </button>

          {/* Profile Card Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-8">
            {/* Banner with clean gradient */}
            <div className="h-20 sm:h-35 bg-gradient-to-r from-google-blue via-indigo-600 to-google-green relative">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
            </div>

            {/* Profile Info Area (relative z-10 ensures it sits cleanly in stacking order) */}
            <div className="px-6 sm:px-10 pb-8 relative z-10">
              {/* Row 1: Overlapping Avatar and Joined Meta */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
                <div className="relative z-20 shrink-0 inline-block">
                  <UserAvatar
                    user={otherUser}
                    size="xl"
                    className="border-4 border-white dark:border-slate-900 shadow-2xl ring-2 ring-slate-100 dark:ring-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
                  <FaCalendarAlt className="text-google-yellow" />
                  <span>
                    Joined{' '}
                    {new Date(otherUser.createdAt || Date.now()).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Row 2: Name, Role Badge, Username, and Email (100% in content area, never overlapping banner) */}
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {otherUser.name}
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      otherUser.role === 'admin'
                        ? 'bg-google-red/10 text-google-red border border-google-red/20'
                        : 'bg-google-blue/10 text-google-blue border border-google-blue/20'
                    }`}
                  >
                    {otherUser.role === 'admin' ? 'Chapter Admin' : 'Community Member'}
                  </span>
                  {otherUser.privacySettings?.isPrivate && isAdmin && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      Private (Admin Access)
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-google-blue font-semibold mt-1">
                  @{otherUser.username}
                </p>

                {!isEmailHidden && otherUser.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-2.5">
                    <FaEnvelope className="text-google-red shrink-0" />
                    <span>{otherUser.email}</span>
                  </div>
                )}

                {renderSocialBadges(otherUser.socials)}
              </div>
            </div>
          </div>

          {/* If Private Profile */}
          {isProfilePrivate ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                <FaLock />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                This Profile is Private
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                This member has set their profile to private. Their projects, achievements, and enrollment details are not publicly visible.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Bio & Details */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    About
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {otherUser.bio || 'This member has not written a bio yet.'}
                  </p>
                </div>

                {/* Enrollment & Department Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center shrink-0">
                      <FaIdCard size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">Enrollment No.</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                        {otherUser.enrollmentNo || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center shrink-0">
                      <FaGraduationCap size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">College</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                        {otherUser.college || 'SATI Vidisha'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {otherUser.skills && otherUser.skills.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <FaCode /> Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {otherUser.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/80 dark:border-slate-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links for otherUser */}
                {otherUser.socials && Object.values(otherUser.socials).some((val) => Boolean(val && val.trim())) && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <FaGlobe className="text-google-blue" /> Connected Profiles & Links
                    </h3>
                    {renderSocialBadges(otherUser.socials)}
                  </div>
                )}
              </div>

              {/* Projects Showcase */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-google-blue" /> Projects Showcase
                </h3>
                {otherUser.projects && otherUser.projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {otherUser.projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {proj.title}
                            </h4>
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-google-blue hover:text-blue-600 p-1"
                              >
                                <FaExternalLinkAlt size={12} />
                              </a>
                            )}
                          </div>
                          {proj.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                              {proj.description}
                            </p>
                          )}
                        </div>
                        {proj.techStack && proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {proj.techStack.map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No projects added yet.</p>
                )}
              </div>

              {/* Experience / Achievements */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaTrophy className="text-google-yellow" /> Experience & Achievements
                </h3>
                {otherUser.achievements && otherUser.achievements.length > 0 ? (
                  <div className="space-y-3">
                    {otherUser.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                          <FaTrophy size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {ach.title}
                            </h4>
                            <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                              {ach.year}
                            </span>
                          </div>
                          {ach.roleOrOrg && (
                            <p className="text-xs text-google-blue font-medium mt-0.5">
                              {ach.roleOrOrg}
                            </p>
                          )}
                          {ach.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                              {ach.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No achievements added yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // OWN PROFILE (AUTHENTICATED USER)
  // ----------------------------------------------------
  if (!user) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-google-blue dark:text-slate-400 transition-colors"
          >
            <FaArrowLeft /> Back to Home
          </Link>
        </div>

        {/* Profile Notifications */}
        {profileSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-2xl text-xs font-semibold flex items-center gap-2"
          >
            <FaCheck /> {profileSuccess}
          </motion.div>
        )}
        {profileError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-xs font-semibold"
          >
            {profileError}
          </motion.div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-8">
          {/* Banner with clean gradient */}
          <div className="h-20 sm:h-35 bg-gradient-to-r from-google-blue via-indigo-600 to-google-green relative">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
          </div>

          {/* Profile Info Area (relative z-10 ensures it sits cleanly in stacking order) */}
          <div className="px-6 sm:px-10 pb-8 relative z-10">
            {/* Row 1: Overlapping Avatar and Joined Date / Edit Action */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              <div className="relative z-20 shrink-0 inline-block">
                <UserAvatar
                  user={user}
                  size="xl"
                  className="border-4 border-white dark:border-slate-900 shadow-2xl ring-2 ring-slate-100 dark:ring-slate-800"
                />
              </div>

              {/* Right side: Joined Date & Edit / Save Buttons */}
              <div className="flex items-center gap-3 flex-wrap self-start sm:self-auto">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <FaCalendarAlt className="text-google-yellow" />
                  <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                </div>

                {!isEditMode ? (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-1.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-google-blue/20 transition-all flex items-center gap-1.5"
                  >
                    <FaEdit size={11} /> Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleProfileSave}
                      disabled={profileLoading}
                      className="px-4 py-1.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <FaSave size={11} /> {profileLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1"
                    >
                      <FaTimes size={11} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Name, Role Badge, Username, and Email (100% in content area, never overlapping banner) */}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.role === 'admin'
                      ? 'bg-google-red/10 text-google-red border border-google-red/20'
                      : 'bg-google-blue/10 text-google-blue border border-google-blue/20'
                  }`}
                >
                  {user.role === 'admin' ? 'Chapter Admin' : 'Community Member'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-google-blue font-semibold mt-1">
                @{user.username || user.email?.split('@')[0]}
              </p>

              {user.email && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-2.5">
                  <FaEnvelope className="text-google-red shrink-0" />
                  <span>{user.email}</span>
                </div>
              )}

              {renderSocialBadges(socials)}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* EDIT MODE INTERFACE */}
        {/* ==================================================== */}
        {isEditMode ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 mb-8"
          >
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
              Edit Profile Details
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Update your personal info, enrollment credentials, skills, and bio
            </p>

            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white"
                    />
                    <FaUser className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Enrollment Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 0108IT211045"
                      value={enrollmentNo}
                      onChange={(e) => setEnrollmentNo(e.target.value.toUpperCase().trim())}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white"
                    />
                    <FaIdCard className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    College / University
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. SATI Vidisha"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white"
                    />
                    <FaGraduationCap className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Avatar Image URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://api.dicebear.com/..."
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white"
                    />
                    <FaCamera className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Bio / About
                </label>
                <textarea
                  rows="3"
                  placeholder="Share a short bio about your tech interests, projects, or goals..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white resize-none"
                />
              </div>

              {/* Skills Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Skills (Type skill and press Enter or Add)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. React, Python, Cloud..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Media Links Section */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <FaGlobe className="text-google-blue" /> Social Media & Portfolio Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* GitHub */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GitHub URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={socials.github}
                        onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white"
                      />
                      <FaGithub className="absolute left-3 top-2.5 text-slate-500 text-sm" />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      LinkedIn URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={socials.linkedin}
                        onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white"
                      />
                      <FaLinkedin className="absolute left-3 top-2.5 text-[#0A66C2] text-sm" />
                    </div>
                  </div>

                  {/* Twitter / X */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Twitter / X URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://twitter.com/username"
                        value={socials.twitter}
                        onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white"
                      />
                      <FaTwitter className="absolute left-3 top-2.5 text-[#1DA1F2] text-sm" />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Instagram URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://instagram.com/username"
                        value={socials.instagram}
                        onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white"
                      />
                      <FaInstagram className="absolute left-3 top-2.5 text-[#E4405F] text-sm" />
                    </div>
                  </div>

                  {/* Website / Portfolio */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Website / Portfolio URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://yourportfolio.dev"
                        value={socials.website}
                        onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white"
                      />
                      <FaGlobe className="absolute left-3 top-2.5 text-google-green text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 bg-google-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-google-blue/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <FaSave /> {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}

        {/* ==================================================== */}
        {/* NORMAL VIEW MODE CONTENT */}
        {/* ==================================================== */}
        <div className="space-y-6">
          {/* Bio & Academic Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {bio || 'Share a short bio about your tech interests, projects, or goals by clicking Edit Profile.'}
              </p>
            </div>

            {/* Enrollment & Institution info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center shrink-0">
                  <FaIdCard size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400 font-medium">Enrollment No.</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                    {enrollmentNo || 'Not added yet'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center shrink-0">
                  <FaGraduationCap size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400 font-medium">College</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                    {college || user.college || 'SATI Vidisha'}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Pills */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <FaCode /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/80 dark:border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed yet</span>
                )}
              </div>
            </div>

            {/* Social Media Links Presence */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FaGlobe className="text-google-blue" /> Connected Profiles & Links
                </h3>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className="text-[11px] font-semibold text-google-blue hover:underline"
                  >
                    Edit Links
                  </button>
                )}
              </div>
              {Object.values(socials).some((val) => Boolean(val && val.trim())) ? (
                renderSocialBadges(socials)
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No social media profiles linked yet. Click Edit Profile to add GitHub, LinkedIn, Twitter, Instagram, or Portfolio.
                </p>
              )}
            </div>
          </div>

          {/* Projects Section with '+' Icon Button */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FaBriefcase className="text-google-blue" /> Projects
              </h3>
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(true)}
                className="p-2 rounded-xl bg-google-blue/10 hover:bg-google-blue/20 text-google-blue text-xs font-bold transition-all flex items-center gap-1.5"
                title="Add Project"
              >
                <FaPlus size={11} /> Add Project
              </button>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between group relative"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {proj.title}
                        </h4>
                        <div className="flex items-center gap-1 shrink-0">
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-google-blue hover:text-blue-600 p-1"
                              title="Live Link"
                            >
                              <FaExternalLinkAlt size={11} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete Project"
                          >
                            <FaTrash size={11} />
                          </button>
                        </div>
                      </div>
                      {proj.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                          {proj.description}
                        </p>
                      )}
                    </div>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800">
                <FaBriefcase className="mx-auto mb-2 text-slate-300 dark:text-slate-700 text-2xl" />
                <p className="text-xs text-slate-500 mb-2">No projects added to showcase yet.</p>
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(true)}
                  className="text-xs text-google-blue font-bold hover:underline"
                >
                  + Add your first project
                </button>
              </div>
            )}
          </div>

          {/* Experience / Achievements Section with '+' Icon Button */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FaTrophy className="text-google-yellow" /> Experience / Achievements
              </h3>
              <button
                type="button"
                onClick={() => setIsAchievementModalOpen(true)}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Add Experience / Achievement"
              >
                <FaPlus size={11} /> Add
              </button>
            </div>

            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                        <FaTrophy size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {ach.title}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                            {ach.year}
                          </span>
                        </div>
                        {ach.roleOrOrg && (
                          <p className="text-xs text-google-blue font-medium mt-0.5">
                            {ach.roleOrOrg}
                          </p>
                        )}
                        {ach.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                            {ach.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAchievement(ach.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      title="Delete entry"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800">
                <FaTrophy className="mx-auto mb-2 text-slate-300 dark:text-slate-700 text-2xl" />
                <p className="text-xs text-slate-500 mb-2">No experience or achievements listed yet.</p>
                <button
                  type="button"
                  onClick={() => setIsAchievementModalOpen(true)}
                  className="text-xs text-google-blue font-bold hover:underline"
                >
                  + Add your experience or milestone
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Add Project */}
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaBriefcase className="text-google-blue" /> Add Project
                </h3>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <FaTimes size={13} />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Campus Navigator"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Live Demo or GitHub Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, MongoDB"
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Brief description of what you built..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold"
                  >
                    Add Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Achievement */}
        {isAchievementModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaTrophy className="text-google-yellow" /> Add Experience / Achievement
                </h3>
                <button
                  onClick={() => setIsAchievementModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <FaTimes size={13} />
                </button>
              </div>

              <form onSubmit={handleAddAchievement} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Title / Award *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1st Place at Smart India Hackathon"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Organization / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Google Cloud / Intern"
                      value={newAchievement.roleOrOrg}
                      onChange={(e) => setNewAchievement({ ...newAchievement, roleOrOrg: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Year / Period
                    </label>
                    <input
                      type="text"
                      placeholder="2024"
                      value={newAchievement.year}
                      onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Key highlights or impact..."
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-google-blue resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAchievementModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold"
                  >
                    Add Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
