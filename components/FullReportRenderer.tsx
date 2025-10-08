import React, { useEffect, useRef } from 'react';
import ExecutiveSummary from './chapters/ExecutiveSummary';
import Chapter1 from './chapters/Chapter1';
import Chapter2 from './chapters/Chapter2';
import Chapter3 from './chapters/Chapter3';
import Chapter4 from './chapters/Chapter4';
import Chapter5 from './chapters/Chapter5';
import Chapter6 from './chapters/Chapter6';
import Chapter7 from './chapters/Chapter7';
import Recommendations from './chapters/Recommendations';

interface FullReportRendererProps {
  onRenderComplete: (element: HTMLElement) => void;
  theme: 'light' | 'dark';
}

const FullReportRenderer: React.FC<FullReportRendererProps> = ({ onRenderComplete, theme }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // This timeout is a pragmatic solution to ensure that all content,
        // especially charts with rendering animations, is fully drawn before
        // html2canvas captures the content. 4 seconds is a safe buffer.
        const timer = setTimeout(() => {
            if (reportRef.current) {
                onRenderComplete(reportRef.current);
            }
        }, 4000);

        return () => clearTimeout(timer);
    }, [onRenderComplete]);

    // This wrapper component provides consistent styling and page breaks for the PDF.
    const ContentWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="max-w-6xl mx-auto text-slate-700 dark:text-slate-300 p-8" style={{ pageBreakBefore: 'always' }}>
            <div className="mb-8">
                <p className="text-lg text-slate-600 dark:text-slate-300">Government of Bihar</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Draft Performance Audit Report: 2024</p>
            </div>
            <div className="flex items-center mb-8 p-4 rounded-lg bg-white dark:bg-transparent border-b-2 border-blue-200 dark:border-slate-700">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h1>
            </div>
            <div className="text-lg leading-relaxed pb-8">
                {children}
            </div>
            <div className="mt-12 text-center text-slate-400 dark:text-slate-500">
                <p>&mdash; End of Section &mdash;</p>
            </div>
        </div>
    );

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#1e293b' : '#f8fafc'; // Tailwind's slate-800 and slate-50

    return (
        // The component is rendered far off-screen so it's not visible to the user.
        // A fixed width helps ensure consistent layout for the PDF capture.
        // We apply the current theme context for the PDF to ensure visual consistency.
        <div 
            className={isDark ? 'dark' : ''}
            style={{ position: 'fixed', left: '-9999px', top: 0, width: '1280px', backgroundColor: bgColor }}
        >
            <div ref={reportRef}>
                {/* Each section is manually rendered to ensure correct order and content. */}
                {/* We pass a no-op function for onItemClick as it's not needed for rendering. */}
                <ContentWrapper title="Executive Summary">
                    <ExecutiveSummary />
                </ContentWrapper>
                <ContentWrapper title="Chapter I: Introduction">
                    <Chapter1 activeItem="chapter-1" onItemClick={() => {}} />
                </ContentWrapper>
                <ContentWrapper title="Chapter II: Audit Objectives and Methodology">
                    <Chapter2 activeItem="chapter-2" onItemClick={() => {}} />
                </ContentWrapper>
                <ContentWrapper title="Chapter III: Compliance with provisions of 74th CAA">
                    <Chapter3 activeItem="chapter-3" onItemClick={() => {}} />
                </ContentWrapper>
                <ContentWrapper title="Chapter IV: Devolution of functions and institutional mechanism">
                    <Chapter4 activeItem="chapter-4" onItemClick={() => {}} />
                </ContentWrapper>
                <ContentWrapper title="Chapter V: Human resources of ULBs">
                    <Chapter5 activeItem="chapter-5" onItemClick={() => {}} />
                </ContentWrapper>
                 <ContentWrapper title="Chapter VI: Financial resources of ULBs">
                    <Chapter6 activeItem="chapter-6" onItemClick={() => {}} />
                </ContentWrapper>
                 <ContentWrapper title="Chapter VII: Effectiveness of devolved functions">
                    <Chapter7 activeItem="chapter-7" onItemClick={() => {}} />
                </ContentWrapper>
                <ContentWrapper title="Consolidated Recommendations">
                    <Recommendations />
                </ContentWrapper>
            </div>
        </div>
    );
};

export default FullReportRenderer;
