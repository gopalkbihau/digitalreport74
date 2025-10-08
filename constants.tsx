import React from 'react';
import type { MenuItem, GlossaryTerm } from './types';

// --- Icon Components ---
const SummaryIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IntroIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const FrameworkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const ComplianceIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const DevolutionIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
const HRIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const FinanceIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const EffectivenessIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);
const RecommendationsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 017.072 0l-.707.707M12 21a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
);


export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'exec-summary',
    label: 'Executive Summary',
    icon: SummaryIcon,
    description: 'A high-level overview of the audit findings, key issues, and main recommendations.',
  },
  {
    id: 'chapter-1',
    label: 'Chapter I',
    icon: IntroIcon,
    description: 'Introduction, scope, and background of the 74th Constitutional Amendment Act.',
    children: [
      { id: 'ch1-1', label: '1.1 74th Const. Act' },
      { id: 'ch1-2', label: '1.2 Urbanisation in Bihar' },
      { id: 'ch1-3', label: '1.3 Profile of ULBs' },
      { id: 'ch1-4', label: '1.4 Organisational Structure' },
    ],
  },
  {
    id: 'chapter-2',
    label: 'Chapter II',
    icon: FrameworkIcon,
    description: 'Details the audit objectives, criteria, scope, methodology, and organization.',
    children: [
      { id: 'ch2-1', label: '2.1 Audit Objective' },
      { id: 'ch2-2', label: '2.2 Audit Criteria' },
      { id: 'ch2-3', label: '2.3 Audit scope' },
      { id: 'ch2-4', label: '2.4 Acknowledgement' },
      { id: 'ch2-5', label: '2.5 Organisation of findings' },
    ],
  },
  {
    id: 'chapter-3',
    label: 'Chapter III',
    icon: ComplianceIcon,
    description: 'Assesses the State\'s compliance with the provisions of the 74th CAA.',
    children: [
      { id: 'ch3-1', label: '3.1 Comparison of Legislations' },
      { id: 'ch3-2', label: '3.2 Continuance of laws' },
    ],
  },
  {
    id: 'chapter-4',
    label: 'Chapter IV',
    icon: DevolutionIcon,
    description: 'Examines the devolution of functions and the institutional mechanisms in place.',
    children: [
      { id: 'ch4-devolution', label: 'Devolution of functions' },
      { id: 'ch4-1', label: '4.1 Status of devolution' },
      { 
        id: 'ch4-2', 
        label: '4.2 Institutional mechanism', 
        children: [
          { 
            id: 'ch4-2-1', 
            label: '4.2.1 State Election Commission', 
          },
          { id: 'ch4-2-2', label: '4.2.2 District Planning Committee' },
          { id: 'ch4-2-3', label: '4.2.3 Metropolitan Planning Committee' },
          { id: 'ch4-2-4', label: '4.2.4 Property Tax Board' },
        ]
      },
      { 
        id: 'ch4-3', 
        label: '4.3 Powers of the State Government over ULBs', 
      },
      { id: 'ch4-4', label: '4.4 Parastatals' },
    ],
  },
  {
    id: 'chapter-5',
    label: 'Chapter V',
    icon: HRIcon,
    description: 'Analyzes the state of human resources management within Urban Local Bodies.',
    children: [
      { id: 'ch5-hr', label: 'Human resources of ULBs' },
      { id: 'ch5-1', label: '5.1 Limited powers' },
      { id: 'ch5-2', label: '5.2 Recruitment of staff' },
      { id: 'ch5-3', label: '5.3 Administrative powers' },
      { id: 'ch5-4', label: '5.4 Capacity building' },
    ],
  },
  {
    id: 'chapter-6',
    label: 'Chapter VI',
    icon: FinanceIcon,
    description: 'Reviews the financial resources, budgeting, and accounting of ULBs.',
    children: [
      { id: 'ch6-fr', label: 'Financial resources of ULBs' },
      { id: 'ch6-1', label: '6.1 Sources of Revenue' },
      { id: 'ch6-2', label: '6.2 Budget' },
      { id: 'ch6-3', label: '6.3 Expenditure of ULBs' },
      { id: 'ch6-4', label: '6.4 Utilisation certificates' },
      { id: 'ch6-5', label: '6.5 Accounting arrangements' },
    ],
  },
  {
    id: 'chapter-7',
    label: 'Chapter VII',
    icon: EffectivenessIcon,
    description: 'Evaluates the effectiveness of devolved functions like water supply and sanitation.',
    children: [
      { id: 'ch7-effectiveness', label: 'Effectiveness of functions' },
      { id: 'ch7-1', label: '7.1 Water Supply Services' },
      { id: 'ch7-2', label: '7.2 Public health & sanitation' },
      { id: 'ch7-3', label: '7.3 Solid Waste Management' },
    ],
  },
  {
    id: 'recommendations',
    label: 'Recommendations',
    icon: RecommendationsIcon,
    description: 'A consolidated list of all recommendations from the audit report.',
  },
];


export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Urban Local Body',
    abbreviation: 'ULB',
    definition: 'A governing body for a city or town, such as a Municipal Corporation, Municipal Council, or Nagar Panchayat, responsible for local administration and public services.'
  },
  {
    term: '74th Constitutional Amendment Act',
    abbreviation: '74th CAA',
    definition: 'An amendment to the Constitution of India (1992) that grants constitutional status to Urban Local Bodies (ULBs) and aims to strengthen them as units of self-government.'
  },
  {
    term: 'Bihar Municipal Act, 2007',
    abbreviation: 'BMA',
    definition: 'The state legislation in Bihar that provides the legal framework for the constitution, powers, and functions of Urban Local Bodies, enacted in line with the 74th CAA.'
  },
  {
    term: 'State Finance Commission',
    abbreviation: 'SFC',
    definition: 'A constitutional body set up by the State Government to review the financial position of municipalities and make recommendations on the distribution of financial resources between the state and the ULBs.'
  },
  {
    term: 'District Planning Committee',
    abbreviation: 'DPC',
    definition: 'A committee constituted at the district level to consolidate the development plans prepared by Panchayats (rural local bodies) and Municipalities (urban local bodies) in the district.'
  },
  {
    term: 'Metropolitan Planning Committee',
    abbreviation: 'MPC',
    definition: 'A committee required for every metropolitan area (with a population of 10 lakh or more) to prepare a draft development plan for the entire metropolitan region.'
  },
  {
    term: 'Parastatal',
    definition: 'An organization or agency that is owned or controlled wholly or partly by the government, often operating in a commercial manner. In this context, they often perform functions that could be handled by ULBs, creating an overlap of responsibilities.'
  },
  {
    term: 'Urban Development & Housing Department',
    abbreviation: 'UD&HD',
    definition: 'The nodal government department in Bihar responsible for policies, planning, and coordination of urban development and housing across the state.'
  },
  {
    term: 'Empowered Standing Committee',
    abbreviation: 'ESC',
    definition: 'The principal executive body of a Municipality in Bihar, responsible for exercising the executive powers of the local government.'
  },
  {
    term: 'State Election Commission',
    abbreviation: 'SEC',
    definition: 'An autonomous constitutional authority responsible for conducting free and fair elections to Urban Local Bodies and Panchayati Raj Institutions in the state.'
  },
  {
    term: 'Integrated Solid Waste Management',
    abbreviation: 'ISWM',
    definition: 'A comprehensive approach to managing solid waste that includes collection, transportation, processing, recycling, and disposal in an environmentally sound manner.'
  },
  {
    term: 'Service Level Benchmark',
    abbreviation: 'SLB',
    definition: 'A set of standards and performance indicators used to measure the quality, efficiency, and effectiveness of public services (like water supply, sanitation) provided by ULBs.'
  }
];

export const CHAPTER_COLORS: Record<string, string> = {
  'exec-summary': 'bg-rose-50 dark:bg-rose-900/30 border-b-2 border-rose-200 dark:border-rose-700',
  'chapter-1': 'bg-sky-50 dark:bg-sky-900/30 border-b-2 border-sky-200 dark:border-sky-700',
  'chapter-2': 'bg-amber-50 dark:bg-amber-900/30 border-b-2 border-amber-200 dark:border-amber-700',
  'chapter-3': 'bg-emerald-50 dark:bg-emerald-900/30 border-b-2 border-emerald-200 dark:border-emerald-700',
  'chapter-4': 'bg-violet-50 dark:bg-violet-900/30 border-b-2 border-violet-200 dark:border-violet-700',
  'chapter-5': 'bg-fuchsia-50 dark:bg-fuchsia-900/30 border-b-2 border-fuchsia-200 dark:border-fuchsia-700',
  'chapter-6': 'bg-cyan-50 dark:bg-cyan-900/30 border-b-2 border-cyan-200 dark:border-cyan-700',
  'chapter-7': 'bg-lime-50 dark:bg-lime-900/30 border-b-2 border-lime-200 dark:border-lime-700',
  'recommendations': 'bg-orange-50 dark:bg-orange-900/30 border-b-2 border-orange-200 dark:border-orange-700',
};

export const CHAPTER_BORDERS: Record<string, string> = {
  'exec-summary': 'border-t-4 border-rose-200 dark:border-rose-700',
  'chapter-1': 'border-t-4 border-sky-200 dark:border-sky-700',
  'chapter-2': 'border-t-4 border-amber-200 dark:border-amber-700',
  'chapter-3': 'border-t-4 border-emerald-200 dark:border-emerald-700',
  'chapter-4': 'border-t-4 border-violet-200 dark:border-violet-700',
  'chapter-5': 'border-t-4 border-fuchsia-200 dark:border-fuchsia-700',
  'chapter-6': 'border-t-4 border-cyan-200 dark:border-cyan-700',
  'chapter-7': 'border-t-4 border-lime-200 dark:border-lime-700',
  'recommendations': 'border-t-4 border-orange-200 dark:border-orange-700',
};

export const CHAPTER_SECTION_TITLE_BG: Record<string, string> = {
  'exec-summary': 'bg-rose-100/50 dark:bg-rose-900/40',
  'chapter-1': 'bg-sky-100/50 dark:bg-sky-900/40',
  'chapter-2': 'bg-amber-100/50 dark:bg-amber-900/40',
  'chapter-3': 'bg-emerald-100/50 dark:bg-emerald-900/40',
  'chapter-4': 'bg-violet-100/50 dark:bg-violet-900/40',
  'chapter-5': 'bg-fuchsia-100/50 dark:bg-fuchsia-900/40',
  'chapter-6': 'bg-cyan-100/50 dark:bg-cyan-900/40',
  'chapter-7': 'bg-lime-100/50 dark:bg-lime-900/40',
  'recommendations': 'bg-orange-100/50 dark:bg-orange-900/40',
};

export const CHAPTER_SUBTITLE_BG: Record<string, string> = {
  'exec-summary': 'bg-rose-50 dark:bg-slate-800',
  'chapter-1': 'bg-sky-50 dark:bg-slate-800',
  'chapter-2': 'bg-amber-50 dark:bg-slate-800',
  'chapter-3': 'bg-emerald-50 dark:bg-slate-800',
  'chapter-4': 'bg-violet-50 dark:bg-slate-800',
  'chapter-5': 'bg-fuchsia-50 dark:bg-slate-800',
  'chapter-6': 'bg-cyan-50 dark:bg-slate-800',
  'chapter-7': 'bg-lime-50 dark:bg-slate-800',
  'recommendations': 'bg-orange-50 dark:bg-slate-800',
};

export const CHAPTER_SUBTITLE_BORDER_TOP: Record<string, string> = {
  'exec-summary': 'border-t-2 border-rose-100 dark:border-rose-800',
  'chapter-1': 'border-t-2 border-sky-100 dark:border-sky-800',
  'chapter-2': 'border-t-2 border-amber-100 dark:border-amber-800',
  'chapter-3': 'border-t-2 border-emerald-100 dark:border-emerald-800',
  'chapter-4': 'border-t-2 border-violet-100 dark:border-violet-800',
  'chapter-5': 'border-t-2 border-fuchsia-100 dark:border-fuchsia-800',
  'chapter-6': 'border-t-2 border-cyan-100 dark:border-cyan-800',
  'chapter-7': 'border-t-2 border-lime-100 dark:border-lime-800',
  'recommendations': 'border-t-2 border-orange-100 dark:border-orange-800',
};
