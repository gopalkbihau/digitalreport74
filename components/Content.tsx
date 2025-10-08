import React, { lazy, Suspense } from 'react';
import type { MenuItemId } from '../types';
import { findMenuItem, findChapterParent } from '../utils/menu';
import { MENU_ITEMS, CHAPTER_COLORS, CHAPTER_BORDERS, CHAPTER_SECTION_TITLE_BG, CHAPTER_SUBTITLE_BG, CHAPTER_SUBTITLE_BORDER_TOP } from '../constants';
import { ChapterStyleContext } from './ChapterStyleContext';

// --- Lazy-loaded Chapter Components ---
const ExecutiveSummary = lazy(() => import('./chapters/ExecutiveSummary'));
const Chapter1 = lazy(() => import('./chapters/Chapter1'));
const Chapter2 = lazy(() => import('./chapters/Chapter2'));
const Chapter3 = lazy(() => import('./chapters/Chapter3'));
const Chapter4 = lazy(() => import('./chapters/Chapter4'));
const Chapter5 = lazy(() => import('./chapters/Chapter5'));
const Chapter6 = lazy(() => import('./chapters/Chapter6'));
const Chapter7 = lazy(() => import('./chapters/Chapter7'));
const Recommendations = lazy(() => import('./chapters/Recommendations'));


// --- Component Registry ---
const componentRegistry: { [key: string]: React.LazyExoticComponent<React.FC<any>> } = {
  'exec-summary': ExecutiveSummary,
  'chapter-1': Chapter1,
  'chapter-2': Chapter2,
  'chapter-3': Chapter3,
  'chapter-4': Chapter4,
  'chapter-5': Chapter5,
  'chapter-6': Chapter6,
  'chapter-7': Chapter7,
  'recommendations': Recommendations,
};

// --- Helper Functions ---
const getComponentInfo = (id: MenuItemId) => {
    if (typeof id !== 'string') return null;

    const menuItem = findMenuItem(id, MENU_ITEMS);
    if (!menuItem) return null;

    const title = menuItem.label;
    
    let ComponentToRender: React.LazyExoticComponent<React.FC<any>> | undefined;

    if (id === 'exec-summary' || id === 'recommendations') {
        ComponentToRender = componentRegistry[id];
    } else {
        const chapterParent = findChapterParent(id);
        if (chapterParent && componentRegistry[chapterParent.id]) {
            ComponentToRender = componentRegistry[chapterParent.id];
        }
    }
    
    return { Component: ComponentToRender, title };
};

const getBorderColorClass = (id: MenuItemId) => {
    if (typeof id !== 'string') return '';
    
    if (CHAPTER_BORDERS[id]) {
        return CHAPTER_BORDERS[id];
    }

    const chapterParent = findChapterParent(id);
    return (chapterParent && CHAPTER_BORDERS[chapterParent.id]) || '';
};

const getChapterColorClasses = (id: MenuItemId) => {
    if (typeof id !== 'string') {
        return { 
            sectionTitleBgClass: 'bg-slate-100 dark:bg-slate-800',
            subTitleBgClass: 'bg-slate-50 dark:bg-slate-800',
            subTitleBorderTopClass: 'border-t-2 border-slate-200 dark:border-slate-700',
        };
    }
    
    let key = id;
    const chapterParent = findChapterParent(id);
    if (chapterParent && CHAPTER_SECTION_TITLE_BG[chapterParent.id]) {
        key = chapterParent.id;
    }

    const sectionTitleBgClass = CHAPTER_SECTION_TITLE_BG[key] || 'bg-slate-100 dark:bg-slate-800';
    const subTitleBgClass = CHAPTER_SUBTITLE_BG[key] || 'bg-slate-50 dark:bg-slate-800';
    const subTitleBorderTopClass = CHAPTER_SUBTITLE_BORDER_TOP[key] || 'border-t-2 border-slate-200 dark:border-slate-700';
    
    return { sectionTitleBgClass, subTitleBgClass, subTitleBorderTopClass };
};

// --- Main Content Component ---
interface ContentProps {
  activeItem: MenuItemId;
  onItemClick: (id: MenuItemId) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: MenuItemId) => void;
  notes: Record<string, { note: string; originalText: string; }>;
  onUpdateNote?: (id: string, text: string, originalText: string) => void;
  onDeleteNote?: (id: string) => void;
}

const Content: React.FC<ContentProps> = ({ 
    activeItem, 
    onItemClick, 
    isBookmarked, 
    onToggleBookmark, 
    notes,
    onUpdateNote,
    onDeleteNote
}) => {
  if (typeof activeItem !== 'string') {
    return null;
  }

  const handleToggleBookmark = () => {
    if (typeof activeItem === 'string') {
        onToggleBookmark(activeItem);
    }
  };

  const info = getComponentInfo(activeItem);
  const title = info?.title || findMenuItem(activeItem)?.label || 'Chapter Overview';
  const Component = info?.Component;
  
  const getHeaderColor = () => {
    if (typeof activeItem !== 'string') {
        return 'bg-white dark:bg-transparent border-b-2 border-teal-200 dark:border-slate-700';
    }
    
    if (activeItem === 'recommendations') {
        return CHAPTER_COLORS['recommendations'];
    }

    const chapterParent = findChapterParent(activeItem);
    return (chapterParent && CHAPTER_COLORS[chapterParent.id]) || 'bg-white dark:bg-transparent border-b-2 border-teal-200 dark:border-slate-700';
  };
  
  const headerColorClass = getHeaderColor();
  const borderColorClass = getBorderColorClass(activeItem);
  const { sectionTitleBgClass, subTitleBgClass, subTitleBorderTopClass } = getChapterColorClasses(activeItem);

  const componentProps = {
    activeItem,
    onItemClick,
    notes,
    onUpdateNote,
    onDeleteNote,
    className: borderColorClass
  };

  return (
    <ContentWrapper title={title} isBookmarked={isBookmarked} onToggleBookmark={handleToggleBookmark} headerColorClass={headerColorClass}>
      <ChapterStyleContext.Provider value={{ sectionTitleBgClass, subTitleBgClass, subTitleBorderTopClass }}>
        <Suspense fallback={<LoadingSpinner />}>
          {Component ? (
            <Component {...componentProps} />
          ) : (
            <div className="mt-12 p-6 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Chapter Overview</h3>
              <p className="text-slate-600 dark:text-slate-300">
                  Please select a specific sub-section from the sidebar menu to view its detailed content.
              </p>
            </div>
          )}
        </Suspense>
      </ChapterStyleContext.Provider>
    </ContentWrapper>
  );
};

// --- Icons for Bookmark Button ---
const BookmarkOutlineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);
const BookmarkFilledIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
);


interface ContentWrapperProps {
  title: string;
  children: React.ReactNode;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  headerColorClass: string;
}
const ContentWrapper: React.FC<ContentWrapperProps> = ({ title, children, isBookmarked, onToggleBookmark, headerColorClass }) => {
    return (
        <div id="printable-content" className="max-w-6xl mx-auto text-slate-700 dark:text-slate-300">
           <div className="mb-8">
            <p className="text-lg text-slate-600 dark:text-slate-300">Government of Bihar</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Draft Performance Audit Report: 2024</p>
          </div>
    
          <div className={`flex items-center justify-between mb-8 p-4 rounded-lg ${headerColorClass}`}>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h1>
            <button
                onClick={onToggleBookmark}
                aria-label={isBookmarked ? 'Remove bookmark from this section' : 'Bookmark this section'}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                className="p-2 rounded-full text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-700 transition-colors"
            >
                {isBookmarked ? <BookmarkFilledIcon /> : <BookmarkOutlineIcon />}
            </button>
          </div>
          
          <div className="text-lg leading-relaxed pb-8">
            {children}
          </div>
           
          <div className="mt-12 text-center text-slate-400 dark:text-slate-500">
              <p>&mdash; End of Section &mdash;</p>
          </div>
        </div>
      );
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
    </div>
);


export default Content;