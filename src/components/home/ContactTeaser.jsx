import React from 'react';
import { Link } from 'react-router-dom';

const ContactTeaser = () => {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    Ready to Work <span className="text-google-green">Together?</span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                    Sponsor us • Grow your Business • Hire the Team
                </p>
                <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold text-lg hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-300"
                >
                    Contact Us
                </Link>
            </div>
        </section>
    );
};

export default ContactTeaser;
