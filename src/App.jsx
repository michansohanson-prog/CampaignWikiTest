import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWiki } from './context/WikiContext';
import { Gallery } from './components/wiki/Gallery';
import { PageViewer } from './components/wiki/PageViewer';
import { Sidebar } from './components/wiki/Sidebar';

function AppContent() {
  const { entries, loading, error } = useWiki();
  
  // Option 2: Set 'character' as the active filter by default instead of null.
  const [activeFilter, setActiveFilter] = useState('character');

  // This list now stays consistent with your Markdown file types
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
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-2">Campaign Bible</h1>
        <p className="text-slate-400">Your world, organized.</p>
      </header>

      {/* Container to keep Sidebar and Gallery aligned */}
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto items-start">
        <Sidebar 
          // Pass the labels only; the context will handle the filtering logic
          categories={categories.map(c => c.label)} 
          onFilterChange={(type) => setActiveFilter(type)} 
        />
        <main className="flex-1 w-full">
          {/* 
            We pass entries and our activeFilter state to the Gallery.
            Note: If you want to use the NEW context logic fully, 
            we can remove 'entries' as a prop later, but this works perfectly now!
          */}
          <Gallery 
            entries={entries} 
            filterType={activeFilter} 
          />
        </main>
      </div>
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
