import React, { useEffect } from 'react';
import { StatCard } from './Charts';
import type { MenuItemId } from '../types';


interface AtAGlanceProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (id: MenuItemId) => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AtAGlance: React.FC<AtAGlanceProps> = ({ isOpen, onClose, onItemClick }) => {

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

  const handleStatClick = (id: MenuItemId) => {
    onItemClick(id);
    onClose();
  }

  const keyStats = [
    { value: '92%', label: 'Overall Staff Vacancy', id: 'ch5-2' },
    { value: '86.2%', label: 'Dependency on Grants', id: 'ch6-1' },
    { value: '8.74%', label: 'Own Revenue Contribution', id: 'ch6-1' },
    { value: '76%', label: 'ESC Meeting Shortfall', id: 'ch4-2-1-6' },
    { value: '0/9', label: 'Water SLBs Achieved', id: 'ch7-1' },
    { value: '0', label: 'Sanitary Landfills Available', id: 'ch7-3' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glance-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] m-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl transition-all duration-300">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 id="glance-title" className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            Audit at a Glance
          </h2>
          <button
            onClick={onClose}
            aria-label="Close summary"
            className="p-2 rounded-full text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
            <p className="text-center mb-6 text-slate-600 dark:text-slate-300">A high-level overview of the most critical findings from the performance audit. Click on any stat to jump to the relevant section.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {keyStats.map(stat => (
                    <StatCard key={stat.label} value={stat.value} label={stat.label} onClick={() => handleStatClick(stat.id)} />
                ))}
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Core Conclusions</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                    <li><strong className="font-semibold text-slate-700 dark:text-slate-200">Institutional Weakness:</strong> Devolution of functions remains incomplete, and key committees are often non-functional, hindering local governance.</li>
                    <li><strong className="font-semibold text-slate-700 dark:text-slate-200">Financial Dependency:</strong> Urban Local Bodies are critically dependent on state grants and have failed to develop their own revenue sources, limiting their autonomy.</li>
                    <li><strong className="font-semibold text-slate-700 dark:text-slate-200">Resource Gaps:</strong> Severe staff shortages and a lack of capacity-building cripple the ability of ULBs to perform their duties effectively.</li>
                    <li><strong className="font-semibold text-slate-700 dark:text-slate-200">Poor Service Delivery:</strong> Basic services like water supply, sanitation, and waste management fail to meet established benchmarks, directly impacting citizens.</li>
                </ul>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AtAGlance;