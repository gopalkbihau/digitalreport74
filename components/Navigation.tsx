import React, { useMemo, useState, useEffect } from 'react';
import type { MenuItemId } from '../types';
import { flattenMenuItems } from '../utils/menu';

interface NavigationProps {
  activeItem: MenuItemId;
  onItemClick: (id: MenuItemId) => void;
  mainContentRef: React.RefObject<HTMLElement>;
}

const Navigation: React.FC<NavigationProps> = ({ activeItem, onItemClick, mainContentRef }) => {
  const flatItems = useMemo(() => flattenMenuItems(), []);
  const currentIndex = useMemo(() => flatItems.findIndex(item => item.id === activeItem), [activeItem, flatItems]);

  const prevItem = currentIndex > 0 ? flatItems[currentIndex - 1] : null;
  const nextItem = currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : null;

  const [buttonContainerStyle, setButtonContainerStyle] = useState({ right: '-100px' });

  useEffect(() => {
    const calculatePosition = () => {
      if (!mainContentRef.current) return;

      const rect = mainContentRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      const paddingOffset = 24; // Corresponds to px-6, placing it inside the main content padding
      const rightPosition = viewportWidth - rect.right + paddingOffset;

      setButtonContainerStyle({
        right: `${rightPosition}px`,
      });
    };

    // Use a debounced handler for resize events to avoid performance issues
    let debounceTimer: number;
    const debouncedCalculatePosition = () => {
        clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(calculatePosition, 50);
    };

    // Calculate initial position and add listeners
    const initialTimeoutId = setTimeout(calculatePosition, 100); 
    window.addEventListener('resize', debouncedCalculatePosition);
    
    // Recalculate after sidebar transition ends
    const transitionTimeoutId = setTimeout(calculatePosition, 350); // duration-300 + buffer

    return () => {
      window.removeEventListener('resize', debouncedCalculatePosition);
      clearTimeout(initialTimeoutId);
      clearTimeout(transitionTimeoutId);
      clearTimeout(debounceTimer);
    };
  }, [mainContentRef, activeItem]);

  const UpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );

  const DownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div
        style={buttonContainerStyle}
        className="fixed top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4"
    >
        {prevItem && (
            <button
                onClick={() => onItemClick(prevItem.id)}
                aria-label={`Previous: ${prevItem.label}`}
                className="p-3 rounded-full bg-transparent hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 transition-all duration-300 ease-in-out"
            >
                <UpIcon />
            </button>
        )}

        {nextItem && (
            <button
                onClick={() => onItemClick(nextItem.id)}
                aria-label={`Next: ${nextItem.label}`}
                className="p-3 rounded-full bg-transparent hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 transition-all duration-300 ease-in-out"
            >
                <DownIcon />
            </button>
        )}
    </div>
  );
};

export default Navigation;