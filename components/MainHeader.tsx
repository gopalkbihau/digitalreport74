import React, { useMemo } from 'react';
import type { MenuItemId } from '../types';
import { findMenuItemPath } from '../utils/menu';
import Breadcrumbs from './Breadcrumbs';

interface MainHeaderProps {
  activeItem: MenuItemId;
  onItemClick: (id: MenuItemId) => void;
  onGoHome: () => void;
  onGoBack: () => void;
  hasHistory: boolean;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onOpenGlossary: () => void;
  onOpenAtAGlance: () => void;
  onOpenPdfModal: () => void;
  onOpenBookmarks: () => void;
  isAnnotationMode: boolean;
  onToggleAnnotationMode: () => void;
  hasNotes: boolean;
  onExportNotes: () => void;
}

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
const AnimatedThemeIcon: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const isDark = theme === 'dark';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      // Apply a rotation to the whole icon for a smoother feel
      style={{
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: `rotate(${isDark ? 90 : 0}deg)`,
      }}
    >
      {/* Moon path, which cross-fades with the sun */}
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        style={{
          transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isDark ? 1 : 0,
        }}
      />
      
      {/* Sun group, which cross-fades with the moon */}
      <g
        style={{
          transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isDark ? 0 : 1,
        }}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
};
const PrintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
);
const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
);
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);
const BookmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);
const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H4" />
    </svg>
);


const IconButton: React.FC<{ onClick: () => void; children: React.ReactNode; 'aria-label': string; disabled?: boolean; className?: string; }> = ({ children, disabled, className, ...props }) => (
    <button {...props} disabled={disabled} className={`relative p-2 rounded-full text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
        {children}
    </button>
);

const MainHeader: React.FC<MainHeaderProps> = ({ activeItem, onItemClick, onGoHome, onGoBack, hasHistory, theme, onThemeToggle, onOpenGlossary, onOpenAtAGlance, onOpenPdfModal, onOpenBookmarks, isAnnotationMode, onToggleAnnotationMode, hasNotes, onExportNotes }) => {
  const path = useMemo(() => {
    if (typeof activeItem === 'string' && activeItem !== 'home') {
      return findMenuItemPath(activeItem);
    }
    return [];
  }, [activeItem]);
  
  return (
    <header className="px-24 py-3 flex-shrink-0 bg-sky-100 dark:bg-sky-900 border-b border-sky-200 dark:border-sky-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {/* --- LEFT SIDE --- */}
          <div className="flex items-center space-x-2">
            <IconButton onClick={onGoBack} aria-label="Go Back" disabled={!hasHistory}>
                <BackIcon />
            </IconButton>
            <IconButton onClick={onGoHome} aria-label="Go to Home">
              <HomeIcon />
            </IconButton>

            {activeItem !== 'home' ? (
              <Breadcrumbs path={path} onItemClick={onItemClick} />
            ) : null}
          </div>

          {/* --- RIGHT SIDE --- */}
          <div className="flex items-center space-x-2">
            <IconButton onClick={onOpenAtAGlance} aria-label="Open audit at a glance">
                <SparklesIcon />
            </IconButton>
            <IconButton onClick={onThemeToggle} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} className="group">
                <AnimatedThemeIcon theme={theme} />
                <span className="absolute top-full mt-2 w-max bg-slate-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </span>
            </IconButton>
            <IconButton 
                onClick={onToggleAnnotationMode} 
                aria-label="Toggle note mode"
                className={isAnnotationMode ? 'bg-teal-100 dark:bg-slate-700 text-teal-600 dark:text-teal-400' : ''}
            >
                <EditIcon />
            </IconButton>
             <IconButton 
                onClick={onExportNotes} 
                aria-label="Export notes to PDF"
                disabled={!hasNotes}
            >
                <ExportIcon />
            </IconButton>
            <IconButton onClick={onOpenBookmarks} aria-label="Open bookmarks">
                <BookmarkIcon />
            </IconButton>
            <IconButton onClick={onOpenGlossary} aria-label="Open glossary">
                <BookIcon />
            </IconButton>
            <IconButton onClick={onOpenPdfModal} aria-label="Download PDF report">
                <DownloadIcon />
            </IconButton>
            {activeItem !== 'home' && (
                <IconButton onClick={() => window.print()} aria-label="Print section">
                    <PrintIcon />
                </IconButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;