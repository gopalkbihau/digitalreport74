import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <div 
        role="status"
        aria-live="polite"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10000] flex flex-col items-center justify-center transition-opacity duration-300"
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
      <p className="text-white text-xl font-semibold">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
