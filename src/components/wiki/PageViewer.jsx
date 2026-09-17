import React from 'react';
import { useWiki } from '../../context/WikiContext';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

/**
 * Component to display the detailed view of a specific wiki entry.
 * 
 * @param {string} id - The kebab-case ID of the entry (from URL).
 */
export const PageViewer = ({ id }) => {
  const { getActivePage, entries } = useWiki();
  const navigate = useNavigate();

  // Find the current entry based on path or parent_id
  const currentEntry = entries?.find(e => e.path === id) || entries?.find(e => e.parent_id === id);

  if (!currentEntry) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <div className="text-2xl">Page not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-8 text-blue-400 hover:underline flex items-center gap-2"
      >
        ← Back to Gallery
      </button>
      
      <header className="mb-8 border-b border-slate-800 pb-8">
        <h1 className="text-5xl font-bold mb-4">{currentEntry.title}</h1>
        <div className="flex flex-wrap gap-2">
          {currentEntry.tags?.map((tag, i) => (
            <span key={i} className="text-[10px] uppercase tracking-widest bg-blue-900/50 border border-blue-700 px-3 py-1 rounded text-blue-200">
              {tag}
            </span>
          ))}
        </div>
      </header>
      
      <article className="markdown-content prose max-w-none">
        <ReactMarkdown>{currentEntry.content}</ReactMarkdown>
      </article>
    </div>
  );
};
