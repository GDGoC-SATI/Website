import React from 'react';
import { Link } from 'react-router-dom';
import { FaMicrophone, FaLaptopCode, FaRocket, FaBookReader, FaHeart, FaTrophy } from 'react-icons/fa';

const Card = ({ icon, title, description, color }) => (
    <Link to="/events" className="block h-full">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 group text-center h-full">
            <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                <div className={`text-2xl ${color.replace('bg-', 'text-')}`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {description}
            </p>
        </div>
    </Link>
);

const WhatWeDoCards = () => {
    const activities = [
        {
            icon: <FaMicrophone />,
            title: "Meetups & Talks",
            description: "Regular meetups featuring expert speakers covering the latest in Android, Web, Cloud, AI/ML, and more.",
            color: "bg-blue-500",

        },
        {
            icon: <FaLaptopCode />,
            title: "Workshops",
            description: "Hands-on workshops where you can learn new technologies and build real projects with guidance from mentors.",
            color: "bg-green-500"
        },
        {
            icon: <FaTrophy />,
            title: "DevFest",
            description: "Our annual flagship conference bringing together developers from across the region for a full day of learning and networking.",
            color: "bg-yellow-500"
        },
        {
            icon: <FaBookReader />,
            title: "Study Jams",
            description: "Collaborative learning sessions where participants work through Google's training programs together.",
            color: "bg-orange-500"
        },
        {
            icon: <FaHeart />,
            title: "Networking",
            description: "Connect with like-minded developers, share experiences, and build lasting relationships within the community.",
            color: "bg-yellow-500"
        },
        {
            icon: <FaRocket />,
            title: "Hackathons",
            description: "Build innovative solutions in fast-paced hackathons, collaborate with teams, and win exciting prizes.",
            color: "bg-green-500"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {activities.map((activity, index) => (
                <Card key={index} {...activity} />
            ))}
        </div>
    );
};

export default WhatWeDoCards;
