import React from 'react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

const ZoomInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" />
    </svg>
);

const ZoomOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
    </svg>
);

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
    </svg>
);

const ZoomButton: React.FC<{ onClick: () => void; children: React.ReactNode; 'aria-label': string; disabled?: boolean }> = ({ children, disabled, ...props }) => (
    <button
        {...props}
        disabled={disabled}
        className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover-3d-scale"
    >
        {children}
    </button>
);


const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, onResetZoom, canZoomIn, canZoomOut }) => {
  return (
    <div className="flex flex-col gap-3">
        <ZoomButton onClick={onZoomIn} aria-label="Zoom In" disabled={!canZoomIn}>
            <ZoomInIcon />
        </ZoomButton>
        <ZoomButton onClick={onZoomOut} aria-label="Zoom Out" disabled={!canZoomOut}>
            <ZoomOutIcon />
        </ZoomButton>
        <ZoomButton onClick={onResetZoom} aria-label="Reset Zoom">
            <ResetIcon />
        </ZoomButton>
    </div>
  );
};

export default ZoomControls;