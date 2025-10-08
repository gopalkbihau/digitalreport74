import React, { useState, useEffect } from 'react';
import type { MenuItemId } from '../types';

// --- Icons ---
const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);
const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
    </svg>
);
const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.254 9.254 9 9.563 9h4.874c.309 0 .563.254.563.563v4.874c0 .309-.254.563-.563.563H9.563A.563.563 0 019 14.437V9.563z" />
    </svg>
);
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const TranslateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10-5-10M17 21l5-10-5-10" />
    </svg>
);

// --- Reusable Button Component ---
const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; 'aria-label': string; title: string; disabled?: boolean }> = ({ children, disabled, ...props }) => (
    <button
        {...props}
        disabled={disabled}
        className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover-3d-scale"
    >
        {children}
    </button>
);

// --- Main Component ---
interface ReadAloudControlsProps {
    isSpeaking: boolean;
    isPaused: boolean;
    onPlay: (text: string) => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
    onTranslate: (text: string) => void;
    mainContentRef: React.RefObject<HTMLElement>;
    activeItem: MenuItemId;
}

const ReadAloudControls: React.FC<ReadAloudControlsProps> = ({
    isSpeaking,
    isPaused,
    onPlay,
    onPause,
    onResume,
    onStop,
    onTranslate,
    mainContentRef,
    activeItem,
}) => {
    const [selectedText, setSelectedText] = useState('');
    // Default to true to avoid buttons appearing disabled on load
    const [hasPageContent, setHasPageContent] = useState(true);
    
    useEffect(() => {
        const handleSelectionChange = () => {
            const text = window.getSelection()?.toString().trim() ?? '';
            setSelectedText(text);
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    // Re-check for content whenever the active item changes, after a short delay
    // to allow for content rendering and animations.
    useEffect(() => {
        const checkContentAvailability = () => {
             const content = mainContentRef.current?.querySelector('#printable-content')?.textContent?.trim();
             setHasPageContent(!!content);
        };
        // Use a timeout to wait for lazy-loaded content and CSS transitions to finish.
        const timer = setTimeout(checkContentAvailability, 500);
        return () => clearTimeout(timer);

    }, [activeItem, mainContentRef]);


    const handlePlay = () => {
        if (selectedText) {
            onPlay(selectedText);
        } else if (mainContentRef.current) {
            const contentElement = mainContentRef.current.querySelector('#printable-content');
            if (contentElement instanceof HTMLElement) {
                onPlay(contentElement.innerText);
            }
        }
    };
    
    const handleTranslate = () => {
        if (selectedText) {
            onTranslate(selectedText);
        } else if (mainContentRef.current) {
            const contentElement = mainContentRef.current.querySelector('#printable-content');
            if (contentElement instanceof HTMLElement) {
                onTranslate(contentElement.innerText);
            }
        }
    };

    const hasContentToPlay = !!selectedText || hasPageContent;
    const canTranslate = !!selectedText || hasPageContent;

    if (!isSpeaking) {
        return (
            <div className="flex flex-col gap-3">
                <ControlButton 
                    onClick={handlePlay} 
                    aria-label={selectedText ? "Read selected text" : "Read page content aloud"}
                    title={selectedText ? "Read selected text" : "Read page content aloud"}
                    disabled={!hasContentToPlay}
                >
                    <SpeakerIcon />
                </ControlButton>
                <ControlButton
                    onClick={handleTranslate}
                    aria-label={selectedText ? "Translate selected text to Hindi" : "Translate page content to Hindi"}
                    title={selectedText ? "Translate selected text to Hindi" : "Translate page content to Hindi"}
                    disabled={!canTranslate}
                >
                    <TranslateIcon />
                </ControlButton>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-3">
             <ControlButton
                onClick={isPaused ? onResume : onPause}
                aria-label={isPaused ? 'Resume reading' : 'Pause reading'}
                title={isPaused ? 'Resume reading' : 'Pause reading'}
            >
                {isPaused ? <PlayIcon /> : <PauseIcon />}
            </ControlButton>

            <ControlButton onClick={onStop} aria-label="Stop reading" title="Stop reading">
                <StopIcon />
            </ControlButton>
        </div>
    );
};

export default ReadAloudControls;
