import React from 'react';
import Hero from '../components/home/Hero';
import WhatWeDo from '../components/home/WhatWeDo';
import SocialMedia from '../components/home/SocialMedia';
import TeamPreview from '../components/home/TeamPreview';
import ContactTeaser from '../components/home/ContactTeaser';
import CTA from '../components/home/CTA';

const Home = () => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
            <Hero />
            <WhatWeDo />
            <TeamPreview />
            <SocialMedia />
            <ContactTeaser />
            <CTA />
        </div>
    );
};

export default Home;
