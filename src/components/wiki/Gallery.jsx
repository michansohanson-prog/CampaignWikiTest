import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WikiCard } from '../ui/WikiCard';
import { useWiki } from '../../context/WikiContext';

/**
 * The main gallery view that displays wiki entries, with optional category filtering.
 */
export const Gallery = () => {
  const navigate = useNavigate();
  const { getFilteredEntries, loading, currentFilter } = useWiki();

  const filteredEntries = getFilteredEntries();

  if (loading) return <div className="text-center mt-20">Loading Lore...</div>;

  if (filteredEntries.length === 0) {
    // Clean up the error message to avoid pluralization bugs
    return (
      <div className="text-center text-slate-500 mt-20">
        {currentFilter !== 'all' ? `No ${currentFilter} entries found.` : "No entries found."}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEntries.map((entry, index) => {
        // Standardize the path to a clean ID for navigation
        const entryId = entry.path.split('/').pop().replace('.md', '');
        
        return (
          <WikiCard 
            key={index} 
            entry={entry} 
            onClick={() => navigate(`/wiki/${entryId}`)} 
          />
        );
      })}
    </div>
  );
};
