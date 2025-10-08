import React, { useState } from 'react';
import type { MenuItem, MenuItemId } from '../types';

// --- Animated Artwork Components ---

const ExecutiveSummaryArt: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 65C56.0457 65 65 56.0457 65 45C65 33.9543 56.0457 25 45 25C33.9543 25 25 33.9543 25 45C25 56.0457 33.9543 65 45 65Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M60.6062 60.6062L75 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path className="path-to-draw" d="M35 40H55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path className="path-to-draw" style={{ animationDelay: '0.2s' }} d="M35 50H55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);
const Chapter1Art: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path className="path-to-draw" d="M50 20V80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path className="path-to-draw" style={{ animationDelay: '0.2s' }} d="M50 20C30 25 20 40 20 50C20 60 30 75 50 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path className="path-to-draw" style={{ animationDelay: '0.4s' }} d="M50 20C70 25 80 40 80 50C80 60 70 75 50 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);
const Chapter2Art: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="gear-1" style={{ transformOrigin: '35px 35px' }}>
      <circle cx="35" cy="35" r="15" stroke="currentColor" strokeWidth="4"/>
      <path d="M35 20V15 M35 50V55 M50 35H55 M20 35H15 M45.6 24.4L49.5 20.5 M24.4 45.6L20.5 49.5 M24.4 24.4L20.5 20.5 M45.6 45.6L49.5 49.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </g>
    <g className="gear-2" style={{ transformOrigin: '65px 65px' }}>
      <circle cx="65" cy="65" r="20" stroke="currentColor" strokeWidth="4"/>
      <path d="M65 45V40 M65 85V90 M85 65H90 M45 65H40 M79.14 50.86L82.67 47.33 M50.86 79.14L47.33 82.67 M50.86 50.86L47.33 47.33 M79.14 79.14L82.67 82.67" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>
);
const Chapter3Art: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path className="path-to-draw" d="M25 25H75V75H25V25Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path className="path-to-draw" style={{ animationDelay: '0.5s', strokeDasharray: 200 }} d="M35 50L48 63L65 40" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const Chapter4Art: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="4"/>
    <path className="path-to-draw" d="M50 38V20" stroke="currentColor" strokeWidth="4"/>
    <circle cx="50" cy="15" r="5" stroke="currentColor" strokeWidth="3"/>
    <path className="path-to-draw" style={{ animationDelay: '0.2s' }} d="M60 58L75 70" stroke="currentColor" strokeWidth="4"/>
    <circle cx="80" cy="75" r="5" stroke="currentColor" strokeWidth="3"/>
    <path className="path-to-draw" style={{ animationDelay: '0.4s' }} d="M40 58L25 70" stroke="currentColor" strokeWidth="4"/>
    <circle cx="20" cy="75" r="5" stroke="currentColor" strokeWidth="3"/>
  </svg>
);
const Chapter5Art: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="group-hover:opacity-100 opacity-30 transition-opacity duration-500">
      <circle cx="30" cy="35" r="8" stroke="currentColor" strokeWidth="4"/>
      <path d="M18 75C18 60 42 60 42 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </g>
    <g className="group-hover:opacity-100 opacity-60 transition-opacity duration-500" style={{ transitionDelay: '100ms' }}>
      <circle cx="50" cy="30" r="10" stroke="currentColor" strokeWidth="4"/>
      <path d="M35 80C35 60 65 60 65 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </g>
    <g className="group-hover:opacity-100 opacity-30 transition-opacity duration-500" style={{ transitionDelay: '200ms' }}>
      <circle cx="70" cy="35" r="8" stroke="currentColor" strokeWidth="4"/>
      <path d="M58 75C58 60 82 60 82 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>
);
const Chapter6Art: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse className="opacity-0 coin-3" cx="50" cy="75" rx="25" ry="8" fill="currentColor" fillOpacity="0.3"/>
    <ellipse className="opacity-0 coin-2" cx="50" cy="55" rx="25" ry="8" fill="currentColor" fillOpacity="0.3"/>
    <ellipse className="opacity-0 coin-1" cx="50" cy="35" rx="25" ry="8" fill="currentColor" fillOpacity="0.3"/>
  </svg>
);
const Chapter7Art: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="5" fill="currentColor"/>
    <circle className="ripple ripple-1" cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="3"/>
    <circle className="ripple ripple-2" cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="3"/>
    <circle className="ripple ripple-3" cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="3"/>
  </svg>
);

const artworkMap: Record<string, React.FC<{ className?: string }>> = {
  'exec-summary': ExecutiveSummaryArt,
  'chapter-1': Chapter1Art,
  'chapter-2': Chapter2Art,
  'chapter-3': Chapter3Art,
  'chapter-4': Chapter4Art,
  'chapter-5': Chapter5Art,
  'chapter-6': Chapter6Art,
  'chapter-7': Chapter7Art,
};


const colorPalettes = [
  { // Rose (Pink/Red)
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    hoverBg: 'hover:bg-rose-100/80 dark:hover:bg-rose-900/50',
    iconBg: 'bg-rose-200/60 dark:bg-rose-900/40',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'hover:ring-rose-400 dark:hover:ring-rose-500/50',
  },
  { // Sky (Blue)
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    hoverBg: 'hover:bg-sky-100/80 dark:hover:bg-sky-900/50',
    iconBg: 'bg-sky-200/60 dark:bg-sky-900/40',
    text: 'text-sky-600 dark:text-sky-400',
    ring: 'hover:ring-sky-400 dark:hover:ring-sky-500/50',
  },
  { // Amber (Yellow/Orange)
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    hoverBg: 'hover:bg-amber-100/80 dark:hover:bg-amber-900/50',
    iconBg: 'bg-amber-200/60 dark:bg-amber-900/40',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'hover:ring-amber-400 dark:hover:ring-amber-500/50',
  },
  { // Emerald (Green)
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    hoverBg: 'hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50',
    iconBg: 'bg-emerald-200/60 dark:bg-emerald-900/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'hover:ring-emerald-400 dark:hover:ring-emerald-500/50',
  },
  { // Violet
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    hoverBg: 'hover:bg-violet-100/80 dark:hover:bg-violet-900/50',
    iconBg: 'bg-violet-200/60 dark:bg-violet-900/40',
    text: 'text-violet-600 dark:text-violet-400',
    ring: 'hover:ring-violet-400 dark:hover:ring-violet-500/50',
  },
  { // Fuchsia (Pink/Purple)
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
    hoverBg: 'hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-900/50',
    iconBg: 'bg-fuchsia-200/60 dark:bg-fuchsia-900/40',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    ring: 'hover:ring-fuchsia-400 dark:hover:ring-fuchsia-500/50',
  },
  { // Cyan
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    hoverBg: 'hover:bg-cyan-100/80 dark:hover:bg-cyan-900/50',
    iconBg: 'bg-cyan-200/60 dark:bg-cyan-900/40',
    text: 'text-cyan-600 dark:text-cyan-400',
    ring: 'hover:ring-cyan-400 dark:hover:ring-cyan-500/50',
  },
  { // Lime
    bg: 'bg-lime-100 dark:bg-lime-900/30',
    hoverBg: 'hover:bg-lime-100/80 dark:hover:bg-lime-900/50',
    iconBg: 'bg-lime-200/60 dark:bg-lime-900/40',
    text: 'text-lime-600 dark:text-lime-400',
    ring: 'hover:ring-lime-400 dark:hover:ring-lime-500/50',
  }
];


interface InfoStripProps {
  item: MenuItem;
  onItemClick: (id: MenuItemId) => void;
  index: number;
}

const InfoStrip: React.FC<InfoStripProps> = ({ item, onItemClick, index }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const Icon = item.icon;
  const Artwork = artworkMap[item.id] || null;
  const palette = colorPalettes[index % colorPalettes.length];

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { currentTarget: el } = e;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { width, height } = rect;
    const rotateX = ((y / height) - 0.5) * -1 * 15; // Max 7.5 deg tilt
    const rotateY = ((x / width) - 0.5) * 15; // Max 7.5 deg tilt
    
    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
    });
  };

  return (
    <div className="perspective-container">
      <button
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        onClick={() => onItemClick(item.id)}
        className={`group relative w-full flex flex-col md:flex-row md:items-center text-center md:text-left p-4 md:p-6 rounded-lg shadow-sm hover:shadow-lg
                    ring-1 ring-black/5 dark:ring-white/10 ${palette.bg} ${palette.hoverBg} ${palette.ring} 
                    transition-shadow duration-300 card-3d-interactive`}
      >
        {/* Artwork appears on top on mobile, on the right on desktop */}
        {Artwork && (
          <div className="flex order-first md:order-last items-center justify-center flex-shrink-0 w-24 h-24 mx-auto md:mx-0 mb-4 md:mb-0 md:ml-6 transition-all duration-300 transform group-hover:scale-105">
            <Artwork className={`w-full h-full opacity-50 saturate-50 group-hover:opacity-100 group-hover:saturate-100 transition-all duration-500 ${palette.text}`} />
          </div>
        )}

        {/* Main content block (Icon + Text) */}
        <div className="flex-1 flex flex-col md:flex-row items-center md:items-start order-last md:order-first">
          {Icon && (
            <div className={`flex-shrink-0 mb-4 md:mb-0 md:mr-6 p-3 ${palette.iconBg} rounded-full`}>
              <Icon className={`h-8 w-8 ${palette.text}`} />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">{item.label}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              {item.description}
            </p>
          </div>
        </div>

        {/* Chevron for affordance, positioned absolutely on mobile */}
        <div className={`absolute top-4 right-4 md:relative md:top-auto md:right-auto md:ml-4 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:${palette.text} transition-colors`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform md:group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  );
};


interface HomePageProps {
  menuItems: MenuItem[];
  onItemClick: (id: MenuItemId) => void;
}

const HomePage: React.FC<HomePageProps> = ({ menuItems, onItemClick }) => {
  const topLevelItems = menuItems.filter(item => item.id !== 'home');

  return (
    <div id="printable-content" className="max-w-6xl mx-auto px-4 pt-12">
       <div className="text-center mb-16 animate-fadeIn">
        <div className="flex justify-center items-center gap-8 mb-6">
          <div className="flex flex-col items-center">
             <div className="w-24 h-24 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full mb-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">सत्यमेव जयते</p>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Government of India</p>
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Performance Audit Report
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300">
              On the Efficacy of Implementation of the 74th Constitutional Amendment Act in Urban Local Government in Bihar
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full mb-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">बिहार सरकार</p>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Government of Bihar</p>
          </div>
        </div>
        <div className="w-1/2 mx-auto h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
      </div>
      
      <div className="space-y-4">
        {topLevelItems.map((item, index) => (
          <InfoStrip key={item.id} item={item} onItemClick={onItemClick} index={index} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;