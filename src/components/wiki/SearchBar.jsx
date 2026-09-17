import React from 'react';
import { useWiki } from '../../context/WikiContext';

/**
 * A mobile-friendly search bar pinned to the bottom of the screen.
 * Optimized for instant feedback and centered positioning.
 */
export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useWiki();

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-50">
      {/* 
         The outer container handles the max width for desktop.
         Added flex and justify-center to ensure centering logic is robust on all screen sizes.
      */}
      <div className="max-w-4xl w-full mx-auto relative flex justify-center items-center">
        <input
          type="text"
          placeholder="Search characters, lore, items..."
          className="w-full max-w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
