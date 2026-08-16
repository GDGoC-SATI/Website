import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';

const ProjectCard = ({ title, description, techStack, links, image }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 flex flex-col h-full group"
    >
        <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
            <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-600">
                <FaCode className="text-6xl" />
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                {links.demo && (
                    <a href={links.demo} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-slate-900 hover:text-google-blue transition-colors" title="Live Demo">
                        <FaExternalLinkAlt />
                    </a>
                )}
                {links.github && (
                    <a href={links.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-slate-900 hover:text-google-blue transition-colors" title="View Code">
                        <FaGithub />
                    </a>
                )}
            </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow">
                {description}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
                {techStack.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium rounded border border-slate-200 dark:border-slate-700">
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    </motion.div>
);

const Projects = () => {
    const projects = [
        {
            title: "GDG Website",
            image: "../assets/projects/web-preview.jpeg",
            description: "The official website for GDG on Campus SATI Vidisha, built with React and Tailwind CSS.",
            techStack: ["React", "Tailwind", "Framer Motion"],
            links: { github: "https://github.com/GDGoC-SATI/Website", live: "https://gdgoc-sati.vercel.app/" }
        },
    ];

    return (
        <div className="min-h-screen pb-20">
            <div className="bg-slate-50 dark:bg-slate-900/50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Our <span className="text-google-green">Projects</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Innovation in action. Check out the cool stuff our community has built to solve real-world problems.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, i) => (
                        <ProjectCard key={i} {...project} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
