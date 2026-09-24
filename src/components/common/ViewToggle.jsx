import React from 'react';
import { FaThLarge, FaList } from 'react-icons/fa';

/**
 * Reusable ViewToggle Component for switching between Grid and List views
 * @param {string} view - 'grid' or 'list'
 * @param {function} onViewChange - callback (newView) => void
 * @param {string} className - optional extra class names
 */
const ViewToggle = ({ view = 'grid', onViewChange, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-inner ${className}`}
    >
      <button
        type="button"
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          view === 'grid'
            ? 'bg-white dark:bg-slate-700 text-google-blue dark:text-white shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        title="Grid View"
      >
        <FaThLarge size={12} />
        <span className="hidden sm:inline">Grid</span>
      </button>

      <button
        type="button"
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          view === 'list'
            ? 'bg-white dark:bg-slate-700 text-google-blue dark:text-white shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        title="List View"
      >
        <FaList size={12} />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  );
};

export default ViewToggle;
