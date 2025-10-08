import React, { useState, useEffect, useMemo } from 'react';
import { MENU_ITEMS } from '../constants';
import { filterMenuItems, getAncestorIds, isDescendantActive } from '../utils/menu';
import type { MenuItemId, MenuItem } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activeItem: MenuItemId;
  onItemClick: (id: MenuItemId) => void;
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeItem, onItemClick }) => {
  const [openItems, setOpenItems] = useState<Set<MenuItemId>>(() => getAncestorIds(activeItem));
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => filterMenuItems(MENU_ITEMS, searchQuery), [searchQuery]);

  useEffect(() => {
    if (searchQuery) return; // Don't change open state based on active item while searching
    
    const ancestorIds = getAncestorIds(activeItem);

    // Helper to find the menu item object by its ID
    const findItem = (items: MenuItem[], id: MenuItemId): MenuItem | undefined => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findItem(item.children, id);
                if (found) return found;
            }
        }
        return undefined;
    };
    
    // If the active item itself is a parent, it needs to be in the open set to show its children
    const currentItem = findItem(MENU_ITEMS, activeItem);
    if (currentItem?.children) {
        ancestorIds.add(activeItem);
    }
    
    setOpenItems(ancestorIds);
  }, [activeItem, searchQuery]);

  const handleParentClick = (id: MenuItemId) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      const isTopLevel = MENU_ITEMS.some(item => item.id === id);

      if (newSet.has(id)) {
        newSet.delete(id); // Just close it if it's already open
      } else {
        if (isTopLevel) {
          // Close all other top-level items for accordion effect
          MENU_ITEMS.forEach(item => {
            if (item.id !== id) {
              newSet.delete(item.id);
            }
          });
        }
        newSet.add(id); // Open the clicked one
      }
      return newSet;
    });
  };

  const ChevronIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => {
        const hasChildren = !!item.children?.length;
        // Auto-expand all parent items when a search is active.
        const isParentOpen = searchQuery ? true : openItems.has(item.id);
        const isChildActive = hasChildren && isDescendantActive(item.id, activeItem);
        const isActive = activeItem === item.id;

        const handleItemClick = () => {
          onItemClick(item.id);
          if (hasChildren && !searchQuery) { // Don't toggle when search is active
            handleParentClick(item.id);
          }
        };

        return (
          <li key={item.id} className="relative">
             {/* Tree connecting line for sub-items */}
             {level > 0 && (
                <span className="absolute -left-px top-0 h-full w-px bg-teal-100/50 dark:bg-slate-700/50" aria-hidden="true" />
             )}
             {level > 0 && (
                <span className="absolute -left-px top-[1.125rem] h-px w-3 bg-teal-100/50 dark:bg-slate-700/50" aria-hidden="true" />
             )}
            
            {/* Active item indicator */}
            {isActive && (
                <span className="absolute left-[calc(0.5rem-1px)] top-1/2 -translate-y-1/2 h-6 w-1 bg-teal-500 rounded-r-full" />
            )}
            
            <button
              onClick={handleItemClick}
              aria-expanded={hasChildren ? isParentOpen : undefined}
              aria-label={item.label}
              className={`flex items-center w-full rounded-md transition-all duration-200 group relative
                ${level === 0 ? 'py-3 px-3' : 'py-2.5 pr-2 pl-4'}
                ${isActive ? 'bg-teal-50 text-teal-700 dark:bg-slate-800/80 dark:text-teal-400 font-semibold' : isChildActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-slate-800/80'}`}
            >
              <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
              {hasChildren && (
                <ChevronIcon className={`ml-auto transform transition-transform duration-200 ${isParentOpen ? 'rotate-90' : ''} ${isChildActive || isActive ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              )}
            </button>

            {hasChildren && (
              <div className={`pl-5 transition-all duration-300 ease-in-out overflow-hidden ${isParentOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                 <ul className="space-y-1 pt-1">
                    {renderMenuItems(item.children, level + 1)}
                 </ul>
              </div>
            )}
          </li>
        );
    });
  }

  return (
    <div
      className="flex flex-col"
    >
      <div className={`px-4 pt-4 pb-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="relative">
              <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <SearchIcon />
              </div>
          </div>
      </div>

      <nav className="px-2 py-2">
        <ul className="space-y-1">
            {renderMenuItems(filteredItems)}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;