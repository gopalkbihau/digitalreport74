import React, { useState, useEffect, useMemo } from 'react';
import { GLOSSARY_TERMS } from '../constants';

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Glossary: React.FC<GlossaryProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTerms = useMemo(() => {
    if (!searchQuery) {
      return GLOSSARY_TERMS;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return GLOSSARY_TERMS.filter(item =>
      item.term.toLowerCase().includes(lowerCaseQuery) ||
      item.abbreviation?.toLowerCase().includes(lowerCaseQuery) ||
      item.definition.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] m-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl transition-all duration-300">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 id="glossary-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Glossary of Terms
          </h2>
          <button
            onClick={onClose}
            aria-label="Close glossary"
            className="p-2 rounded-full text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </header>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Search glossary terms"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <SearchIcon />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {filteredTerms.length > 0 ? (
            <dl className="space-y-6">
              {filteredTerms.map((item) => (
                <div key={item.term}>
                  <dt className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                    {item.term}
                    {item.abbreviation && <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">({item.abbreviation})</span>}
                  </dt>
                  <dd className="mt-1 text-slate-600 dark:text-slate-300">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No terms found for "{searchQuery}".</p>
                <p className="text-sm mt-2">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Glossary;