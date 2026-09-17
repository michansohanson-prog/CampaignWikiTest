import React from 'react';

/**
 * A glassmorphic card component for displaying a single wiki entry.
 * 
 * @param {Object} entry - The data object for the wiki entry.
 * @param {string} entry.title - The title of the entry.
 * @param {string} entry.summary - A short summary blurb.
 * @param {string[]} entry.tags - An array of tags/categories.
 * @param {Function} onClick - Callback for when a card is clicked.
 */
export const WikiCard = ({ entry, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500 transition-all duration-200 cursor-pointer group"
    >
      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
        {entry.title}
      </h3>
      <p className="text-slate-400 text-sm line-clamp-3">
        {entry.summary || "No summary available."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {entry.tags?.map((tag, i) => (
          <span key={i} className="text-[10px] uppercase tracking-widest bg-slate-700 px-2 py-1 rounded text-slate-300">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
