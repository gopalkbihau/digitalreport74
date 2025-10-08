import React, { useMemo } from 'react';
import type { MenuItemId } from '../types';
import { findMenuItem } from '../utils/menu';

// --- Icons ---
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const BookmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);


interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: MenuItemId[];
  onItemClick: (id: MenuItemId) => void;
  onRemoveBookmark: (id: MenuItemId) => void;
}

const BookmarksPanel: React.FC<BookmarksPanelProps> = ({ isOpen, onClose, bookmarks, onItemClick, onRemoveBookmark }) => {
    if (!isOpen) return null;

    const bookmarkedItems = useMemo(() => {
        return bookmarks.map(id => findMenuItem(id)).filter((item): item is NonNullable<typeof item> => !!item);
    }, [bookmarks]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookmarks-title"
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Panel */}
            <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] m-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl transition-all duration-300">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <h2 id="bookmarks-title" className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <BookmarkIcon />
                        Saved Bookmarks
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close bookmarks"
                        className="p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-700 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {bookmarkedItems.length > 0 ? (
                        <ul className="space-y-2">
                            {bookmarkedItems.map(item => (
                                <li key={item.id} className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <button onClick={() => onItemClick(item.id)} className="text-left flex-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                                    </button>
                                    <button
                                        onClick={() => onRemoveBookmark(item.id)}
                                        aria-label={`Remove ${item.label} from bookmarks`}
                                        title={`Remove bookmark`}
                                        className="p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:text-blue-400 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <p>You have no saved bookmarks yet.</p>
                            <p className="text-sm mt-2">Click the bookmark icon next to a section title to save it here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookmarksPanel;
