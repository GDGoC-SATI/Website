import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaDiscord, FaWhatsapp, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300 hover:border-google-blue/50">
            <button
                fullWidth
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <span className="text-lg font-bold text-slate-900 dark:text-white pr-8">{question}</span>
                <div className={`text-google-blue transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <FaChevronDown />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Contact = () => {
    const [subject, setSubject] = useState("General Inquiry");
    const [isSubjectOpen, setIsSubjectOpen] = useState(false);
    const subjects = ["General Inquiry", "Sponsorship", "Collaboration", "Report Issue"];
    const faqs = [
        {
            question: "How can I join the GDG community?",
            answer: "You can join our community by following our social media handles and joining our WhatsApp group for the latest updates."
        },
        {
            question: "Who can participate in the events?",
            answer: "Our events are open to all students, developers, and tech enthusiasts who are eager to learn and grow."
        },
        {
            question: "Are the events free to attend?",
            answer: "Yes, most of our sessions, workshops, and meetups are completely free of cost."
        },
        {
            question: "How can I become a core team member?",
            answer: "We conduct recruitment drives annually. Stay tuned to our social media channels for announcements."
        },
        {
            question: "Can I collaborate or sponsor an event?",
            answer: "Absolutely! Please reach out to us via email or the contact form for sponsorship and collaboration opportunities."
        }
    ];

    return (
        <div className="min-h-screen pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Content */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            Get in <span className="text-google-blue">Touch</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                            Have questions about our events, want to collaborate, or just want to say hi? We'd love to hear from you. Fill out the form or reach us through our channels.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-google-blue/10 rounded-lg text-google-blue text-xl">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Email Us</h3>
                                    <a href="mailto:satigdgoncampus@gmail.com" className="text-google-blue dark:google-blue hover:text-google-blue transition-colors">
                                        satigdgoncampus@gmail.com
                                    </a>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">We usually reply within 24 hours.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-google-green/10 rounded-lg text-google-green text-xl">
                                    <FaWhatsapp />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Join Community</h3>
                                    <a
                                        href="https://chat.whatsapp.com/HY4x1jtPfbh6EDh1JPFWda"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-google-green dark:text-google-green hover:text-google-green transition-colors"
                                    >
                                        GDG on Campus SATI Vidisha
                                    </a>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Join our WhatsApp Group for updates.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-google-yellow/10 rounded-lg text-google-red text-xl">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Visit Us</h3>
                                    <a
                                        href="https://www.google.com/maps/search/Samrat+Ashok+Technological+Institute+Civil+Lines,+Vidisha,+MP+464001"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-google-red dark:text-google-yellow hover:text-google-yellow transition-colors"
                                    >
                                        Samrat Ashok Technological Institute
                                    </a>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Civil Lines, Vidisha, Madhya Pradesh, India 464001</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue transition-all" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue transition-all" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue transition-all" placeholder="john@example.com" />
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                                <button
                                    type="button"
                                    onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                                    className="w-full px-4 py-3 flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue transition-all text-slate-700 dark:text-slate-300"
                                >
                                    <span>{subject}</span>
                                    <FaChevronDown className={`transition-transform duration-300 ${isSubjectOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                <AnimatePresence mode='wait'>
                                    {isSubjectOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-2"
                                        >
                                            {subjects.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => {
                                                        setSubject(s);
                                                        setIsSubjectOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${subject === s ? 'text-google-blue font-bold bg-google-blue/5' : 'text-slate-600 dark:text-slate-300'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {isSubjectOpen && <div className="fixed inset-0 z-[40]" onClick={() => setIsSubjectOpen(false)} />}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                <textarea rows="4" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue transition-all resize-none" placeholder="How can we help you?"></textarea>
                            </div>

                            <button type="button" className="w-full py-4 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-google-blue/20">
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>

                {/* FAQ Section - Accordion */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">
                        Frequently Asked <span className="text-google-blue">Questions</span>
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
