import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useWiki } from './context/WikiContext';
import { Gallery } from './components/wiki/Gallery';
import { PageViewer } from './components/wiki/PageViewer';
import { Sidebar } from './components/wiki/Sidebar';
import { SearchBar } from './components/wiki/SearchBar';

function AppContent() {
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
      <div className="min-h-screen bg-emerald-950 text-white flex items-center justify-center">
        <div className="text-2xl animate-pulse">Loading Campaign Lore...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-emerald-950 text-red-400 flex items-center justify-center p-4">
        <div className="text-xl">Error loading wiki: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white p-3 md:p-8 pb-32">
      {/* --- BACKGROUND LAYERS --- */}

      {/* 1. Base Layer */}
      <div className="fixed inset-0 bg-emerald-950 -z-30" />

      {/* 2. Aurora & Gradient Layer (Animated) */}
      <div 
        className="fixed inset-0 -z-20 opacity-50"
        style={{
          background: `linear-gradient(135deg, #064e3b 0%, #1e3a8a 50%, #451a03 100%)`,
          backgroundSize: '400% 400%',
          animation: 'auroraMove 20s ease infinite'
        }}
      />

      {/* 3. Organic Blobs (Depth) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-800/20 blur-[120px] rounded-full" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-orange-900/10 blur-[100px] rounded-full" />
      </div>

      {/* 4. Grain/Noise Overlay (SVG Filter) */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10">
        <header className="mb-4 text-center">
          <h1 
            className="text-3xl md:text-6xl font-bold mb-0 text-amber-700 drop-shadow-[0_4px_15px_rgba(192,142,90,0.6)]"
            style={{ color: '#c08e5a' }}
          >
            Campaign Wiki
          </h1>
          <p className="text-slate-400 text-[10px] md:text-base leading-none">Your world, organized.</p>
        </header>

        <div className="w-full flex flex-col items-center">
          <Sidebar 
            categories={categories} 
            onFilterChange={(type) => {
              console.log("Filtering for:", type);
              setFilterCategory(type);
            }} 
          />
          <main className="w-full mt-4">
            <Gallery />
          </main>
        </div>

        <SearchBar />
      </div>

      {/* CSS for Aurora Animation */}
      <style>{`
        @keyframes auroraMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    // Removed basename because HashRouter treats the part after '#' as the root.
    // Vite's 'base' config in vite.config.js handles our folder pathing for assets.
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/wiki/:id" element={<PageViewer />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
