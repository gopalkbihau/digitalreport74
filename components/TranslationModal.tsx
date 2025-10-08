import React from 'react';

// Icons
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const LanguageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10-5-10M17 21l5-10-5-10" />
    </svg>
);

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  translatedText: string;
  isLoading: boolean;
  error: string | null;
}

const TranslationModal: React.FC<TranslationModalProps> = ({ isOpen, onClose, originalText, translatedText, isLoading, error }) => {
    if (!isOpen) return null;

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="translation-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl animate-fadeIn border border-slate-200 dark:border-slate-700">
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <h2 id="translation-modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <LanguageIcon />
                        Translate to Hindi
                    </h2>
                    <button onClick={onClose} aria-label="Close translation" className="p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Original Text (English)</h3>
                        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md text-slate-600 dark:text-slate-300">
                            <p className="italic">"{originalText}"</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Translation (Hindi)</h3>
                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md text-slate-800 dark:text-slate-200 min-h-[6rem] flex items-center justify-center">
                            {isLoading && (
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            )}
                            {error && (
                                <div className="w-full text-center p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                  <p>{error}</p>
                                </div>
                            )}
                            {!isLoading && !error && (
                                <p className="text-lg" lang="hi">{translatedText}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslationModal;
