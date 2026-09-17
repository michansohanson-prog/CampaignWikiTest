import React from 'react';
import { useWiki } from '../../context/WikiContext';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export const PageViewer = () => {
  const params = useParams();
  const id = params.id; 
  const { entries } = useWiki();
  const navigate = useNavigate();

  const findEntry = () => {
    if (!entries || !id) return null;

    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedId = normalize(id);

    return entries.find(e => 
      e.path === id || 
      e.parent_id === id || 
      normalize(e.title) === normalizedId
    );
  };

  const currentEntry = findEntry();

  if (!currentEntry) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <div className="text-2xl">Page not found.</div>
      </div>
    );
  }

  const Img = ({ src, alt }) => {
    let finalSrc = src;
    if (src && !src.startsWith('/')) {
      finalSrc = `/campaign_data/${src}`;
    }

    return (
      <img 
        src={finalSrc} 
        alt={alt || 'Wiki Content'} 
        className="max-w-full h-auto mx-auto my-4 rounded-xl border border-white/10 shadow-2xl shadow-black/20 object-contain"
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-8">
      {/* mb-0 to move the title as close as possible to the button */}
      <button 
        onClick={() => navigate('/')}
        className="mb-0 text-blue-400 hover:underline flex items-center gap-2"
      >
        ← Back to Gallery
      </button>

      {/* Reduced mb from 2 to 1, and pb set to 0 */}
      <header className="mb-1 border-b border-slate-800 pb-0">
        {/* 
           Used text-lg for mobile (landscape) to save height. 
           Added leading-none to eliminate the vertical air between lines.
        */}
        <h1 className="text-lg md:text-6xl font-bold mb-0 leading-none">{currentEntry.title}</h1>
        
        {/* No margin top here; tags will sit directly against the bottom of the title */}
        <div className="flex flex-wrap gap-1 mt-0">
          {currentEntry.tags?.map((tag, i) => (
            <span key={i} className="text-[8px] uppercase tracking-widest bg-blue-900/50 border border-blue-700 px-2 py-0 rounded text-blue-200">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <article className="markdown-content prose max-w-none mt-2">
        <ReactMarkdown 
          components={{
            img: Img
          }}
        >
          {currentEntry.content}
        </ReactMarkdown>
      </article>
    </div>
  );
};
