import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import usePageSEO from '../hooks/usePageSEO';
import Dino3DGame from '../components/Dino3DGame';

const NotFound = () => {
  usePageSEO({
    title: '404 - Page Not Found',
    description: 'The requested page does not exist on GDG on Campus SATI Vidisha. Play the classic Dino game or head back to camp!',
    path: '/404',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-15 pb-20 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* 404 Header & Brand Kit Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-google-red/10 dark:bg-google-red/20 border border-google-red/30 text-google-red text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-google-red animate-ping" />
            404 • Page Not Found
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Lost in the <span className="bg-gradient-to-r from-google-blue via-google-red to-google-yellow bg-clip-text text-transparent">Extinction Zone</span>?
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            The page you requested may have been moved, renamed, or vanished like the prehistoric era.
            While our campus developers track down the lost coordinates, challenge our mascot Dino!
          </p>
        </motion.div>

        {/* Dinosaur 3D Arcade Game */}
        <div className="w-full max-w-6xl">
          <Dino3DGame />
        </div>

        {/* Useful Navigation Hub (Google Colors Palette) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-google-blue hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-google-blue/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <FaHome size={15} />
            Back to Home
          </Link>
        </motion.div>

        {/* Help footer footnote */}
        <p className="mt-8 text-xs text-slate-400 text-center">
          Think this is a broken link on our end?{' '}
          <Link to="/contact" className="text-google-blue hover:underline font-semibold">
            Report it to the GDGoC SATI tech team
          </Link>
          .
        </p>

      </div>
    </div>
  );
};

export default NotFound;
