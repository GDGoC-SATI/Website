import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
  FaArrowRight,
  FaBell,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { UserAvatar } from '../utils/avatarHelper';
import NotificationsDropdown from './common/NotificationsDropdown';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileNotifOpen, setIsMobileNotifOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const profileDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);

  // Theme Toggle Logic
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsEventsOpen(false);
    setIsProfileMenuOpen(false);
    setIsMobileProfileOpen(false);
    setIsNotifOpen(false);
    setIsMobileNotifOpen(false);
  }, [location]);

  // Click outside to close profile dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileProfileDropdownRef.current && !mobileProfileDropdownRef.current.contains(e.target)) {
        setIsMobileProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div
        className={`transition-all duration-500 ease-in-out pointer-events-auto ${
          isScrolled
            ? 'w-[90%] max-w-[64rem] mt-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-lg border border-white/20 dark:border-slate-700/50 rounded-full py-2 px-6'
            : 'w-full max-w-7xl py-5 px-4 sm:px-6 lg:px-8 bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center w-full">
          {/* Exact Original Logo Section */}
          <Link
            to="/"
            className={`relative flex items-center h-10 transition-all duration-500 ease-in-out group ${
              isScrolled ? 'w-10' : 'w-32 md:w-48'
            }`}
          >
            {/* Title Image (Full) - Visible when NOT scrolled */}
            <img
              src={theme === 'dark' ? '/assets/GDG_title_white.png' : '/assets/GDG_title_black.png'}
              alt="GDG on Campus"
              className={`absolute right-10 h-full w-auto object-contain transition-all duration-500 ease-out origin-left ${
                isScrolled ? 'opacity-0 scale-90' : 'opacity-100 scale-200 md:scale-200'
              }`}
            />

            {/* Icon Image (Symbol) - Visible when scrolled */}
            <img
              src="/assets/GDG_icon.png"
              alt="GDG Icon"
              className={`absolute left-0 h-full w-auto object-contain transition-all duration-500 ease-out origin-left ${
                isScrolled
                  ? 'opacity-100 scale-100 rotate-0'
                  : 'opacity-0 scale-90 -rotate-12 translate-x-2'
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors relative ${
                  location.pathname === link.path
                    ? 'text-google-blue'
                    : 'text-slate-700 dark:text-slate-200 hover:text-google-blue dark:hover:text-google-blue'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-1 left-3 right-3 h-0.5 bg-google-blue rounded-full"
                  />
                )}
              </Link>
            ))}

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <FaMoon /> : <FaSun className="text-google-yellow" />}
            </button>

            {/* Notification Bell (Desktop) */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                aria-label="Notifications"
              >
                <FaBell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-google-red ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>
              <NotificationsDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>

            {/* User Profile Menu or Get Started Button */}
            {isAuthenticated && user ? (
              <div className="relative ml-2" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-google-blue dark:hover:border-google-blue  transition-all "
                >
                  <UserAvatar user={user} size="sm" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <FaChevronDown
                    size={10}
                    className={`text-slate-400 transition-transform ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Desktop Profile Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-google-blue truncate">
                              @{user.username || user.email.split('@')[0]}
                            </p>
                          </div>
                        </div>
                        {isAdmin && (
                          <span className="mt-1.5 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-google-red/10 text-google-red border border-google-red/20 uppercase">
                            Admin
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                       {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-google-blue hover:bg-google-blue/5 dark:hover:bg-google-blue/10 flex items-center gap-2.5 transition-colors"
                          >
                            <FaShieldAlt size={11} /> Admin Panel
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-google-blue flex items-center gap-2.5 transition-colors"
                        >
                          <FaUser className="text-slate-400" size={11} /> Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-google-blue flex items-center gap-2.5 transition-colors"
                        >
                          <FaCog className="text-slate-400" size={11} /> Settings
                        </Link>

                       
                      </div>

                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors"
                      >
                        <FaSignOutAlt size={11} /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/signup"
                className="ml-2 px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Controls */}
          {/* Notice: Profile Menu is placed directly on the LEFT SIDE of navbar toggle button */}
          <div className="md:hidden flex items-center gap-3 relative z-50">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300">
              {theme === 'light' ? <FaMoon /> : <FaSun className="text-google-yellow" />}
            </button>

            {/* Notification Bell (Mobile) */}
            <div className="relative">
              <button
                onClick={() => setIsMobileNotifOpen(!isMobileNotifOpen)}
                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
                aria-label="Notifications"
              >
                <FaBell size={14} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-google-red ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
              <NotificationsDropdown isOpen={isMobileNotifOpen} onClose={() => setIsMobileNotifOpen(false)} />
            </div>

            {/* Profile Menu ON THE LEFT SIDE OF NAVBAR TOGGLE BUTTON */}
            {isAuthenticated && user ? (
              <div className="relative" ref={mobileProfileDropdownRef}>
                <button
                  onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                  className="flex items-center p-0.5 rounded-full ring-2 ring-transparent hover:ring-google-blue/50 focus:ring-google-blue transition-all"
                  aria-label="Open Profile Menu"
                >
                  <UserAvatar user={user} size="xs" />
                </button>

                {/* Mobile Profile Dropdown */}
                <AnimatePresence>
                  {isMobileProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-3 z-[500] overflow-hidden"
                    >
                      <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                        <p className="text-m font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[12px] text-google-blue truncate">
                          @{user.username || user.email.split('@')[0]}
                        </p>
                        {isAdmin && (
                          <span className="mt-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-google-red/10 text-google-red border border-google-red/20 uppercase">
                            Admin
                          </span>
                        )}
                      </div>

                      <div className="py-1 text-m">
                       
                         {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsMobileProfileOpen(false)}
                            className="w-full text-left px-3.5 py-2 text-google-blue font-bold hover:bg-google-blue/5 flex items-center gap-2"
                          >
                            <FaShieldAlt size={11} /> Admin Panel
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setIsMobileProfileOpen(false)}
                          className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <FaUser className="text-slate-400" size={11} /> Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsMobileProfileOpen(false)}
                          className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <FaCog className="text-slate-400" size={11} /> Settings
                        </Link>
                      
                      </div>

                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                      <button
                        onClick={() => {
                          setIsMobileProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-3.5 py-2 text-m text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-medium"
                      >
                        <FaSignOutAlt size={11} /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/signup"
                className="px-2.5 py-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold"
              >
                Get Started
              </Link>
            )}

            {/* Navbar Toggle Button (Hamburger) */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsMobileProfileOpen(false);
              }}
              className="text-slate-700 dark:text-slate-200 text-2xl"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl pointer-events-auto ${
              isScrolled ? 'rounded-3xl mx-4 mt-2' : ''
            }`}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-google-blue/10 text-google-blue'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
