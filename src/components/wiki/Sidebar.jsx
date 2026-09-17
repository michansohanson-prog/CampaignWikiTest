import React from 'react';
import { useWiki } from '../../context/WikiContext';

/**
 * A navigation sidebar for filtering the wiki by category.
 */
export const Sidebar = ({ categories }) => {
  const { setFilterCategory, activePageId } = useWiki();

  return (
    <aside className="w-full md:w-64 h-fit p-6 bg-slate-800/30 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl flex flex-col">
      <div className="mt-2 mb-12 w-full text-center">
        <div className="ui-heading uppercase tracking-[0.15em] inline-block">
          Categories
        </div>
      </div>

      <nav className="flex flex-col gap-3 w-full items-start">
        {categories.map((type) => {
          const isActive = activePageId === null && type === 'all'; // Simplified check for active
          // You can improve this check to see if the current entry matches the category
          
          return (
            <button
              key={type}
              onClick={() => setFilterCategory(type)}
              className={`text-left px-4 py-2 rounded-lg transition-all duration-200 w-full border ${
                type === 'all' ? 'bg-blue-600/20 border-blue-600/30 text-blue-400' : 
                                 'border-transparent hover:bg-blue-600/20 hover:text-blue-400'
              }`}
            >
              <span className="transition-colors">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
