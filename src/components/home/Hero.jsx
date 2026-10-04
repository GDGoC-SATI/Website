import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const images = [
    "/assets/core_team/group_image.jpeg",
    "/assets/core_team/group_image2.jpeg",
    "/assets/core_team/group_image3.jpeg",
    "/assets/core_team/group_image4.jpeg"
];

const mobileImages = [
    "/assets/core_team/group_image_phone.jpeg",
    "/assets/core_team/group_image2_phone.jpeg",
    "/assets/core_team/group_image3_phone.jpeg",
    "/assets/core_team/group_image.jpeg" // Fallback for the 4th image
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 7000); // Change image every 7 seconds

        return () => clearInterval(timer);
    }, [currentIndex]); // Reset timer when index changes (manual or auto)

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <section className="relative h-[100vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode='wait'>
                    {/* Desktop Image */}
                    <motion.img
                        key={`desktop-${currentIndex}`}
                        src={images[currentIndex]}
                        alt={`GDG SATI Vidisha Community ${currentIndex + 1}`}
                        className="absolute inset-0 w-full h-full object-cover hidden md:block"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1.1 }}
                        // exit={{ opacity: 0 }}
                        transition={{ duration: 4, ease: "linear" }}
                    />
                    {/* Mobile Image */}
                    <motion.img
                        key={`mobile-${currentIndex}`}
                        src={mobileImages[currentIndex]}
                        alt={`GDG SATI Vidisha Community ${currentIndex + 1}`}
                        className="absolute inset-0 w-full h-full object-cover block md:hidden"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        // exit={{ opacity: 0 }}
                        transition={{ duration: 4, ease: "linear" }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/70 z-10" />
            </div>

            {/* Navigation Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all cursor-pointer hover:scale-110 active:scale-95 hidden md:block"
                aria-label="Previous slide"
            >
                <FaChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all cursor-pointer hover:scale-110 active:scale-95 hidden md:block"
                aria-label="Next slide"
            >
                <FaChevronRight size={24} />
            </button>

            {/* Content Container */}
            <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-google-blue"></span>
                        </span>
                        Welcome to GDGoC SATI Vidisha
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8">
                        Learn. <span className="text-google-blue">Connect.</span> <br className="hidden sm:block" />
                        <span className="text-google-green">Grow.</span> Together.
                    </h1>

                    <p className="mt-4 text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-12 leading-relaxed">
                        We are a community of developers, designers, and tech enthusiasts from Samrat Ashok Technological Institute, Vidisha. Join us to learn new technologies, build impactful projects, and connect with like-minded peers.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <a
                            href="https://gdg.community.dev/gdg-on-campus-samrat-ashok-technological-institute-vidisha-india/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 rounded-full bg-google-blue text-white font-semibold text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-google-blue/30 transform hover:-translate-y-1"
                        >
                            Become a Member
                        </a>
                        <a
                            href="/events"
                            className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all transform hover:-translate-y-1"
                        >
                            Explore Events
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce z-20"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </motion.div>
        </section>
    );
};

export default Hero;
