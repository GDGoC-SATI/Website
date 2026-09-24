import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLock,
  FaUsers,
  FaProjectDiagram,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaExternalLinkAlt,
  FaGithub,
  FaShieldAlt,
  FaArrowRight,
  FaFilter,
  FaClock,
  FaCheck,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaSync,
  FaSearch,
  FaBullhorn,
  FaPaperPlane,
} from 'react-icons/fa';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { TableSkeleton, AdminSkeleton } from '../components/common/Skeleton';
import { UserAvatar } from '../utils/avatarHelper';
import ViewToggle from '../components/common/ViewToggle';

const Admin = () => {
  const { user, isAdmin, isAuthenticated, loading: authLoading, login } = useAuth();
  const toast = useToast();
  const {
    broadcasts = [],
    sendBroadcastNotification,
    deleteBroadcastNotification,
  } = useNotifications();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Login Form State (when not logged in as admin)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data State - Persisted via URL query params
  const validTabs = ['requests', 'queries', 'users', 'broadcast'];
  const tabFromUrl = searchParams.get('tab');
  const initialTab = validTabs.includes(tabFromUrl) ? tabFromUrl : 'requests';

  const [activeTab, setActiveTabState] = useState(initialTab);

  // Sync tab from URL if user navigates back/forward
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && validTabs.includes(currentTab) && currentTab !== activeTab) {
      setActiveTabState(currentTab);
    }
  }, [searchParams]);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    });
  };

  const viewFromUrl = searchParams.get('view');
  const [view, setViewState] = useState(() => (viewFromUrl === 'list' || viewFromUrl === 'grid' ? viewFromUrl : typeof window !== 'undefined' && window.innerWidth < 768 ? 'list' : 'grid'));

  const setView = (v) => {
    setViewState(v);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('view', v);
      return next;
    }, { replace: true });
  };
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [queries, setQueries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Contact Query Filter
  const [queryFilter, setQueryFilter] = useState('all');

  // Search & Broadcast Notifications State
  const qFromUrl = searchParams.get('q') || '';
  const [searchQuery, setSearchQueryState] = useState(qFromUrl);

  const setSearchQuery = (q) => {
    setSearchQueryState(q);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (q) {
        next.set('q', q);
      } else {
        next.delete('q');
      }
      return next;
    }, { replace: true });
  };
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState('GDG Announcement');
  const [broadcastPriority, setBroadcastPriority] = useState('New');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSending, setBroadcastSending] = useState(false);

  const applyBroadcastTemplate = (templateType) => {
    switch (templateType) {
      case 'hackathon':
        setBroadcastTitle('Registrations Open: Annual GDG Hackathon 2026!');
        setBroadcastCategory('Event Update');
        setBroadcastPriority('Live');
        setBroadcastMessage('We are thrilled to announce that registrations are now open for the flagship Annual Hackathon. Form your team of up to 4 members, build solutions in AI/Web/Mobile, and win exciting prizes!');
        break;
      case 'workshop':
        setBroadcastTitle('Upcoming Hands-On Workshop: Deep Dive into Modern Cloud');
        setBroadcastCategory('Event Update');
        setBroadcastPriority('New');
        setBroadcastMessage('Join us this Saturday for a live, interactive coding workshop. Bring your laptops configured with Docker and Node.js. Limited seats available!');
        break;
      case 'project':
        setBroadcastTitle('Community Showcase: New Open Source Project Published');
        setBroadcastCategory('Project Showcase');
        setBroadcastPriority('Update');
        setBroadcastMessage('Check out the newly approved community project on our Projects page. You can contribute, submit PRs, and collaborate with fellow campus developers.');
        break;
      case 'maintenance':
        setBroadcastTitle('Scheduled System & Portal Maintenance');
        setBroadcastCategory('GDG Announcement');
        setBroadcastPriority('Important');
        setBroadcastMessage('The campus portal will undergo scheduled maintenance tonight between 2:00 AM - 4:00 AM. Services will resume smoothly right after.');
        break;
      default:
        break;
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast('Please provide both title and message for broadcast.');
      return;
    }
    try {
      setBroadcastSending(true);
      await sendBroadcastNotification({
        title: broadcastTitle,
        category: broadcastCategory,
        priority: broadcastPriority,
        message: broadcastMessage,
      });
      setBroadcastTitle('');
      setBroadcastMessage('');
      showToast('Broadcast published to all users successfully!');
    } catch (err) {
      showToast('Failed to publish broadcast: ' + err.message);
    } finally {
      setBroadcastSending(false);
    }
  };

  // Load Dashboard Data when Admin is authenticated
  const fetchDashboardData = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const [statsRes, requestsRes, queriesRes, usersRes] = await Promise.all([
        api.stats.getDashboardStats().catch(() => ({ success: false })),
        api.projects.getRequests().catch(() => ({ success: false })),
        api.contact.getAll().catch(() => ({ success: false })),
        api.stats.getUsers().catch(() => ({ success: false })),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (requestsRes.success) setRequests(requestsRes.data);
      if (queriesRes.success) setQueries(queriesRes.data);
      if (usersRes.success) setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (isAdmin) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAdmin, authLoading]);

  const showToast = (msg, type = 'success') => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
    if (type === 'error' || msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('error')) {
      toast.error(msg);
    } else if (msg.toLowerCase().includes('delete') || msg.toLowerCase().includes('reject')) {
      toast.info(msg);
    } else {
      toast.success(msg);
    }
  };

  const handleSyncDatabase = async () => {
    setActionLoading(true);
    await fetchDashboardData();
    setActionLoading(false);
    showToast('Database synced with latest records!');
  };

  const fillDefaultAdmin = () => {
    setEmail('gdgocsati@gmail.com');
    setPassword('Admin@GDG2024');
  };

  // Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role !== 'admin') {
          setLoginError('This account does not have admin privileges.');
        }
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  // Request Actions
  const handleApproveRequest = async (id) => {
    setActionLoading(true);
    try {
      const res = await api.projects.approveRequest(id);
      if (res.success) {
        showToast('Project request approved and published to website!');
        await fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (id) => {
    setActionLoading(true);
    try {
      const res = await api.projects.updateRequestStatus(id, 'rejected');
      if (res.success) {
        showToast('Project request status set to rejected');
        await fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Delete this project request?')) return;
    try {
      await api.projects.deleteRequest(id);
      showToast('Request deleted');
      await fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to delete request');
    }
  };

  // Query Actions
  const handleUpdateQueryStatus = async (id, status) => {
    try {
      const res = await api.contact.updateStatus(id, status);
      if (res.success) {
        showToast(`Query marked as ${status}`);
        await fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update query status');
    }
  };

  const handleDeleteQuery = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.contact.delete(id);
      showToast('Inquiry removed');
      await fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to delete inquiry');
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this user? This action cannot be undone.'
      )
    )
      return;
    try {
      const res = await api.stats.deleteUser(id);
      if (res.success) {
        showToast('User account deleted successfully');
        await fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete user');
    }
  };

  // IF AUTH SESSION IS STILL LOADING
  if (authLoading) {
    return <AdminSkeleton />;
  }

  // IF NOT ADMIN OR NOT LOGGED IN -> RENDER LOGIN SCREEN
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 text-center bg-gradient-to-b from-google-blue/10 dark:from-google-blue/20 to-transparent border-b border-slate-100 dark:border-slate-800">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-google-blue text-white mb-4 shadow-lg shadow-google-blue/30">
                <FaShieldAlt className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Portal</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Access the control center to manage content, requests, and data.
              </p>
            </div>

            <div className="p-8">
              {loginError && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <FaExclamationTriangle className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                >
                  {loginLoading ? 'Authenticating...' : 'Sign In as Admin'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ADMIN IS LOGGED IN -> RENDER FULL DASHBOARD
  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;
  const unreadQueriesCount = queries.filter((q) => q.status === 'unread').length;

  const qSearch = searchQuery.toLowerCase().trim();

  const filteredRequests = requests.filter((r) => {
    if (!qSearch) return true;
    return (
      r.title?.toLowerCase().includes(qSearch) ||
      r.name?.toLowerCase().includes(qSearch) ||
      r.email?.toLowerCase().includes(qSearch) ||
      (Array.isArray(r.techStack) && r.techStack.some((t) => t.toLowerCase().includes(qSearch)))
    );
  });

  const filteredQueries = queries.filter((item) => {
    if (queryFilter !== 'all' && item.status !== queryFilter) return false;
    if (!qSearch) return true;
    return (
      item.firstName?.toLowerCase().includes(qSearch) ||
      item.lastName?.toLowerCase().includes(qSearch) ||
      item.email?.toLowerCase().includes(qSearch) ||
      item.subject?.toLowerCase().includes(qSearch) ||
      item.message?.toLowerCase().includes(qSearch)
    );
  });

  const filteredUsers = users.filter((u) => {
    if (!qSearch) return true;
    return (
      u.name?.toLowerCase().includes(qSearch) ||
      u.username?.toLowerCase().includes(qSearch) ||
      u.email?.toLowerCase().includes(qSearch) ||
      u.role?.toLowerCase().includes(qSearch)
    );
  });

  const filteredBroadcasts = (broadcasts || []).filter((b) => {
    if (!qSearch) return true;
    return (
      b.title?.toLowerCase().includes(qSearch) ||
      b.message?.toLowerCase().includes(qSearch) ||
      b.category?.toLowerCase().includes(qSearch)
    );
  });

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 p-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2"
          >
            <FaCheck className="text-google-green" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Executive Header with Sync DB button */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-google-blue to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-md">
              <FaShieldAlt />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Admin Control Center
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Manage project requests, contact inquiries & registered users
              </p>
            </div>
          </div>

          {/* Sync DB Button */}
          <button
            onClick={handleSyncDatabase}
            disabled={actionLoading || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white transition-all text-xs font-bold shadow-md shadow-google-blue/20 disabled:opacity-50"
          >
            <FaSync className={actionLoading || loading ? 'animate-spin' : ''} />
            <span>Sync DB</span>
          </button>
        </div>

        {/* Metrics Overview Cards (Horizontal scroll on mobile as requested in Screenshot 2026-09-23 014029) */}
        <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 hide-scrollbar no-scrollbar snap-x snap-mandatory">
          {/* Registered Users */}
          <div
            onClick={() => setActiveTab('users')}
            className="shrink-0 w-[240px] sm:w-auto snap-start bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:border-google-blue/30 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-google-blue/10 text-google-blue flex items-center justify-center shrink-0">
              <FaUsers size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                Total Users
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {stats?.counts?.users ?? users.length}
              </h3>
            </div>
          </div>

          {/* Pending Project Requests */}
          <div
            onClick={() => setActiveTab('requests')}
            className={`shrink-0 w-[240px] sm:w-auto snap-start p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 ${
              pendingRequestsCount > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 hover:shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <FaProjectDiagram size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                Project Requests
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                {requests.length}
                {pendingRequestsCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                    {pendingRequestsCount} Pending
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* Contact Queries */}
          <div
            onClick={() => setActiveTab('queries')}
            className={`shrink-0 w-[240px] sm:w-auto snap-start p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 ${
              unreadQueriesCount > 0
                ? 'bg-google-blue/10 border-google-blue/30 text-google-blue hover:shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-google-red/10 text-google-red flex items-center justify-center shrink-0">
              <FaEnvelope size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                Inquiries
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                {queries.length}
                {unreadQueriesCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-google-blue text-white font-bold">
                    {unreadQueriesCount} New
                  </span>
                )}
              </h3>
            </div>
          </div>
        </div>

        {/* Sticky Control Center Header: Navigation Tabs + Search & View Switcher */}
        <div className="sticky top-[88px] md:top-[96px] z-30 mb-8 p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-3">
          {/* Row 1: Section Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar no-scrollbar py-0.5">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'bg-google-blue text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Project Addition Requests</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('queries')}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'queries'
                  ? 'bg-google-blue text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Contact Inquiries</span>
              {unreadQueriesCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                  {unreadQueriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-google-blue text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Registered Users ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'broadcast'
                  ? 'bg-google-blue text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FaBullhorn size={12} />
              <span>Broadcast Update</span>
            </button>
          </div>

          {/* Row 2: Search Bar & View Switcher */}
          <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder={
                  activeTab === 'requests'
                    ? 'Search project requests by title, submitter, tech stack...'
                    : activeTab === 'queries'
                    ? 'Search contact inquiries by name, email, subject...'
                    : activeTab === 'users'
                    ? 'Search registered users by name, username, email...'
                    : 'Search broadcast announcements...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 focus:outline-none focus:border-google-blue text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
              />
            </div>

            <div className="shrink-0">
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </div>

        {/* TAB 1: PROJECT ADDITION REQUESTS */}
        {activeTab === 'requests' && (
          <div>
            {loading ? (
              <TableSkeleton rows={4} />
            ) : filteredRequests.length > 0 ? (
              view === 'list' ? (
                <div className="space-y-3">
                  {filteredRequests.map((req) => (
                    <div
                      key={req._id}
                      className="relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group overflow-hidden"
                    >
                      {/* Delete Icon at Top Right End Inside Card */}
                      <button
                        onClick={() => handleDeleteRequest(req._id)}
                        className="absolute top-3.5 right-3.5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors z-10"
                        title="Delete Request"
                      >
                        <FaTrash size={12} />
                      </button>

                      <div className="min-w-0 flex-1 pr-10 sm:pr-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                            {req.title}
                          </h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'approved'
                                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                : req.status === 'rejected'
                                ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                          <span>
                            Submitted by <strong className="text-slate-700 dark:text-slate-300">{req.name}</strong>
                          </span>
                          <span>•</span>
                          <a href={`mailto:${req.email}`} className="text-google-blue hover:underline break-all">
                            {req.email}
                          </a>
                          <span>•</span>
                          <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap sm:mr-10">
                        {req.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveRequest(req._id)}
                            disabled={actionLoading}
                            className="px-3.5 py-1.5 rounded-xl bg-google-green hover:bg-green-600 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <FaCheckCircle size={11} /> Approve
                          </button>
                        )}
                        {req.status !== 'rejected' && (
                          <button
                            onClick={() => handleRejectRequest(req._id)}
                            disabled={actionLoading}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredRequests.map((req) => (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 pr-12 sm:pr-14"
                    >
                      {/* Top-Right Delete Action Button */}
                      <button
                        onClick={() => handleDeleteRequest(req._id)}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete Request"
                      >
                        <FaTrash size={13} />
                      </button>

                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {req.title}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'approved'
                                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                : req.status === 'rejected'
                                ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Submitted by{' '}
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {req.name}
                          </span>{' '}
                          •{' '}
                          <a
                            href={`mailto:${req.email}`}
                            className="text-google-blue hover:underline"
                          >
                            {req.email}
                          </a>{' '}
                          • {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {req.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveRequest(req._id)}
                            disabled={actionLoading}
                            className="px-4 py-2 rounded-xl bg-google-green hover:bg-green-600 text-white text-xs font-bold shadow-md shadow-google-green/20 transition-all flex items-center gap-1.5"
                          >
                            <FaCheckCircle /> Approve & Publish
                          </button>
                        )}
                        {req.status !== 'rejected' && (
                          <button
                            onClick={() => handleRejectRequest(req._id)}
                            disabled={actionLoading}
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {req.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(req.techStack) &&
                          req.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>

                      <div className="flex items-center gap-3">
                        {req.sourceCode && (
                          <a
                            href={req.sourceCode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-google-blue"
                          >
                            <FaGithub /> Source Code
                          </a>
                        )}
                        {req.liveUrl && (
                          <a
                            href={req.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-google-blue hover:underline"
                          >
                            <FaExternalLinkAlt size={11} /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
              <FaProjectDiagram className="text-4xl text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No project addition requests yet.</p>
            </div>
          )}
          </div>
        )}

        {/* TAB 2: CONTACT INQUIRIES */}
        {activeTab === 'queries' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                {['all', 'unread', 'read', 'replied'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setQueryFilter(f)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      queryFilter === f
                        ? 'bg-google-blue text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <TableSkeleton rows={4} />
            ) : filteredQueries.length > 0 ? (
              view === 'list' ? (
                <div className="space-y-3">
                  {filteredQueries.map((q) => (
                    <div
                      key={q._id}
                      className="relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 overflow-hidden group"
                    >
                      {/* Delete Icon at Top Right End Inside Card */}
                      <button
                        onClick={() => handleDeleteQuery(q._id)}
                        className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors z-10"
                        title="Delete Query"
                      >
                        <FaTrash size={12} />
                      </button>

                      <div className="min-w-0 flex-1 pr-10 sm:pr-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {q.firstName} {q.lastName}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {q.subject}
                          </span>
                          {q.status === 'unread' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-google-blue text-white">
                              Unread
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {q.message}
                        </p>
                      </div>

                      {/* Action buttons (Mark read / Reply) */}
                      {(q.status === 'unread' || q.status !== 'replied') && (
                        <div className="flex items-center gap-2 shrink-0 sm:mr-10 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto">
                          {q.status === 'unread' && (
                            <button
                              onClick={() => handleUpdateQueryStatus(q._id, 'read')}
                              className="px-2.5 py-1 text-xs font-semibold bg-google-blue/10 text-google-blue hover:bg-google-blue hover:text-white rounded-lg transition-colors"
                            >
                              Mark Read
                            </button>
                          )}
                          {q.status !== 'replied' && (
                            <a
                              href={`mailto:${q.email}?subject=Re: ${encodeURIComponent(
                                q.subject
                              )} - GDG SATI`}
                              onClick={() => handleUpdateQueryStatus(q._id, 'replied')}
                              className="px-2.5 py-1 text-xs font-semibold bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                            >
                              <FaEnvelope size={10} /> Reply
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQueries.map((q) => (
                    <div
                      key={q._id}
                      className={`relative p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                        q.status === 'unread'
                          ? 'border-google-blue/40 shadow-md shadow-google-blue/5'
                          : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {/* Delete Icon at Top Right End Inside Card */}
                      <button
                        onClick={() => handleDeleteQuery(q._id)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors z-10"
                        title="Delete Query"
                      >
                        <FaTrash size={12} />
                      </button>

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3 pr-10 sm:pr-10">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-base text-slate-900 dark:text-white">
                              {q.firstName} {q.lastName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {q.subject}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            <a
                              href={`mailto:${q.email}`}
                              className="text-google-blue hover:underline"
                            >
                              {q.email}
                            </a>{' '}
                            • {new Date(q.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {q.status === 'unread' && (
                            <button
                              onClick={() => handleUpdateQueryStatus(q._id, 'read')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-google-blue/10 text-google-blue hover:bg-google-blue hover:text-white transition-colors"
                            >
                              Mark Read
                            </button>
                          )}
                          {q.status !== 'replied' && (
                            <a
                              href={`mailto:${q.email}?subject=Re: ${encodeURIComponent(
                                q.subject
                              )} - GDG SATI`}
                              onClick={() => handleUpdateQueryStatus(q._id, 'replied')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white transition-colors flex items-center gap-1"
                            >
                              <FaEnvelope size={10} /> Reply via Email
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl whitespace-pre-wrap">
                        {q.message}
                      </p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
                <FaEnvelope className="text-4xl text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No contact inquiries found.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REGISTERED USERS */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Registered Accounts ({users.length})
            </h3>

            {loading ? (
              <TableSkeleton rows={5} />
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <UserAvatar user={u} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {u.name}
                          </p>
                          <p className="text-xs text-google-blue truncate">@{u.username || 'user'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3">{u.email}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-google-red/10 text-google-red border border-google-red/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {u.role}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          title={`View @${u.username}'s Profile`}
                          onClick={() => navigate(`/profile/${u.username || u._id}`)}
                          className="px-2.5 py-1 rounded-lg bg-google-blue/10 hover:bg-google-blue text-google-blue hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                        >
                          <FaEye size={11} /> Profile
                        </button>
                        <button
                          title="Delete User"
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto hide-scrollbar no-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold">Username</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Joined Date</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={u} size="sm" />
                            <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-500">@{u.username || 'user'}</td>
                        <td className="py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-google-red/10 text-google-red border border-google-red/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              title={`View @${u.username}'s Profile`}
                              onClick={() => navigate(`/profile/${u.username || u._id}`)}
                              className="px-2.5 py-1.5 rounded-lg bg-google-blue/10 hover:bg-google-blue text-google-blue hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                            >
                              <FaEye size={12} />
                              <span className="hidden sm:inline">Profile</span>
                            </button>
                            <button
                              title="Delete User"
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BROADCAST MESSAGE / NOTIFICATIONS */}
        {activeTab === 'broadcast' && (
          <div className="space-y-8">
            {/* Broadcast Composer */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-google-blue/10 text-google-blue flex items-center justify-center text-xl">
                  <FaBullhorn />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Broadcast Update to All Users
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Publish updates that will appear in real-time on all community members' notification page.
                  </p>
                </div>
              </div>

              {/* Quick Template Buttons */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Quick Templates:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyBroadcastTemplate('hackathon')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-google-blue/10 hover:bg-google-blue/20 text-google-blue transition-colors"
                  >
                    🏆 Hackathon Launch
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBroadcastTemplate('workshop')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-google-yellow/10 hover:bg-google-yellow/20 text-amber-600 dark:text-amber-400 transition-colors"
                  >
                    💡 Workshop Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBroadcastTemplate('project')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-google-green/10 hover:bg-google-green/20 text-google-green transition-colors"
                  >
                    🚀 Project Showcase
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBroadcastTemplate('maintenance')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-colors"
                  >
                    ⚙️ Portal Maintenance
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Announcement Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Registrations open for Spring Hackathon 2026"
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <select
                      value={broadcastCategory}
                      onChange={(e) => setBroadcastCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-google-blue font-semibold"
                    >
                      <option value="GDG Announcement">GDG Announcement</option>
                      <option value="Event Update">Event Update</option>
                      <option value="Project Showcase">Project Showcase</option>
                      <option value="Community Alert">Community Alert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Broadcast Message Body *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write detailed announcements, schedule links, or instructions here. This message will be delivered to all members..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full p-4 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-google-blue leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={broadcastSending}
                    className="px-6 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-google-blue/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaPaperPlane size={13} />
                    <span>{broadcastSending ? 'Publishing...' : 'Send Broadcast to All Users'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Broadcast History */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Broadcast History ({filteredBroadcasts.length})
              </h4>

              {filteredBroadcasts.length === 0 ? (
                <p className="text-xs text-slate-400">No broadcast announcements published yet.</p>
              ) : (
                <div className="space-y-3">
                  {filteredBroadcasts.map((b) => (
                    <div
                      key={b.id}
                      className="relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden"
                    >
                      {/* Delete Icon at Top Right End Inside Card */}
                      <button
                        onClick={() => deleteBroadcastNotification(b.id)}
                        className="absolute top-3.5 right-3.5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors shrink-0 z-10"
                        title="Delete broadcast for all"
                      >
                        <FaTrash size={12} />
                      </button>

                      <div className="min-w-0 flex-1 pr-10 sm:pr-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {b.title}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-google-blue/10 text-google-blue">
                            {b.category}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {b.date || 'Today'} • {b.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {b.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
