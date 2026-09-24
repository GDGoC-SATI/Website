import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaSearch,
} from 'react-icons/fa';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ItemEditorModal, DeleteConfirmModal } from '../components/admin/AdminModals';
import { CardSkeleton } from '../components/common/Skeleton';
import ViewToggle from '../components/common/ViewToggle';

const ProjectListItem = ({ project, isAdmin, onEdit, onDelete }) => {
  const { title, description, techStack, links, image } = project;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group overflow-hidden"
    >
      <div className={`flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1 ${isAdmin ? 'pr-16 sm:pr-0' : ''}`}>
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <FaCode className="text-2xl text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-google-green transition-colors truncate">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
            {description}
          </p>
          <div className="flex flex-wrap gap-1.5 max-w-full overflow-hidden">
            {Array.isArray(techStack) &&
              techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md border border-slate-200 dark:border-slate-700/60 truncate max-w-[150px]"
                >
                  {tech}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Admin Controls Top-Right Inside Card */}
      {isAdmin && (
        <div className="absolute top-3.5 right-3.5 sm:static flex items-center gap-1 z-10 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-2">
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-slate-700 dark:text-slate-200 shadow-sm transition-all text-xs"
            title="Edit Project"
          >
            <FaEdit size={11} />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-red-500 shadow-sm transition-all text-xs"
            title="Delete Project"
          >
            <FaTrash size={11} />
          </button>
        </div>
      )}

      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          {links?.live && (
            <a
              href={links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-google-green hover:text-white transition-all text-xs"
              title="Live Demo"
            >
              <FaExternalLinkAlt size={12} />
            </a>
          )}
          {links?.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all text-xs"
              title="GitHub"
            >
              <FaGithub size={13} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectCard = ({ project, isAdmin, onEdit, onDelete }) => {
  const { title, description, techStack, links, image } = project;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 flex flex-col h-full group relative"
    >
      {/* Admin Action Buttons */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-30 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 hover:bg-google-blue hover:text-white text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md transition-all text-xs"
            title="Edit Project"
          >
            <FaEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 hover:bg-red-600 hover:text-white text-red-500 shadow-md backdrop-blur-md transition-all text-xs"
            title="Delete Project"
          >
            <FaTrash />
          </button>
        </div>
      )}

      <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 ${
            image ? 'hidden' : 'flex'
          }`}
        >
          <FaCode className="text-6xl" />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {links?.live && (
            <a
              href={links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-full text-slate-900 hover:text-google-blue transition-all transform hover:scale-110 shadow-lg"
              title="Live Demo"
            >
              <FaExternalLinkAlt />
            </a>
          )}
          {links?.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-full text-slate-900 hover:text-google-blue transition-all transform hover:scale-110 shadow-lg"
              title="View Code"
            >
              <FaGithub />
            </a>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {Array.isArray(techStack) &&
            techStack.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700/60"
              >
                {tech}
              </span>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin Controls State
  const { isAdmin } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Request Form State
  const requestSectionRef = useRef(null);
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDescription, setReqDescription] = useState('');
  const [reqTechStack, setReqTechStack] = useState('');
  const [reqSourceCode, setReqSourceCode] = useState('');
  const [reqLiveUrl, setReqLiveUrl] = useState('');
  const [reqLoading, setReqLoading] = useState(false);
  const [reqSuccess, setReqSuccess] = useState('');
  const [reqError, setReqError] = useState('');

  // Search & View Mode
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialView = searchParams.get('view') || (typeof window !== 'undefined' && window.innerWidth < 768 ? 'list' : 'grid');

  const [searchQuery, setSearchQueryState] = useState(initialQuery);
  const [view, setViewState] = useState(initialView);

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

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = p.title?.toLowerCase().includes(q);
    const descMatch = p.description?.toLowerCase().includes(q);
    const techMatch = Array.isArray(p.techStack) && p.techStack.some((t) => t.toLowerCase().includes(q));
    return titleMatch || descMatch || techMatch;
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.projects.getAll();
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const scrollToRequestForm = () => {
    requestSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Admin Actions
  const handleOpenAdd = () => {
    setSelectedProject(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProject = async (formData) => {
    if (selectedProject?._id) {
      await api.projects.update(selectedProject._id, formData);
    } else {
      await api.projects.create(formData);
    }
    await fetchProjects();
  };

  const handleDeleteProject = async () => {
    if (projectToDelete?._id) {
      await api.projects.delete(projectToDelete._id);
      await fetchProjects();
    }
  };

  // Submit User Project Request
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setReqLoading(true);
    setReqSuccess('');
    setReqError('');

    try {
      const res = await api.projects.requestProject({
        name: reqName,
        email: reqEmail,
        title: reqTitle,
        description: reqDescription,
        techStack: reqTechStack,
        sourceCode: reqSourceCode,
        liveUrl: reqLiveUrl,
      });

      if (res.success) {
        setReqSuccess(res.message || 'Project requested successfully!');
        setReqName('');
        setReqEmail('');
        setReqTitle('');
        setReqDescription('');
        setReqTechStack('');
        setReqSourceCode('');
        setReqLiveUrl('');
      }
    } catch (err) {
      setReqError(err.message || 'Failed to submit request');
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-20">
      {/* Hero Banner */}
      <div className="bg-slate-50/50 dark:bg-slate-900/40 py-20 border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-google-green/10 text-google-green border border-google-green/20 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <span>Community Showcase</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4"
          >
            Our <span className="text-google-green">Projects</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8"
          >
            Innovation in action. Discover groundbreaking projects crafted by the talented developers of GDG on Campus SATI Vidisha.
          </motion.p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Request Project Button */}
            <button
              onClick={scrollToRequestForm}
              className="px-6 py-3 rounded-2xl bg-google-green hover:bg-green-600 text-white font-bold text-sm shadow-lg shadow-google-green/25 hover:shadow-xl transition-all flex items-center gap-2"
            >
              <FaPaperPlane size={13} />
              <span>Request Your Project</span>
            </button>

            {/* Admin Add Project Button */}
            {isAdmin && (
              <button
                onClick={handleOpenAdd}
                className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <FaPlus size={13} />
                <span>Add Project</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container with Sticky Controls Bar and Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="sticky top-[88px] md:top-[96px] z-30 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md mb-8">
          <div className="relative w-full sm:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by title, description, or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-google-green text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
            </span>
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>

        {/* Projects Showcase (List or Grid) */}
        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
          view === 'list' ? (
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <ProjectListItem
                  key={project._id || project.title}
                  project={project}
                  isAdmin={isAdmin}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id || project.title}
                  project={project}
                  isAdmin={isAdmin}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
            <FaCode className="text-4xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No projects found matching your search.</p>
          </div>
        )}
        </div>
      </div>

      {/* Request Project Form Section */}
      <div
        id="request-project-section"
        ref={requestSectionRef}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8 md:p-10 bg-gradient-to-r from-google-green/10 via-emerald-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-google-green">
              Share Your Creation
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 mb-2">
              Request To Add Your Project
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Built something awesome? Fill out the form below to request your project to be featured on the official GDG on Campus platform. Our team will review and publish it!
            </p>
          </div>

          <form onSubmit={handleRequestSubmit} className="p-8 md:p-10 space-y-6">
            {reqSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 rounded-2xl text-sm flex items-center gap-3"
              >
                <FaCheckCircle className="text-lg shrink-0" />
                <span>{reqSuccess}</span>
              </motion.div>
            )}

            {reqError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl text-sm flex items-center gap-3"
              >
                <FaExclamationCircle className="text-lg shrink-0" />
                <span>{reqError}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  placeholder="e.g. Safal Tiwari"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-green text-sm text-slate-900 dark:text-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={reqEmail}
                  onChange={(e) => setReqEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-green text-sm text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={reqTitle}
                onChange={(e) => setReqTitle(e.target.value)}
                placeholder="e.g. AI-Powered Campus Assistant"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-green text-sm text-slate-900 dark:text-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Project Description *
              </label>
              <textarea
                rows="4"
                required
                value={reqDescription}
                onChange={(e) => setReqDescription(e.target.value)}
                placeholder="Describe what your project does, problem it solves, architecture, and impact..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-green text-sm text-slate-900 dark:text-white resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Tech Stack (comma separated) *
              </label>
              <input
                type="text"
                required
                value={reqTechStack}
                onChange={(e) => setReqTechStack(e.target.value)}
                placeholder="React, Node.js, Express, MongoDB, Tailwind, Python"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-green text-sm text-slate-900 dark:text-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Source Code / GitHub URL
                </label>
                <input
                  type="url"
                  value={reqSourceCode}
                  onChange={(e) => setReqSourceCode(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-green text-sm text-slate-900 dark:text-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Live Demo / Deployment URL
                </label>
                <input
                  type="url"
                  value={reqLiveUrl}
                  onChange={(e) => setReqLiveUrl(e.target.value)}
                  placeholder="https://myproject.vercel.app"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-google-green text-sm text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={reqLoading}
              className="w-full py-4 rounded-2xl bg-google-green hover:bg-green-600 text-white font-bold text-sm shadow-xl shadow-google-green/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaPaperPlane />
              <span>{reqLoading ? 'Submitting Request...' : 'Submit Project Request'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Admin Modals */}
      <ItemEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProject}
        item={selectedProject}
        type="project"
        title={selectedProject ? 'Edit Project' : 'Add New Project'}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"?`}
      />
    </div>
  );
};

export default Projects;
