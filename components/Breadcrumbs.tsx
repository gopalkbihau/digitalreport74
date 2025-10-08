import React from 'react';
import type { MenuItem, MenuItemId } from '../types';

interface BreadcrumbsProps {
  path: MenuItem[];
  onItemClick: (id: MenuItemId) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onItemClick }) => {
  if (path.length === 0) return null;

  const ChevronIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-x-2 text-sm text-slate-500 dark:text-slate-400">
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <ChevronIcon />}
          <button
            onClick={() => onItemClick(item.id)}
            className={`
              ${index === path.length - 1 ? 'font-semibold text-slate-700 dark:text-slate-200 pointer-events-none' : 'hover:text-teal-600 dark:hover:text-teal-400 transition-colors'}
            `}
            aria-current={index === path.length - 1 ? 'page' : undefined}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;