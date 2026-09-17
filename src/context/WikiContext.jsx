import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWikiData } from '../services/wikiService';

const WikiContext = createContext();

// Maps Sidebar Labels (plural) to Markdown Types (singular)
const CATEGORY_MAP = {
  "Characters": "character",
  "Factions": "faction",
  "Regions": "region",
  "Monsters": "monster",
  "Items": "item",
  "History": "history",
  "all": "all"
};

export const WikiProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePageId, setActivePageId] = useState(null);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchWikiData()
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load wiki data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getActivePage = () => {
    if (!activePageId) return null;
    return entries.find(e => 
      e.path === activePageId || 
      e.parent_id === activePageId || 
      e.title.toLowerCase() === activePageId.toLowerCase()
    ) || null;
  };

  const getFilteredEntries = () => {
    if (filterCategory === 'all') return entries;
    
    // Look up the correct singular type from our map
    const dataType = CATEGORY_MAP[filterCategory];
    return entries.filter(e => e.type === dataType);
  };

  return (
    <WikiContext.Provider value={{
      entries,
      loading,
      error,
      activePageId,
      setActivePageId,
      setFilterCategory,
      getActivePage: getActivePage,
      getFilteredEntries: getFilteredEntries,
      currentFilter: filterCategory // Export this so the UI knows what's active
    }}>
      {children}
    </WikiContext.Provider>
  );
};

export const useWiki = () => {
  const context = useContext(WikiContext);
  if (!context) {
    throw new Error("useWiki must be used within a WikiProvider");
  }
  return context;
};
