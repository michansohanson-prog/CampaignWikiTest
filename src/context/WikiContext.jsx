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
  // State for category filtering
  const [filterCategory, setFilterCategory] = useState('all');
  // New state for search query
  const [searchQuery, setSearchQuery] = useState('');

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

  // This logic now handles BOTH the category and the search query simultaneously
  const getFilteredEntries = () => {
    let filtered = entries;

    // 1. Filter by Category
    if (filterCategory !== 'all') {
      const dataType = CATEGORY_MAP[filterCategory];
      filtered = filtered.filter(e => e.type === dataType);
    }

    // 2. Filter by Search Query (Title, Summary, or Tags)
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => {
        return (
          entry.title.toLowerCase().includes(query) ||
          (entry.summary && entry.summary.toLowerCase().includes(query)) ||
          entry.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }

    return filtered;
  };

  return (
    <WikiContext.Provider value={{
      entries,
      loading,
      error,
      activePageId,
      setActivePageId,
      setFilterCategory,
      setSearchQuery, // Exporting the setter for the SearchBar component
      searchQuery,    // Exporting the query so UI can show what's being searched
      getActivePage: getActivePage,
      getFilteredEntries: getFilteredEntries,
      currentFilter: filterCategory
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
