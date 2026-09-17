import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWikiData } from '../services/wikiService';

// The WikiContext stores all data fetched from the campaign_data source.
const WikiContext = createContext();

/**
 * Provider for the entire wiki application's state.
 * Handles loading all content and identifying the current active page.
 */
export const WikiProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePageId, setActivePageId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch of all wiki data on app mount.
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

  // Helper to find a specific entry by its kebab-case ID.
  const getActivePage = () => entries.find(e => e.parent_id === activePageId) || null;

  return (
    <WikiContext.Provider value={{
      entries,
      loading,
      error,
      activePageId,
      setActivePageId,
      getActivePage: getActivePage
    }}>
      {children}
    </WikiContext.Provider>
  );
};

// Custom hook for components to easily access wiki data.
export const useWiki = () => {
  const context = useContext(WikiContext);
  if (!context) {
    throw new Error("useWiki must be used within a WikiProvider");
  }
  return context;
};
