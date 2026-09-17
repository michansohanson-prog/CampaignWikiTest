import React from 'react';
import { useWiki } from '../../context/WikiContext';

/**
 * A glassmorphic card component for displaying a single wiki entry.
 */
export const WikiCard = ({ entry, onClick, compact = false }) => {
  const { searchQuery } = useWiki();

  /**
   * Safely highlights search terms using a global regex match.
   */
  const renderHighlightedText = (text) => {
    if (!searchQuery || !text || searchQuery.trim().length < 2) return text;
    
    // We escape the query to prevent it from breaking the Regex if they type special characters like [ ] ( ) * +
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');

    // We split by the match and map it back together
    return text.split(regex).map((part, i) => {
      if (part && part.toLowerCase() === searchQuery.toLowerCase()) {
        return (
          <mark 
            key={i} 
            className="bg-amber-500/30 px-0.5 rounded border border-amber-400/20"
            style={{ display: 'inline', lineHeight: 'inherit' }}
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  // Base styles: Unified behavior for height and layout
  const baseStyles = `p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-amber-700 transition-all duration-200 cursor-pointer group flex flex-col justify-between`;

  // COMPACT (Button) styling
  const compactStyles = "p-3";
  const titleStylesComp = "text-lg font-bold mb-0 leading-tight text-amber-100";
  const summaryStylesComp = "text-[11px] text-slate-400 line-clamp-2 mt-0.5";
  const tagsContainerStyleComp = "mt-1 flex flex-wrap gap-[0.5px]";

  // HIGH DENSITY (Long Tile) styling
  const titleStylesDense = "text-lg font-bold mb-0 leading-tight text-[#c08e5a] drop-shadow-[0_1px_4px_rgba(192,142,90,0.3)] group-hover:text-amber-200 transition-colors"; 
  const summaryStylesDense = "text-[1.05rem] text-[#e2e8f0] line-clamp-2 mt-0.5 leading-loose"; 
  const tagsContainerStyleDense = "mt-auto pt-2 flex flex-wrap gap-1.5";

  return (
    <div className={`${baseStyles} ${compact ? compactStyles : ""}`} onClick={onClick}>
      <div className="flex-grow">
        {/* Title with Highlighting */}
        <h3 className={`group-hover:text-amber-200 transition-colors ${compact ? titleStylesComp : titleStylesDense}`}>
          {renderHighlightedText(entry.title)}
        </h3>

        {!compact ? (
          /* Summary for Long Tiles with Highlighting */
          <p className={summaryStylesDense}>
            {renderHighlightedText(entry.summary || "No summary available.")}
          </p>
        ) : (
          /* Summary/Type for Buttons */
          <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0">
            {entry.type || "Entry"}
          </p>
        )}
      </div>

      {/* Tags */}
      <div className={compact ? tagsContainerStyleComp : tagsContainerStyleDense}>
        {entry.tags?.map((tag, i) => (
          <span 
            key={i} 
            className={`uppercase tracking-wider rounded ${
              compact 
                ? "text-[6px] md:text-[7px] leading-none bg-slate-700 px-0.5 py-0 text-slate-400" 
                : "text-[9px] bg-slate-700/50 px-1.5 py-0.5 border border-slate-600/30 text-slate-400"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
