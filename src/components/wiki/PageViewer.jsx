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

  const getCleanContent = (content, title) => {
    if (!content) return "";

    const lines = content.split('\n');
    const firstLine = lines[0]?.trim();

    if (firstLine && firstLine.toLowerCase() === title.toLowerCase()) {
      return lines.slice(1).join('\n').trim();
    }

    return content;
  };

  if (!currentEntry) {
    return (
      <div className="min-h-screen bg-emerald-950 text-white flex items-center justify-center p-8">
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

  const cleanedContent = getCleanContent(currentEntry.content, currentEntry.title);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      <div className="fixed inset-0 bg-emerald-950 -z-30" />
      <div 
        className="fixed inset-0 -z-20 opacity-50"
        style={{
          background: `linear-gradient(135deg, #3d1a1a 0%, #062c1d 50%, #4a2c1a 100%)`,
          backgroundSize: '400% 400%',
          animation: 'auroraMove 20s ease infinite'
        }}
      />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-950/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/30 blur-[120px] rounded-full" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-amber-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto p-3 md:p-8 pb-32 relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="mb-0 text-amber-200 hover:underline flex items-center gap-2"
        >
          ← Back to Gallery
        </button>

        <header className="mb-1 border-b border-white/10 pb-0">
          <h1 
            className="text-2xl md:text-5xl font-bold mb-0 leading-none tracking-wide drop-shadow-[0_3px_10px_rgba(192,142,90,0.5)]"
            style={{ color: '#c08e5a' }}
          >
            {currentEntry.title}
          </h1>
        </header>

        <article className="markdown-content max-w-none mt-6 text-[#e2e8f0]">
          <ReactMarkdown 
            components={{
              img: Img,
              h1: () => null, 
              p: ({node, ...props}) => (
                <p className="mb-6 leading-loose text-[1.05rem] text-[#e2e8f0]" {...props} />
              ),
              h2: ({node, ...props}) => (
                <h2 
                  className="text-xl md:text-2xl font-bold mt-8 mb-4 drop-shadow-[0_1px_4px_rgba(192,142,90,0.3)]"
                  style={{ color: '#c08e5a' }}
                  {...props}
                />
              ),
              h3: ({node, ...props}) => (
                <h3 
                  className="text-lg md:text-xl font-semibold mt-6 mb-2 text-amber-200/90"
                  {...props}
                />
              ),
              strong: ({node, ...props}) => (
                <strong 
                  className="font-bold text-amber-200/90" 
                  {...props} 
                />
              ),
              li: ({node, ...props}) => (
                <li className="list-disc list-inside mb-1 text-[#e2e8f0]" {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul className="list-disc list-inside mb-4 text-[#e2e8f0]" {...props} />
              ),
              ol: ({node, ...props}) => (
                <ol className="list-decimal list-inside mb-4 text-[#e2e8f0]" {...props} />
              )
            }}
          >
            {cleanedContent}
          </ReactMarkdown>
        </article>
      </div>

      <style>{`
        @keyframes auroraMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};
