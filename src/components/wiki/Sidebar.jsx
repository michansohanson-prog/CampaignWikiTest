import React from 'react';

/**
 * A navigation component for filtering the wiki by category.
 * Refactored to use a centered flex-wrap layout with canonical Tailwind classes.
 */
export const Sidebar = ({ categories, onFilterChange }) => {
  return (
    /* 
       LAYOUT CHANGES:
       1. Removed the fixed max-width and 'aside' behavior that anchors it to the left.
       2. Added mx-auto to ensure it always centers itself in its parent container.
    */
    <nav className="w-full mx-auto p-1 bg-slate-800/30 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl">
      <div className="flex flex-wrap justify-center gap-2 w-full max-w-full mx-auto">
        {categories.map((type) => {
          return (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              /* 
                 UI CHANGES:
                 - Added min-w-15 to satisfy the linter and ensure buttons are uniform.
                 - Replaced flex-grow with grow for standard Tailwind syntax.
              */
              className="grow justify-center py-2 px-3 rounded-md border transition-all duration-200 text-[10px] md:text-sm font-medium 
                hover:bg-blue-600/20 hover:border-blue-600/30 
                active:scale-95 min-w-15"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
