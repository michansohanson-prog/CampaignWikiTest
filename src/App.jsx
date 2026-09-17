import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWiki } from './context/WikiContext';
import { Gallery } from './components/wiki/Gallery';
import { PageViewer } from './components/wiki/PageViewer';
import { Sidebar } from './components/wiki/Sidebar';
import { SearchBar } from './components/wiki/SearchBar';

function AppContent() {
  const { entries, loading, error } = useWiki();
  // Option 2: Set 'character' as the active filter by default.
  const [activeFilter, setActiveFilter] = useState('character');

  // Hardcoded categories to ensure consistency between UI and Context mapping
  const categories = [
    { id: 'character', label: 'Characters' },
    { id: 'faction', label: 'Factions' },
    { id: 'region', label: 'Regions' },
    { id: 'monster', label: 'Monsters' },
    { id: 'item', label: 'Items' },
    { id: 'history', label: 'History' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-2xl animate-pulse">Loading Campaign Lore...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-red-400 flex items-center justify-center p-4">
        <div className="text-xl">Error loading wiki: {error}</div>
      </div>
    );
  }

  return (
    // Added bottom padding (pb-32) so the content doesn't get hidden behind the fixed search bar
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 pb-32">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-2">Campaign Bible</h1>
        <p className="text-slate-400">Your world, organized.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto items-start">
        <Sidebar 
          categories={categories.map(c => c.label)} 
          onFilterChange={(type) => setActiveFilter(type)} 
        />
        <main className="flex-1 w-full">
          <Gallery entries={entries} filterType={activeFilter} />
        </main>
      </div>

      {/* Fixed Bottom Search Bar */}
      <SearchBar />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/wiki/:id" element={<PageViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
