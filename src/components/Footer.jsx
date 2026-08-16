import React from 'react';
import { Link } from 'react-router-dom';
import { TbBrandLinkedin, TbBrandGithub, TbBrandInstagram, TbBrandYoutube, TbBrandGoogle } from 'react-icons/tb';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Pages",
            links: [
                { name: "Home", path: "/" },
                { name: "Events", path: "/events" },
                { name: "Projects", path: "/projects" },
                { name: "Team", path: "/team" },
                { name: "About Us", path: "/about" },
                { name: "Contact Us", path: "/contact" },
            ]
        },
        {
            title: "Community",
            links: [
                { name: "Achievements", path: "/achievements" }, // Placeholder for now
                { name: "Alumni", path: "/alumni" },
                { name: "Gallery", path: "/gallery" }, // Placeholder
                { name: "Meetings", path: "/events#meetings" },
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Brand Kit", path: "/brand" }, // Placeholder
                { name: "Code of Conduct", path: "/code-of-conduct" },
                { name: "Terms & Conditions", path: "/terms" },
            ]
        }
    ];

    const socialLinks = [
        { icon: <TbBrandGoogle />, href: "https://gdg.community.dev/gdg-on-campus-samrat-ashok-technological-institute-vidisha-india/", label: "GDG Community" },
        { icon: <TbBrandLinkedin />, href: "https://www.linkedin.com/company/gdgoc-sati/", label: "LinkedIn" },
        { icon: <TbBrandInstagram />, href: "https://www.instagram.com/gdgoc.sati/", label: "Instagram" },
        { icon: <TbBrandYoutube />, href: "https://www.youtube.com/@GDGoCSATI", label: "YouTube" },
        { icon: <TbBrandGithub />, href: "https://github.com/GDGoC-SATI", label: "GitHub" },
    ];

    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <Link to="/" className="inline-block mb-4">
                            <div className="h-15 right-7 scale-150 relative">
                                <img
                                    src="/assets/GDG_title_black_footer.png"
                                    alt="GDG on Campus"
                                    className="h-full w-auto object-contain scale-54 dark:hidden"
                                />
                                <img
                                    src="/assets/GDG_title_white_footer.png"
                                    alt="GDG on Campus"
                                    className="h-full w-auto object-contain hidden dark:block"
                                />
                            </div>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                            Empowering students to learn, build, and grow together. Join our community to connect with fellow developers.
                        </p>
                        <div className="hidden lg:flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-google-blue dark:hover:text-google-blue transition-colors text-xl"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="col-span-1">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-6">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-slate-600 dark:text-slate-400 hover:text-google-blue dark:hover:text-google-blue text-sm transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Mobile Social Links */}
                    <div className="col-span-2 lg:hidden flex justify-center gap-4 mt-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-google-blue dark:hover:text-google-blue transition-colors text-xl"
                                aria-label={social.label}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-8 text-center text-sm text-slate-500 dark:text-slate-500">
                    <p>&copy; {currentYear} Google Developer Groups On Campus - SATI Vidisha. All rights reserved.</p>
                    <div className="flex justify-center gap-8 mt-4">
                        <span className="flex items-center gap-2">
                            {/* <span className="flex h-2 w-2 rounded-full bg-google-blue"></span> */}
                            Made with ❤️ by developers
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
