import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaUserFriends, FaCalendarAlt, FaProjectDiagram } from 'react-icons/fa';

const StatsCard = ({ icon, count, label, suffix = "" }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    return (
        <div ref={ref} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center hover:shadow-md transition-shadow">
            <div className="text-4xl text-google-blue mb-4 flex justify-center">{icon}</div>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {inView ? <CountUp end={count} duration={2.5} /> : 0}{suffix}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">{label}</p>
        </div>
    );
};

const WhatWeDo = () => {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                            Who We Are
                            {/* Who We Are & <span className="text-google-red">What We Do</span> */}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            Google Developer Groups On Campus SATI Vidisha is a community-driven initiative for students to grow as developers. We bridge the gap between theory and practice by providing a platform for peer-to-peer learning.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            From hosting hands-on workshops and hackathons to building real-world projects, we aim to foster a culture of innovation and collaboration. Whether you are a beginner or an expert, there is a place for you here.
                        </p>
                        <a
                            href="https://gdg.community.dev/gdg-on-campus-samrat-ashok-technological-institute-vidisha-india/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-google-blue hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
                        >
                            Join Our Community
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <StatsCard icon={<FaUserFriends />} count={1000} label="Community Members" suffix="+" />
                        <StatsCard icon={<FaCalendarAlt />} count={15} label="Events Hosted" suffix="+" />
                        <div className="col-span-2">
                            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-64 overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29266.43797179915!2d77.8151027!3d23.5215392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c048a269d1ab7%3A0xf7b28bf51d19bbcc!2sSamrat%20Ashok%20Technological%20Institute!5e0!3m2!1sen!2sin!4v1769781361896!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="SATI Vidisha Location"
                                    className="rounded-xl w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default WhatWeDo;
