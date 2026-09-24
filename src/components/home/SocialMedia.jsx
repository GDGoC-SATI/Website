import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const SocialMedia = () => {
    // Real Instagram Reel IDs provided by User
    const originalReelIds = [
        "DTImL4iiUp7",
        "DS9vqKRES2h",
        "DRIFnFgDTsH",
        "DQGWFargpVM",
        "DPDnb5OEYIh",
        "DAgUphgAxGn",
        "CwUVzKzNGNd",
    ];

    const reelIds = [...originalReelIds, ...originalReelIds]; // Duplicate for seamless loop

    return (
        <section className="py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-google-yellow/10 rounded-full blur-3xl -z-10 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-google-red/10 rounded-full blur-3xl -z-10 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="text-center lg:text-left order-2 lg:order-1">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            Latest Happenings <br />
                            <span className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent">On Instagram</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                            Dive into the energy of our community! Catch the latest event highlights, workshop snippets, and behind-the-scenes fun directly from our Instagram feed.
                        </p>

                        <a
                            href="https://www.instagram.com/gdgsatividisha"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold hover:shadow-xl hover:scale-105 transition-all shadow-lg group"
                        >
                            <FaInstagram className="text-2xl group-hover:rotate-12 transition-transform" />
                            <span>Follow @gdgoc.sati</span>
                        </a>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-slate-900 dark:text-white">12+</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">Events</span>
                            </div>
                            <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-slate-900 dark:text-white">700+</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">Followers</span>
                            </div>
                            {/* <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div> */}
                            {/* <div className="text-center">
                                <span className="block text-3xl font-bold text-slate-900 dark:text-white">100+</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">Projects</span>
                            </div> */}
                        </div>
                    </div>

                    {/* Mobile Mockup */}
                    <div className="relative order-1 lg:order-2 flex justify-center">
                        {/* Phone Frame */}
                        <div className="relative w-[300px] h-[600px] border-8 border-slate-900 dark:border-slate-800 rounded-[3rem] bg-slate-900 shadow-2xl overflow-hidden z-10">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>

                            {/* Screen Content */}
                            <div className="w-full h-full bg-white dark:bg-black overflow-hidden relative">
                                {/* Instagram Header Mockup */}
                                <div className="absolute top-0 left-0 right-0 h-16 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 flex items-end pb-2 px-4 shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Reels</h3>
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    </div>
                                </div>

                                {/* Scrolling Container */}
                                {/* Scrolling Container */}
                                <div className="animate-scroll-vertical w-full">
                                    {reelIds.map((id, index) => (
                                        <div key={`${id}-${index}`} className="w-full h-[580px] relative border-b border-slate-100 dark:border-slate-800 bg-black">
                                            <iframe
                                                src={`https://www.instagram.com/reel/${id}/embed`}
                                                className="w-full h-full"
                                                frameBorder="0"
                                                scrolling="no"
                                                allowTransparency="true"
                                                allow="autoplay; encrypted-media"
                                                title={`Instagram Reel ${index + 1}`}
                                            ></iframe>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Phone Shadow/Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600 to-orange-600 rounded-[3.5rem] blur-xl opacity-30 -z-10 animate-pulse"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SocialMedia;

