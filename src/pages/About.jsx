import React from 'react';
import WhatWeDoCards from '../components/about/WhatWeDoCards';
import usePageSEO from '../hooks/usePageSEO';

const About = () => {
    usePageSEO({
        title: 'About Our Chapter',
        description: 'Learn about Google Developer Groups on Campus at Samrat Ashok Technological Institute (SATI) Vidisha, our mission, legacy since 1960, and community initiatives.',
        path: '/about',
    });

    return (
        <div className="min-h-screen py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Intro Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 dark:text-white">
                        About <span className="text-google-blue">Us</span>
                    </h1>
                    <div className="prose dark:prose-invert max-w-none text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p className="mb-6">
                            Established in 1960, <strong className="text-slate-900 dark:text-white">Samrat Ashok Technological Institute (SATI)</strong> has been a pioneer in technical education.
                            GDG on Campus extends this legacy by fostering a culture of peer-to-peer learning and open innovation.
                        </p>
                        <p>
                            We believe in the power of community. By bringing together students from diverse backgrounds and disciplines, we create an environment where ideas flourish and innovation thrives.
                            Our mission is to help students bridge the gap between theory and practice, providing them with the skills and network they need to succeed in the tech industry.
                        </p>
                    </div>
                </div>

                {/* What We Do Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        What <span className="text-google-red">We Do</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        We organize various types of events throughout the year
                    </p>
                </div>

                <WhatWeDoCards />

            </div>
        </div>
    );
};

export default About;
