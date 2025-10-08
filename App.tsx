import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import MainHeader from './components/MainHeader';
import HomePage from './components/HomePage';
import Glossary from './components/Glossary';
import AtAGlance from './components/AtAGlance';
import AIChat from './components/AIChat';
import Navigation from './components/Navigation';
import ZoomControls from './components/ZoomControls';
import ReadAloudControls from './components/ReadAloudControls';
import PDFGeneratorModal from './components/PDFGeneratorModal';
import LoadingOverlay from './components/LoadingOverlay';
import FullReportRenderer from './components/FullReportRenderer';
import TranslationModal from './components/TranslationModal';
import BookmarksPanel from './components/BookmarksPanel';
import { MENU_ITEMS } from './constants';
import { flattenMenuItems, findMenuItem } from './utils/menu';
import { generatePdfForCurrentSection, generatePdf } from './utils/pdfGenerator';
import { SpeechService } from './utils/speechService';
import { translateText } from './utils/translationService';
import { exportNotesToPdf } from './utils/notesExporter';
import type { MenuItemId } from './types';

type Theme = 'light' | 'dark';

const ZOOM_LEVELS = [0.85, 0.9, 1.0, 1.1, 1.2, 1.3];
const DEFAULT_ZOOM_INDEX = 2; // Corresponds to 1.0

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<MenuItemId>('home');
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev' | 'fade'>('fade');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isAtAGlanceOpen, setIsAtAGlanceOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isGeneratingFullReport, setIsGeneratingFullReport] = useState(false);
  const [history, setHistory] = useState<MenuItemId[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    // The FOUC-prevention script in index.html already sets the class on <html>.
    // We just need to read from the DOM to initialize React's state correctly.
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  const [zoomIndex, setZoomIndex] = useState<number>(() => {
    const storedZoom = localStorage.getItem('zoomLevel');
    if (storedZoom) {
        const level = parseFloat(storedZoom);
        const index = ZOOM_LEVELS.indexOf(level);
        return index !== -1 ? index : DEFAULT_ZOOM_INDEX;
    }
    return DEFAULT_ZOOM_INDEX;
  });
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [speechState, setSpeechState] = useState({ isSpeaking: false, isPaused: false });
  const speechServiceRef = useRef<SpeechService | null>(null);

  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const [bookmarks, setBookmarks] = useState<Set<MenuItemId>>(() => {
    try {
      const saved = localStorage.getItem('report-bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      console.error("Failed to parse bookmarks from localStorage", e);
      return new Set();
    }
  });
  const [isBookmarksPanelOpen, setIsBookmarksPanelOpen] = useState(false);
  
  const [notes, setNotes] = useState<Record<string, { note: string; originalText: string; }>>(() => {
    try {
        const savedNotes = localStorage.getItem('report-notes');
        return savedNotes ? JSON.parse(savedNotes) : {};
    } catch (e) {
        console.error("Failed to parse notes from localStorage", e);
        return {};
    }
  });
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  
  const mainContentRef = useRef<HTMLElement>(null);
  const isNavigatingByScroll = useRef(false); // Throttling flag for scroll navigation
  
  const flatItemsWithHome = useMemo(() => {
    return [{ id: 'home', label: 'Home' }, ...flattenMenuItems()];
  }, []);

  // Initialize Speech Service
  useEffect(() => {
    let service: SpeechService | null = null;
    if ('speechSynthesis' in window && window.speechSynthesis) {
        setIsSpeechSupported(true);
        service = new SpeechService((newState) => {
            setSpeechState({ isSpeaking: newState.isSpeaking, isPaused: newState.isPaused });
        });
        speechServiceRef.current = service;
    } else {
        console.warn('Text-to-speech not supported in this browser.');
    }
    
    return () => {
        service?.destroy();
    };
  }, []);
  
  // Stop speech on navigation
  useEffect(() => {
    speechServiceRef.current?.stop();
  }, [activeItem]);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeItem]);

  useEffect(() => {
    localStorage.setItem('zoomLevel', ZOOM_LEVELS[zoomIndex].toString());
  }, [zoomIndex]);

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
        localStorage.setItem('report-bookmarks', JSON.stringify(Array.from(bookmarks)));
    } catch (e) {
        console.error("Failed to save bookmarks to localStorage", e);
    }
  }, [bookmarks]);

  // Save notes to localStorage
  useEffect(() => {
    try {
        localStorage.setItem('report-notes', JSON.stringify(notes));
    } catch (e) {
        console.error("Failed to save notes to localStorage", e);
    }
  }, [notes]);

  const handleThemeToggle = useCallback(() => {
    // Determine the new theme based on the current state.
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // 1. Update the DOM directly and imperatively.
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // 2. Update localStorage.
    localStorage.setItem('theme', newTheme);
    
    // 3. Update React's state to trigger re-render for components that depend on it (like the icon).
    setTheme(newTheme);
  }, [theme]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleItemSelect = useCallback((id: MenuItemId) => {
    if (id === activeItem) return;

    setHistory(prev => [...prev, activeItem]);

    const currentIndex = flatItemsWithHome.findIndex(item => item.id === activeItem);
    const nextIndex = flatItemsWithHome.findIndex(item => item.id === id);

    if (currentIndex !== -1 && nextIndex !== -1) {
        if (nextIndex > currentIndex) {
            setAnimationDirection('next');
        } else if (nextIndex < currentIndex) {
            setAnimationDirection('prev');
        } else {
            setAnimationDirection('fade');
        }
    } else {
        setAnimationDirection('fade');
    }
    setActiveItem(id);
  }, [activeItem, flatItemsWithHome]);
  
  const handleGoHome = useCallback(() => {
    if (activeItem === 'home') return;

    setHistory(prev => [...prev, activeItem]);
    const currentIndex = flatItemsWithHome.findIndex(item => item.id === activeItem);
    if (currentIndex > 0) {
        setAnimationDirection('prev');
    } else {
        setAnimationDirection('fade');
    }
    setActiveItem('home');
  }, [activeItem, flatItemsWithHome]);

  const handleGoBack = useCallback(() => {
    if (history.length === 0) return;

    const newHistory = [...history];
    const prevItem = newHistory.pop();
    
    if (prevItem) {
        setHistory(newHistory);
        setAnimationDirection('prev');
        setActiveItem(prevItem);
    }
  }, [history]);

  // Effect for scroll-based navigation
  useEffect(() => {
    const mainEl = mainContentRef.current;
    // Do not attach listener on home page
    if (!mainEl || activeItem === 'home') return;

    const handleWheelNavigation = (event: WheelEvent) => {
      // Prevent navigation if already in progress
      if (isNavigatingByScroll.current) {
        event.preventDefault();
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = mainEl;
      // Small buffer to ensure we're truly at the top/bottom
      const scrollThreshold = 5;

      const isAtBottom = scrollTop + clientHeight >= scrollHeight - scrollThreshold;
      const isAtTop = scrollTop <= scrollThreshold;

      const currentIndex = flatItemsWithHome.findIndex(item => item.id === activeItem);
      
      let nextItemId: MenuItemId | null = null;
      let isNavigatingToHome = false;

      // Scrolling Down at the bottom
      if (event.deltaY > 0 && isAtBottom) {
        const nextIndex = currentIndex + 1;
        if (nextIndex < flatItemsWithHome.length) {
          nextItemId = flatItemsWithHome[nextIndex].id;
        }
      } 
      // Scrolling Up at the top
      else if (event.deltaY < 0 && isAtTop) {
        const prevIndex = currentIndex - 1;
        // The first item in flatItemsWithHome is 'home'
        if (prevIndex >= 0) {
          nextItemId = flatItemsWithHome[prevIndex].id;
          if (nextItemId === 'home') {
            isNavigatingToHome = true;
          }
        }
      }

      if (nextItemId) {
        event.preventDefault();
        isNavigatingByScroll.current = true;
        
        if (isNavigatingToHome) {
          handleGoHome();
        } else {
          handleItemSelect(nextItemId);
        }

        // Reset flag after a delay to allow content to transition and render
        setTimeout(() => {
          isNavigatingByScroll.current = false;
        }, 800);
      }
    };
    
    // Add listener with passive: false to allow preventDefault
    mainEl.addEventListener('wheel', handleWheelNavigation, { passive: false });

    return () => {
      mainEl.removeEventListener('wheel', handleWheelNavigation);
    };
  }, [activeItem, flatItemsWithHome, handleItemSelect, handleGoHome]);

  const getAnimationClass = () => {
    switch (animationDirection) {
      case 'next':
        return 'animate-slideInFromRight';
      case 'prev':
        return 'animate-slideInFromLeft';
      default:
        return 'animate-fadeIn';
    }
  };

  const handleZoomIn = () => {
    setZoomIndex(prev => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  };

  const handleZoomOut = () => {
      setZoomIndex(prev => Math.max(prev - 1, 0));
  };

  const handleResetZoom = () => {
      setZoomIndex(DEFAULT_ZOOM_INDEX);
  };

  const handlePdfGeneration = async (type: 'current' | 'full') => {
    setIsPdfModalOpen(false);

    if (type === 'current') {
        setIsLoading(true);
        setLoadingMessage('Generating PDF for current section...');
        
        const sectionTitle = findMenuItem(activeItem)?.label || 'report-section';
        const fileName = `${sectionTitle.replace(/[\s/.:]/g, '_')}.pdf`;

        await generatePdfForCurrentSection('printable-content', fileName);
        
        setIsLoading(false);
        setLoadingMessage('');
    } else if (type === 'full') {
        setLoadingMessage('Preparing full report for download. This may take a few moments...');
        setIsLoading(true);
        setIsGeneratingFullReport(true);
        // The rest of the flow is triggered by onRenderComplete from FullReportRenderer
    }
  };

  const handleFullReportRendered = async (element: HTMLElement) => {
    setLoadingMessage('Generating full report PDF...');
    await generatePdf(element, 'Full_Audit_Report_Bihar_74th_CAA.pdf');
    setIsGeneratingFullReport(false);
    setIsLoading(false);
    setLoadingMessage('');
  };

  // --- Speech Handlers ---
  const handlePlay = useCallback((text: string) => {
    speechServiceRef.current?.speak(text);
  }, []);
  const handlePause = useCallback(() => {
    speechServiceRef.current?.pause();
  }, []);
  const handleResume = useCallback(() => {
    speechServiceRef.current?.resume();
  }, []);
  const handleStop = useCallback(() => {
    speechServiceRef.current?.stop();
  }, []);

  // --- Translation Handlers ---
  const handleTranslate = useCallback(async (text: string) => {
    if (!text) return;
    setTextToTranslate(text);
    setIsTranslationModalOpen(true);
    setIsTranslating(true);
    setTranslatedText('');
    setTranslationError(null);

    try {
      const result = await translateText(text, 'Hindi');
      setTranslatedText(result);
    } catch (e: any) {
      setTranslationError(e.message || 'An unknown error occurred during translation.');
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const handleCloseTranslationModal = () => {
    setIsTranslationModalOpen(false);
    // A small delay before clearing text to avoid visual flicker during closing animation.
    setTimeout(() => { setTextToTranslate(''); setTranslatedText(''); setTranslationError(null); }, 300);
  };

  // --- Bookmark Handlers ---
  const handleToggleBookmark = useCallback((id: MenuItemId) => {
    setBookmarks(prev => {
        const newBookmarks = new Set(prev);
        if (newBookmarks.has(id)) {
            newBookmarks.delete(id);
        } else {
            newBookmarks.add(id);
        }
        return newBookmarks;
    });
  }, []);

  const isBookmarked = (id: MenuItemId) => bookmarks.has(id);
  
  // --- Notes Handlers ---
  const handleDeleteNote = useCallback((id: string) => {
    setNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[id];
        return newNotes;
    });
  }, []);

  const handleUpdateNote = useCallback((id: string, text: string, originalText: string) => {
    const newNoteText = text.trim();
    if (newNoteText) {
      setNotes(prev => ({
        ...prev,
        [id]: { note: newNoteText, originalText }
      }));
    } else {
      handleDeleteNote(id);
    }
  }, [handleDeleteNote]);


  const handleToggleAnnotationMode = useCallback(() => {
    setIsAnnotationMode(prev => !prev);
  }, []);
  
  const handleExportNotes = useCallback(() => {
    exportNotesToPdf(notes, MENU_ITEMS);
  }, [notes]);


  return (
    <div className="h-screen overflow-hidden">
      {isSidebarOpen && (
        <div
          onClick={handleToggleSidebar}
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-20 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
          aria-hidden="true"
        />
      )}

      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
      {isGeneratingFullReport && <FullReportRenderer onRenderComplete={handleFullReportRendered} theme={theme} />}

      {/* Container for Sidebar Group */}
      <div className="fixed inset-y-0 left-0 z-30 pointer-events-none">
        {/* This is the shared, vertically centered container */}
        <div className={`absolute top-1/2 -translate-y-1/2 h-auto max-h-[90vh]
                       transition-transform duration-300 ease-in-out
                       flex items-center
                       ${isSidebarOpen ? 'translate-x-0' : '-translate-x-72'}`}>
          
          {/* Sidebar Panel */}
          <div
            className={`w-72 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm 
                       border border-slate-200/50 dark:border-slate-800/50
                       shadow-lg rounded-r-lg pointer-events-auto 
                       flex flex-col max-h-full overflow-y-auto`}
          >
            <Sidebar 
              isOpen={isSidebarOpen} 
              activeItem={activeItem}
              onItemClick={handleItemSelect}
            />
          </div>
          
          {/* Sidebar Toggle Button */}
          <button
            onClick={handleToggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            // Positioned relative to the parent container
            className={`absolute top-1/2 -translate-y-1/2 -right-10 
                        transition-all duration-300 ease-in-out rounded-lg shadow-lg
                        flex flex-col items-center gap-2 py-4 px-1
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-slate-900
                        bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm border-y border-r border-slate-200/50 dark:border-slate-800/50
                        text-slate-700 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-800/90
                        pointer-events-auto transform hover:scale-105 hover:-translate-y-[calc(50%+5px)] hover:shadow-xl`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={isSidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
            <span
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              className="font-semibold text-sm uppercase tracking-wider"
            >
              Chapters
            </span>
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className={`h-full flex flex-col`}>
        <MainHeader 
          activeItem={activeItem}
          onItemClick={handleItemSelect}
          onGoHome={handleGoHome}
          onGoBack={handleGoBack}
          hasHistory={history.length > 0}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
          onOpenAtAGlance={() => setIsAtAGlanceOpen(true)}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
          onOpenBookmarks={() => setIsBookmarksPanelOpen(true)}
          isAnnotationMode={isAnnotationMode}
          onToggleAnnotationMode={handleToggleAnnotationMode}
          hasNotes={Object.keys(notes).length > 0}
          onExportNotes={handleExportNotes}
        />
        <main ref={mainContentRef} id="main-content" className="flex-grow overflow-y-auto px-24 py-8 relative">
          <div
            key={activeItem}
            className={`zoom-wrapper ${getAnimationClass()}`}
            style={{ '--zoom-factor': ZOOM_LEVELS[zoomIndex] } as React.CSSProperties}
          >
            {activeItem === 'home' ? (
              <HomePage menuItems={MENU_ITEMS} onItemClick={handleItemSelect} />
            ) : (
              <Content 
                activeItem={activeItem} 
                onItemClick={handleItemSelect} 
                isBookmarked={isBookmarked(activeItem)}
                onToggleBookmark={handleToggleBookmark}
                notes={notes}
                onUpdateNote={isAnnotationMode ? handleUpdateNote : undefined}
                onDeleteNote={isAnnotationMode ? handleDeleteNote : undefined}
              />
            )}
          </div>
        </main>
      </div>
       
       {activeItem !== 'home' && (
        <Navigation 
          activeItem={activeItem}
          onItemClick={handleItemSelect}
          mainContentRef={mainContentRef}
        />
       )}
       
       {/* Floating Action Buttons Container */}
       <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
          {isSpeechSupported && (
            <ReadAloudControls
                isSpeaking={speechState.isSpeaking}
                isPaused={speechState.isPaused}
                onPlay={handlePlay}
                onPause={handlePause}
                onResume={handleResume}
                onStop={handleStop}
                onTranslate={handleTranslate}
                mainContentRef={mainContentRef}
                activeItem={activeItem}
            />
          )}
          <ZoomControls 
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            canZoomIn={zoomIndex < ZOOM_LEVELS.length - 1}
            canZoomOut={zoomIndex > 0}
          />
          <button
              onClick={() => setIsAIChatOpen(true)}
              aria-label="Ask AI about the report"
              className="flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:shadow-xl transform transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 focus-visible:ring-offset-slate-900 animate-pulse-glow hover-3d-scale"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Ask AI
          </button>
       </div>

       <Glossary isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
       <AtAGlance isOpen={isAtAGlanceOpen} onClose={() => setIsAtAGlanceOpen(false)} onItemClick={handleItemSelect} />
       <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
       <PDFGeneratorModal 
        isOpen={isPdfModalOpen} 
        onClose={() => setIsPdfModalOpen(false)} 
        onGenerate={handlePdfGeneration}
       />
       <TranslationModal
        isOpen={isTranslationModalOpen}
        onClose={handleCloseTranslationModal}
        originalText={textToTranslate}
        translatedText={translatedText}
        isLoading={isTranslating}
        error={translationError}
       />
       <BookmarksPanel
        isOpen={isBookmarksPanelOpen}
        onClose={() => setIsBookmarksPanelOpen(false)}
        bookmarks={Array.from(bookmarks)}
        onItemClick={(id) => {
            handleItemSelect(id);
            setIsBookmarksPanelOpen(false);
        }}
        onRemoveBookmark={handleToggleBookmark}
       />
    </div>
  );
};

export default App;
