import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFileContract,
  FaUsers,
  FaCalendarAlt,
  FaLaptopCode,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaGavel,
  FaBan,
  FaEnvelope,
  FaArrowRight,
  FaRegLightbulb,
} from 'react-icons/fa';
import usePageSEO from '../hooks/usePageSEO';

const Terms = () => {
  usePageSEO({
    title: 'Terms of Service',
    description: 'Read the terms of service, participation guidelines, and community expectations for GDG on Campus SATI Vidisha.',
    path: '/terms',
  });

  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms & Eligibility' },
    { id: 'affiliation', title: '2. Community Nature & Google Affiliation' },
    { id: 'accounts', title: '3. Accounts, Authentication & Security' },
    { id: 'conduct', title: '4. Code of Conduct & Inclusivity' },
    { id: 'events-rsvp', title: '5. Events, Workshops & RSVP Policy' },
    { id: 'projects-ip', title: '6. Projects Showcase & Intellectual Property' },
    { id: 'prohibited', title: '7. Prohibited Uses & System Integrity' },
    { id: 'roles-moderation', title: '8. Leadership Roles & Content Moderation' },
    { id: 'disclaimer', title: '9. Disclaimers & Limitation of Liability' },
    { id: 'termination', title: '10. Account Termination & Closure' },
    { id: 'governing-law', title: '11. Governing Law & Dispute Resolution' },
    { id: 'contact', title: '12. Updates & Inquiries' },
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
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-google-yellow/15 rounded-full blur-3xl" />
        <div className="absolute top-96 left-10 w-96 h-96 bg-google-red/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-google-blue/15 rounded-full blur-3xl" />
      </div>

      {/* Header Banner - Standardized across pages */}
      <div className="relative bg-slate-50/70 dark:bg-slate-900/40 pt-15 pb-14 border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-google-green/10 text-google-green border border-google-green/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4"
          >
            <span>Agreement</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4"
          >
            Terms of <span className="text-google-green">Service</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Rules and guidelines for our community platform.
          </motion.p>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>Applies to all registered members & visitors</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center mb-3">
              <FaUsers className="text-lg" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Inclusive Community</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We uphold the Google Developer Groups Code of Conduct to ensure a safe, welcoming space for everyone.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center mb-3">
              <FaLaptopCode className="text-lg" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Your Code, Your IP</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You retain 100% intellectual property ownership of all projects, repositories, and materials you submit.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-google-yellow/10 text-google-yellow flex items-center justify-center mb-3">
              <FaCalendarAlt className="text-lg" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Responsible RSVPs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Fair seat allocation for workshops, hackathons, and speaker talks—cancel in advance if you cannot attend.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-google-red/10 text-google-red flex items-center justify-center mb-3">
              <FaShieldAlt className="text-lg" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Safe & Non-Profit</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              An educational student organization operated to foster peer technical skills and open collaboration.
            </p>
          </div>
        </div>

        {/* Main Content Layout with Sidebar Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Navigation */}
          <div className="lg:col-span-4 sticky top-28 hidden lg:block">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-2">
                Sections
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeSection === sec.id
                      ? 'bg-google-green/10 text-google-green font-bold dark:bg-google-green/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              {/* Related Policies Banner */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white mb-1">
                    <FaShieldAlt className="text-google-green" />
                    <span>Privacy Policy</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    Learn how we safeguard your personal data, credentials, and profile settings.
                  </p>
                  <Link
                    to="/privacy"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-xs font-medium transition-colors"
                  >
                    View Privacy Policy <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Text Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Section 1 */}
            <section id="acceptance" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Acceptance of Terms & Eligibility
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  By creating an account, authenticating via Google or Email OTP, registering for events, or browsing this website, you agree to be bound by these Terms of Service, our <Link to="/privacy" className="text-google-blue underline">Privacy Policy</Link>, and the Google Developer Groups Community Guidelines.
                </p>
                <p>
                  <strong>Eligibility:</strong> Membership is primarily open to undergraduate and postgraduate students, alumni, faculty of Samrat Ashok Technological Institute (SATI), Vidisha, as well as developers, designers, and tech enthusiasts across the broader ecosystem who wish to learn and contribute in good faith.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="affiliation" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Community Nature & Google Affiliation
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>Independent Student Organization:</strong> Google Developer Groups on Campus at SATI is an independent student group operated by student organizers and community leads. Activities, opinions, and projects expressed on this platform do not necessarily represent the official views or commercial commitments of Google LLC or Samrat Ashok Technological Institute.
                </p>
                <p className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-google-yellow text-xs text-slate-700 dark:text-slate-300">
                  <strong>Trademarks Notice:</strong> "Google", "Google Developer Groups", "GDG", and the associated logos are trademarks of Google LLC. They are used here in accordance with the community branding guidelines for official GDG on Campus chapters.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="accounts" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-yellow/10 text-google-yellow flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Accounts, Authentication & Security
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  To unlock interactive features such as submitting projects, participating in discussions, and RSVPing for workshops, you must maintain an authenticated account:
                </p>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-google-green mt-0.5 shrink-0" />
                    <span><strong>Accurate Information:</strong> You agree to provide true and accurate name and email information. Impersonating other students, organizers, or faculty is strictly prohibited.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-google-green mt-0.5 shrink-0" />
                    <span><strong>Account Security:</strong> You are responsible for safeguarding your login credentials. You must never share verification OTPs or session tokens with any third party.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-google-green mt-0.5 shrink-0" />
                    <span><strong>Single Identity:</strong> Users are requested to maintain one primary account to ensure fair seat allocation for limited-capacity workshops.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="conduct" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-red/10 text-google-red flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Code of Conduct & Inclusivity
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  GDGoC SATI is dedicated to providing a harassment-free community experience for everyone regardless of gender, sexual orientation, disability, physical appearance, race, or religion.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <p className="font-semibold text-slate-900 dark:text-white">All participants must adhere to:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                    <li>Be respectful, welcoming, and collaborative in all verbal and digital interactions.</li>
                    <li>Avoid disparaging remarks, discriminatory language, or trolling during sessions or in forums.</li>
                    <li>Respect the time and effort of student speakers, workshop mentors, and volunteer leads.</li>
                    <li>Report any instances of harassment immediately to chapter leads or faculty coordinators.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="events-rsvp" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center font-bold">
                  5
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Events, Workshops & RSVP Policy
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Our events are organized to empower students with hands-on technical skills in AI/ML, Cloud, Web, Android, and Open Source:
                </p>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white">Fair RSVP Policy:</strong> Because workshop seating, compute labs, and food refreshments are finite, please only RSVP if you genuinely plan to attend. Repeated no-shows may result in deprioritization for future high-demand events.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white">Check-in Verification:</strong> Attendance for workshops and certificate eligibility requires checking in via physical QR scanners or the designated check-in desk at SATI campus venues.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white">Media & Photography Release:</strong> Photos, video recordings, and screenshots captured during GDGoC events may be used in chapter social media highlights, community reels, and university reports. If you prefer not to be featured, notify the media team at the event.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="projects-ip" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center font-bold">
                  6
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Projects Showcase & Intellectual Property
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Our <Link to="/projects" className="text-google-blue underline">Projects portal</Link> allows members to display repositories, prototypes, and applications built independently or during hackathons:
                </p>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white block mb-1">You Own Your Code:</strong>
                    <span>You retain complete copyright and ownership over all software, designs, algorithms, and documentation you submit to the platform.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white block mb-1">Showcase License:</strong>
                    <span>By listing a project, you grant GDGoC SATI a non-exclusive, royalty-free license to display your project description, screenshots, repository link, and team names on our website and event presentations for promotional and educational purposes.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white block mb-1">Originality & Open Source:</strong>
                    <span>You represent that submitted projects do not violate any third-party intellectual property or copyright, and adhere to their respective open-source licenses (MIT, Apache, GPL, etc.).</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="prohibited" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-red/10 text-google-red flex items-center justify-center font-bold">
                  7
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Prohibited Uses & System Integrity
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  You agree to use our website and APIs in good faith. You must <strong>not</strong> engage in any of the following activities:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
                    <FaBan className="mb-1 text-sm" />
                    <strong>No Automated Scraping:</strong> Scraping attendee rosters, email addresses, or database entries via automated spiders or crawlers.
                  </div>
                  <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
                    <FaBan className="mb-1 text-sm" />
                    <strong>No Denial-of-Service:</strong> Flooding OTP endpoints, registration forms, or contact channels to impair server availability.
                  </div>
                  <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
                    <FaBan className="mb-1 text-sm" />
                    <strong>No Malicious Payloads:</strong> Submitting malicious links, phishing URLs, malware, or exploiting cross-site scripting flaws.
                  </div>
                  <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
                    <FaBan className="mb-1 text-sm" />
                    <strong>No Credential Stuffing:</strong> Attempting to guess other member passwords or bypass JWT authentication gates.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="roles-moderation" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-yellow/10 text-google-yellow flex items-center justify-center font-bold">
                  8
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Leadership Roles & Content Moderation
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  GDGoC SATI chapter leads, faculty advisors, and system administrators maintain administrative tools to ensure community safety. We reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <li>Review, approve, or reject community project submissions that do not meet guidelines.</li>
                  <li>Moderate or redact offensive, abusive, or copyright-infringing content from public profiles.</li>
                  <li>Adjust event registration capacities, venue details, or agendas due to campus logistics.</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section id="disclaimer" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center font-bold">
                  9
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Disclaimers & Limitation of Liability
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  The platform, code snippets, workshop material, and community services are provided on an <strong>"AS-IS"</strong> and <strong>"AS-AVAILABLE"</strong> basis without warranties of any kind.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  To the maximum extent permitted by law, GDGoC SATI organizers, student leads, and Samrat Ashok Technological Institute shall not be liable for any indirect, incidental, or consequential damages resulting from platform downtime, loss of submitted code, or interactions between members.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="termination" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-green/10 text-google-green flex items-center justify-center font-bold">
                  10
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Account Termination & Closure
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>Voluntary Closure:</strong> You may request deletion of your account and purge of your data at any time by contacting our organizing team at <a href="mailto:satigdgoncampus@gmail.com" className="text-google-blue underline">satigdgoncampus@gmail.com</a>.
                </p>
                <p>
                  <strong>Disciplinary Suspension:</strong> Chapter leads reserve the right to suspend or permanently terminate access for individuals found guilty of severe Code of Conduct violations, cheating during hackathons, or system sabotage.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="governing-law" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-yellow/10 text-google-yellow flex items-center justify-center font-bold">
                  11
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Governing Law & Dispute Resolution
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  These Terms of Service and any matters arising out of your participation in GDGoC SATI shall be governed by and construed in accordance with the laws of <strong>India</strong>, under the institutional guidelines of Samrat Ashok Technological Institute and the competent jurisdiction of Vidisha, Madhya Pradesh.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="contact" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-google-red/10 text-google-red flex items-center justify-center font-bold">
                  12
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Updates & Inquiries
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  We may revise these Terms to align with new chapter initiatives, platform features, or university policies. Your continued use of the platform constitutes acceptance of updated terms.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2">Need clarification on terms or community rules?</h4>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="mailto:satigdgoncampus@gmail.com"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-google-green text-white text-xs font-medium hover:bg-green-600 transition-colors"
                    >
                      <FaEnvelope /> Email: satigdgoncampus@gmail.com
                    </a>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Contact Team
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

export default Terms;
