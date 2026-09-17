import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWikiData } from '../services/wikiService';

const WikiContext = createContext();

/**
 * Maps Sidebar Labels (plural) to Markdown Types (singular).
 */
const CATEGORY_MAP = {
  "characters": "character",
  "factions": "faction",
  "regions": "region",
  "monsters": "monster",
  "items": "item",
  "history": "history",
  "all": "all"
};

export const WikiProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for category filtering
  const [filterCategory, setFilterCategory] = useState('all');
  // New state for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for the active page ID (navigating to a specific entry)
  const [activePageId, setActivePageId] = useState(null);

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

  // --- NEW: Clear search query when category changes ---
  useEffect(() => {
    setSearchQuery('');
  }, [filterCategory]);

  const normalize = (str) => {
    if (!str) return "";
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  /**
   * Logic for calculating what the user should see on screen.
   */
  const getFilteredEntries = () => {
    // PRIORITY 1: Global Search Mode
    // If there is a search query, we ignore the category filter entirely
    // and search across the entire database to ensure "Global" behavior.
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      return entries.filter(entry => {
        return (
          entry.title.toLowerCase().includes(query) ||
          (entry.summary && entry.summary.toLowerCase().includes(query)) ||
          entry.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }

    // PRIORITY 2: Browsing Mode (Category Filter)
    // If the search bar is empty, we show only what's in the selected category.
    let filtered = entries;
    if (filterCategory !== 'all') {
      const dataType = CATEGORY_MAP[filterCategory];
      if (dataType) {
        filtered = filtered.filter(e => e.type === dataType);
      }
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
      setSearchQuery,
      searchQuery,
      getActivePage: () => {
        if (!activePageId) return null;
        const found = entries.find(e => 
          e.path === activePageId || 
          e.parent_id === activePageId || 
          normalize(e.title) === normalize(activePageId)
        );
        return found || null;
      },
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
