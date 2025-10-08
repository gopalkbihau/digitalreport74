import React from 'react';

interface PDFGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (type: 'current' | 'full') => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);

const PDFGeneratorModal: React.FC<PDFGeneratorModalProps> = ({ isOpen, onClose, onGenerate }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] m-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl transition-all duration-300 animate-fadeIn">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 id="pdf-modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <DownloadIcon />
            Generate PDF Report
          </h2>
          <button
            onClick={onClose}
            aria-label="Close PDF options"
            className="p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
            <p className="text-center mb-6 text-slate-600 dark:text-slate-300">Select which version of the report you would like to download as a PDF.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => onGenerate('current')}
                    className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-400 transition-all"
                >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Current Section</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Download a PDF of the section you are currently viewing.</p>
                </button>
                <button
                    onClick={() => onGenerate('full')}
                    className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-400 transition-all"
                >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Full Report</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Download the complete audit report with all chapters.</p>
                </button>
            </div>
             <p className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500">Note: Generating the full report may take a few moments.</p>
        </div>
      </div>
    </div>
  );
};

export default PDFGeneratorModal;
