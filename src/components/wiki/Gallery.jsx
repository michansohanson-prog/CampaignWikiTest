import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WikiCard } from '../ui/WikiCard';
import { useWiki } from '../../context/WikiContext';

/**
 * The main gallery view that displays wiki entries as "Long Tiles."
 */
export const Gallery = () => {
  const navigate = useNavigate();
  // We pull the filtered data directly from the hook.
  const { getFilteredEntries, loading } = useWiki();

  // IMPORTANT: Removed useMemo here. 
  // By calling the function directly, it re-evaluates every time the context updates.
  const filteredEntries = getFilteredEntries();

  if (loading) return <div className="text-center mt-20">Loading Lore...</div>;

  if (!filteredEntries || filteredEntries.length === 0) {
    return (
      <div className="text-center text-slate-500 mt-20 p-8 border border-slate-800 rounded-xl">
        No entries found.
      </div>
    );
  }

  return (
    /* 
       PRESERVED LAYOUT:
       1. grid-cols-1 ensures the "Long Tile" vertical stack you requested.
       2. No fixed height constraint to allow summaries to be fully visible.
    */
    <div className="max-w-3xl mx-auto grid grid-cols-1 gap-4 p-2 md:p-0">
      {filteredEntries.map((entry, index) => {
        const entryId = entry.path.split('/').pop().replace('.md', '');
        
        return (
          <div key={index} className="w-full">
            {/* 
               We use compact={false} to ensure the long tile look with summaries 
               is preserved while using your "High Density" font sizes.
            */}
            <WikiCard 
              entry={entry} 
              onClick={() => navigate(`/wiki/${entryId}`)} 
              compact={false} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default Gallery;
