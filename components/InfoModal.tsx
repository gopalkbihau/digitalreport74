import React, { useEffect } from 'react';
import type { MenuItemId } from '../types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  linkId?: MenuItemId | null;
  onLinkClick?: (id: MenuItemId) => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, children, linkId, onLinkClick }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }
    
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };


    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl transition-all duration-300 animate-fadeIn border border-slate-200 dark:border-slate-700">
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <h2 id="info-modal-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-700 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {children}
                </div>

                {linkId && onLinkClick && (
                    <footer className="p-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 flex justify-end">
                         <button
                            onClick={() => onLinkClick(linkId)}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors text-sm"
                        >
                            Read More &rarr;
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default InfoModal;
