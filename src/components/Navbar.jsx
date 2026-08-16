import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEventsOpen, setIsEventsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

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

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsEventsOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        {
            name: 'Events',
            path: '/events',
        },
        // { name: 'Gallery', path: '/gallery' },
        { name: 'Projects', path: '/projects' },
        { name: 'Team', path: '/team' },
        // { name: 'Alumni', path: '/alumni' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleEventClick = (path) => {
        navigate(path);
        setIsEventsOpen(false);
    };

    return (
        <nav
            className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none"
        >
            <div
                className={`transition-all duration-500 ease-in-out pointer-events-auto ${isScrolled
                    ? 'w-[90%] max-w-[60rem] mt-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-lg border border-white/20 dark:border-slate-700/50 rounded-full py-2 px-6'
                    : 'w-full max-w-7xl py-5 px-4 sm:px-6 lg:px-8 bg-transparent'
                    }`}
            >
                <div className="flex justify-between items-center w-full">

                    {/* Logo Section */}
                    <Link to="/" className={`relative flex items-center h-10 transition-all duration-500 ease-in-out group ${isScrolled ? 'w-10' : 'w-32 md:w-48'}`}>
                        {/* Title Image (Full) - Visible when NOT scrolled */}
                        <img
                            src={theme === 'dark' ? "/assets/GDG_title_white.png" : "/assets/GDG_title_black.png"}
                            alt="GDG on Campus"
                            className={`absolute right-10 h-full w-auto object-contain transition-all duration-500 ease-out origin-left ${isScrolled
                                ? 'opacity-0 scale-90'
                                : 'opacity-100 scale-200 md:scale-200'
                                }`}
                        />

                        {/* Icon Image (Symbol) - Visible when scrolled */}
                        <img
                            src="/assets/GDG_icon.png"
                            alt="GDG Icon"
                            className={`absolute left-0 h-full w-auto object-contain transition-all duration-500 ease-out origin-left ${isScrolled
                                ? 'opacity-100 scale-100 rotate-0'
                                : 'opacity-0 scale-90 -rotate-12 translate-x-2'
                                }`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group/dropdown">
                                {link.isDropdown ? (
                                    <button
                                        className="px-3 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-google-blue dark:hover:text-google-blue transition-colors flex items-center gap-1"
                                        onClick={() => setIsEventsOpen(!isEventsOpen)}
                                        onMouseEnter={() => setIsEventsOpen(true)}
                                    >
                                        {link.name}
                                        <FaChevronDown className={`text-xs transition-transform ${isEventsOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors relative
                      ${location.pathname === link.path ? 'text-google-blue' : 'text-slate-700 dark:text-slate-200 hover:text-google-blue dark:hover:text-google-blue'}
                    `}
                                    >
                                        {link.name}
                                        {location.pathname === link.path && (
                                            <motion.div
                                                layoutId="underline"
                                                className="absolute bottom-1 left-3 right-3 h-0.5 bg-google-blue rounded-full"
                                            />
                                        )}
                                    </Link>
                                )}

                                {/* Desktop Dropdown */}
                                {link.isDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, pointerEvents: 'none' }}
                                        animate={isEventsOpen ? { opacity: 1, y: 0, pointerEvents: 'auto' } : { opacity: 0, y: 10, pointerEvents: 'none' }}
                                        className="absolute top-full left-0 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 mt-4"
                                        onMouseLeave={() => setIsEventsOpen(false)}
                                    >
                                        {link.items.map((item) => (
                                            <button
                                                key={item.name}
                                                onClick={() => handleEventClick(item.path)}
                                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-google-blue transition-colors first:rounded-t-xl"
                                            >
                                                Events {item.name}
                                            </button>
                                        ))}
                                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                        <Link to="/events" className="block w-full text-left px-4 py-2 text-sm font-semibold text-google-blue hover:bg-slate-50 dark:hover:bg-slate-700 last:rounded-b-xl">
                                            View All Events
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
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

                        {/* Admin Button */}
                        <Link
                            to="/admin"
                            className="ml-2 px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
                        >
                            Admin
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4 relative z-50">
                        <button
                            onClick={toggleTheme}
                            className="text-slate-600 dark:text-slate-300"
                        >
                            {theme === 'light' ? <FaMoon /> : <FaSun className="text-google-yellow" />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-700 dark:text-slate-200 text-2xl"
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Adjusted for Scrolled State */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl pointer-events-auto ${isScrolled ? 'rounded-3xl mx-4 mt-2' : ''}`}
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    {link.isDropdown ? (
                                        <div>
                                            <button
                                                onClick={() => setIsEventsOpen(!isEventsOpen)}
                                                className="w-full text-left px-3 py-3 text-base font-medium text-slate-700 dark:text-slate-200 flex justify-between items-center"
                                            >
                                                {link.name}
                                                <FaChevronDown className={`text-xs transition-transform ${isEventsOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {isEventsOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden ml-3"
                                                    >
                                                        {link.items.map((item) => (
                                                            <button
                                                                key={item.name}
                                                                onClick={() => handleEventClick(item.path)}
                                                                className="block w-full text-left px-4 py-3 text-sm text-slate-600 dark:text-slate-300 border-l-2 border-transparent hover:border-google-blue hover:text-google-blue"
                                                            >
                                                                Events {item.name}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            to={link.path}
                                            className={`block px-3 py-3 rounded-md text-base font-medium 
                        ${location.pathname === link.path
                                                    ? 'bg-google-blue/10 text-google-blue'
                                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    to="/admin"
                                    className="block w-full text-center px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium"
                                >
                                    Admin Login
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
