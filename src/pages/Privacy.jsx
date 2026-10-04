import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaShieldAlt,
  FaUserLock,
  FaKey,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaEnvelope,
  FaArrowRight,
  FaGoogle,
  FaDatabase,
  FaCog,
  FaTrashAlt,
  FaServer,
  FaBell,
  FaLaptopCode,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaFileContract,
} from 'react-icons/fa';
import usePageSEO from '../hooks/usePageSEO';

const Privacy = () => {
  usePageSEO({
    title: 'Privacy Policy',
    description: 'Learn how GDG on Campus SATI Vidisha handles member accounts, data protection, privacy rights, and security standards.',
    path: '/privacy',
  });

  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: '1. Overview & Community Scope' },
    { id: 'collection', title: '2. Information We Collect' },
    { id: 'auth-security', title: '3. Authentication & Account Security' },
    { id: 'how-we-use', title: '4. How We Use Information' },
    { id: 'profile-privacy', title: '5. Profile Privacy & Visibility Controls' },
    { id: 'third-parties', title: '6. Third-Party Integrations & Cloud Services' },
    { id: 'cookies-storage', title: '7. Cookies & Local Storage' },
    { id: 'user-rights', title: '8. Your Rights & Data Deletion' },
    { id: 'security-measures', title: '9. Security Practices & Safeguards' },
    { id: 'contact', title: '10. Contact Us & Policy Updates' },
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Background Ambience Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-25">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-google-blue/15 rounded-full blur-3xl" />
        <div className="absolute top-96 right-10 w-96 h-96 bg-google-green/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-google-yellow/15 rounded-full blur-3xl" />
      </div>

      {/* Header Banner - Standardized across pages */}
      <div className="relative bg-slate-50/70 dark:bg-slate-900/40 pt-15 pb-14 border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-google-blue/10 text-google-blue border border-google-blue/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4"
          >
            <span>Legal & Trust</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4"
          >
            Privacy <span className="text-google-blue">Policy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Transparent guidelines protecting your data and privacy.
          </motion.p>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>Effective for all members & visitors</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center mb-3">
              <FaShieldAlt className="text-lg" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Zero Data Selling</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We never monetize, rent, or sell your personal data or email address to third-party advertisers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center mb-3">
              <FaLock className="text-lg" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Strong Encryption</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Passwords are salted and hashed with bcrypt, and sessions use secure cryptographically signed tokens.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-google-yellow/10 text-google-yellow flex items-center justify-center mb-3">
              <FaUserLock className="text-lg" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Granular Privacy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Easily make your profile private, conceal your email, or silence notifications via Settings.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-google-red/10 text-google-red flex items-center justify-center mb-3">
              <FaTrashAlt className="text-lg" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Full Data Control</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Request profile data updates or complete account deletion anytime with zero lock-in.
            </p>
          </div>
        </div>

        {/* Main Content Layout with Sidebar Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Navigation */}
          <div className="lg:col-span-4 sticky top-28 hidden lg:block">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-2">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeSection === sec.id
                      ? 'bg-google-blue/10 text-google-blue font-bold dark:bg-google-blue/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              {/* Direct Settings Link Banner */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white mb-1">
                    <FaCog className="text-google-blue" />
                    <span>Your Privacy Controls</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    Adjust your profile visibility, hide your email, or manage alerts right now.
                  </p>
                  <Link
                    to="/settings"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-google-blue hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Open Settings <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Text Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Section 1 */}
            <section id="overview" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Overview & Community Scope
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Google Developer Groups on Campus (GDGoC) at <strong>Samrat Ashok Technological Institute (SATI), Vidisha, Madhya Pradesh</strong> is an independent student developer community recognized under the global Google Developer Groups on Campus program.
                </p>
                <p>
                  This Privacy Policy applies to the official GDGoC SATI website, portals, RSVP systems, and related community applications (collectively referred to as the <em>"Platform"</em>). By registering an account, logging in, registering for workshops, submitting projects, or browsing our resources, you acknowledge and agree to the data collection and handling procedures described herein.
                </p>
                <p className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-google-blue text-xs text-slate-700 dark:text-slate-300">
                  <strong>Non-Commercial Notice:</strong> GDGoC SATI is a student-driven, non-commercial educational group. Our portal is hosted for educational networking, technical skill advancement, and chapter event administration.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="collection" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Information We Collect
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  To provide our features—such as user profiles, project submissions, and event check-ins—we collect the following categories of information:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2 mb-2">
                      <FaEnvelope className="text-google-blue" /> Account & Identity Data
                    </h3>
                    <ul className="text-xs space-y-1 text-slate-500 dark:text-slate-400 list-disc list-inside">
                      <li>Full Name and chosen Username</li>
                      <li>Email Address (verified via OTP or Google)</li>
                      <li>Password hash (for direct email registrations)</li>
                      <li>Google Account Profile (ID token, avatar, name)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2 mb-2">
                      <FaLaptopCode className="text-google-green" /> Profile & Developer Info
                    </h3>
                    <ul className="text-xs space-y-1 text-slate-500 dark:text-slate-400 list-disc list-inside">
                      <li>Bio, department, college year, or graduation</li>
                      <li>Technical skill tags & areas of interest</li>
                      <li>Social links: GitHub, LinkedIn, X, Portfolio</li>
                      <li>Uploaded profile photo / custom avatar</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2 mb-2">
                      <FaCalendarCheck className="text-google-yellow" /> Events & Attendance Data
                    </h3>
                    <ul className="text-xs space-y-1 text-slate-500 dark:text-slate-400 list-disc list-inside">
                      <li>Event registrations and RSVP statuses</li>
                      <li>Workshop check-in records & attendance logs</li>
                      <li>Feedback responses and hackathon submissions</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2 mb-2">
                      <FaServer className="text-google-red" /> Technical & Telemetry Logs
                    </h3>
                    <ul className="text-xs space-y-1 text-slate-500 dark:text-slate-400 list-disc list-inside">
                      <li>IP address (used strictly for rate limiting & security)</li>
                      <li>Browser user-agent, device type, and theme mode</li>
                      <li>Timestamps of account actions and OTP requests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="auth-security" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-yellow/10 text-google-yellow flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Authentication & Account Security
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  We prioritize modern, robust authentication workflows to protect user accounts from unauthorized access:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <FaGoogle className="text-google-blue mt-1 shrink-0 text-base" />
                    <div>
                      <strong className="text-slate-900 dark:text-white text-xs block">Google Identity Services (GSI) OAuth 2.0</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        When signing in with Google, credentials are authenticated directly by Google via client-side tokens and validated on our backend using official Google Auth libraries. We never see or store your Google password.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <FaKey className="text-google-green mt-1 shrink-0 text-base" />
                    <div>
                      <strong className="text-slate-900 dark:text-white text-xs block">Email One-Time Password (OTP) Verification</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        For passwordless logins and signup verification, temporary 6-digit cryptographic OTPs are dispatched to your inbox. OTPs are cryptographically hashed and automatically expire within 10 minutes to prevent replay attacks.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <FaLock className="text-google-red mt-1 shrink-0 text-base" />
                    <div>
                      <strong className="text-slate-900 dark:text-white text-xs block">Bcrypt Hashing & JSON Web Tokens (JWT)</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Passwords for standard accounts are one-way hashed with bcrypt (salt factor 10+) before storing in the database. Authenticated sessions use signed JSON Web Tokens (JWTs) with limited validity windows.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="how-we-use" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-red/10 text-google-red flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  How We Use Information
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Collected data is used strictly to power core community functionalities:</p>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-google-green mt-0.5 shrink-0" />
                    <span><strong>Event Administration:</strong> Processing RSVPs, maintaining capacity lists, generating admission QR codes, and confirming attendance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-google-green mt-0.5 shrink-0" />
                    <span><strong>Project & Community Showcase:</strong> Displaying member contributions, team affiliations, open-source repositories, and peer collaboration links.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-google-green mt-0.5 shrink-0" />
                    <span><strong>Transactional Communications:</strong> Sending OTP security codes, RSVP confirmations, event rescheduling notifications, and community broadcasts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-google-green mt-0.5 shrink-0" />
                    <span><strong>Security & Abuse Prevention:</strong> Detecting fraudulent logins, preventing automated spam on submission forms, and safeguarding student community data.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="profile-privacy" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center font-bold">
                  5
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Profile Privacy & Visibility Controls
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  We believe in member autonomy. Our platform features granular, self-serve privacy controls located directly in your <Link to="/settings" className="text-google-blue font-semibold hover:underline">Account Settings</Link>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-white">
                      <FaUserLock className="text-google-blue" />
                      <span>Private Profile</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      When enabled, your public profile page (<code className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">/profile/:username</code>) is concealed from public visitors and only visible to you and verified chapter admins.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-white">
                      <FaEyeSlash className="text-google-yellow" />
                      <span>Hide Email Address</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Keeps your registered email address hidden from other community members and public directories, even if your profile is otherwise public.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-white">
                      <FaBell className="text-google-green" />
                      <span>Email Preferences</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Opt out of non-critical email updates and announcements anytime, while retaining critical security OTPs and RSVP confirmations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="third-parties" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center font-bold">
                  6
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Third-Party Integrations & Cloud Services
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  We utilize reputable third-party infrastructure to deliver high-performance and secure community experiences:
                </p>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white">Google Identity Services:</strong> Provides official federated sign-in. Subject to Google's Privacy Policy and Security Guidelines.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white">Transactional Mail Delivery:</strong> Delivers verification OTPs and confirmation receipts securely via encrypted SMTP/API conduits.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white">Cloud Media Storage (Cloudinary/CDN):</strong> Used to host optimized avatars, workshop flyers, and project media.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="cookies-storage" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-yellow/10 text-google-yellow flex items-center justify-center font-bold">
                  7
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Cookies & Local Storage
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  We do <strong>not</strong> use tracking cookies or invasive third-party analytics pixels. We use browser <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">localStorage</code> strictly for functional website requirements:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <li><strong className="text-slate-800 dark:text-slate-200">token:</strong> Storing your encrypted session token to keep you logged in.</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">theme:</strong> Saving your preference for Light Mode or Dark Mode.</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">user:</strong> Caching profile identifiers for fast interface rendering.</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">gdg_privacy_*:</strong> Caching client-side privacy state for instant toggle updates.</li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You can clear your local storage at any time via your browser settings, which will log you out and reset display preferences.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="user-rights" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-red/10 text-google-red flex items-center justify-center font-bold">
                  8
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Your Rights & Data Deletion
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  In accordance with applicable privacy standards (including India's Digital Personal Data Protection Act - DPDPA), you possess the following rights regarding your data:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white block mb-1">Right to Access & Portability</strong>
                    <span>You can view and inspect all personal details attached to your profile anytime from your profile dashboard.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white block mb-1">Right to Rectification</strong>
                    <span>Easily edit your name, bio, social URLs, avatar, and interests via the Edit Profile modal.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white block mb-1">Right to Erasure (Account Deletion)</strong>
                    <span>Request complete account deletion and purge of all database records by contacting the organizers at <a href="mailto:satigdgoncampus@gmail.com" className="text-google-blue underline">satigdgoncampus@gmail.com</a>.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white block mb-1">Right to Withdraw Consent</strong>
                    <span>Opt out of communications or revoke Google OAuth permissions anytime via your Google Account Security dashboard.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="security-measures" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center font-bold">
                  9
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Security Practices & Safeguards
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  We implement robust engineering safeguards to protect student and developer data against loss, misuse, and unauthorized modification:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-google-blue shrink-0" />
                    <span><strong>HTTPS / TLS Encryption:</strong> All data in transit between your browser and our API servers is strongly encrypted via TLS 1.3.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-google-blue shrink-0" />
                    <span><strong>Rate Limiting & Anti-Bruteforce:</strong> Sensitive routes (OTP dispatch, login attempts, contact messages) are protected by IP and account rate limits.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-google-blue shrink-0" />
                    <span><strong>Input Sanitization:</strong> Form inputs are validated and sanitized to guard against Cross-Site Scripting (XSS) and NoSQL injection.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section id="contact" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center font-bold">
                  10
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Contact Us & Policy Updates
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  We may periodically revise this Privacy Policy to reflect platform updates, feature releases, or statutory amendments. Significant revisions will be highlighted on the website announcements and notifications tab.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2">Have questions about your privacy?</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Reach out directly to the GDGoC SATI core organizing team. We are happy to clarify any questions or assist with data requests.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="mailto:satigdgoncampus@gmail.com"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-google-blue text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                    >
                      <FaEnvelope /> Email Team: satigdgoncampus@gmail.com
                    </a>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Contact Form
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
