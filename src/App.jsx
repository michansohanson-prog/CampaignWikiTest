import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWiki } from './context/WikiContext';
import { Gallery } from './components/wiki/Gallery';
import { PageViewer } from './components/wiki/PageViewer';
import { Sidebar } from './components/wiki/Sidebar';
import { SearchBar } from './components/wiki/SearchBar';

function AppContent() {
  // We now extract setFilterCategory directly from the hook.
  // This is our "Source of Truth" for what category is currently active.
  const { entries, loading, error, setFilterCategory } = useWiki();

  const categories = [
    'characters', // Row 1 - Item 1
    'factions',   // Row 1 - Item 2
    'regions',    // Row 1 - Item 3
    'history',    // Row 1 - Item 4
    'monsters',   // Row 2 - Item 1
    'items'       // Row 2 - Item 2
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
    <div className="min-h-screen bg-slate-900 text-white p-3 md:p-8 pb-32">
      {/* Header Compression */}
      <header className="mb-4 text-center">
        {/* FIX: Changed mb-[-4px] to mb-0 as suggested by Tailwind Linter */}
        <h1 className="text-3xl md:text-6xl font-bold mb-0">Campaign Bible</h1>
        <p className="text-slate-400 text-[10px] md:text-base leading-none">Your world, organized.</p>
      </header>

      {/* 
         Navigation Fix:
         The Sidebar now calls setFilterCategory directly from the context.
         This ensures that clicking a button updates the Source of Truth.
      */}
      <div className="w-full flex flex-col items-center">
        <Sidebar 
          categories={categories} 
          onFilterChange={(type) => {
            console.log("Filtering for:", type); // Debug line to see it work in console
            setFilterCategory(type); // Updating the context directly!
          }} 
        />
        <main className="w-full mt-4">
          {/* Gallery now pulls its own filtered data from the hook automatically */}
          <Gallery />
        </main>
      </div>

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
