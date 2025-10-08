import React from 'react';

interface ChapterStyle {
  sectionTitleBgClass: string;
  subTitleBgClass: string;
  subTitleBorderTopClass: string;
}

const defaultStyle: ChapterStyle = {
  sectionTitleBgClass: 'bg-slate-100 dark:bg-slate-800',
  subTitleBgClass: 'bg-slate-50 dark:bg-slate-800',
  subTitleBorderTopClass: 'border-t-2 border-slate-200 dark:border-slate-700',
};

export const ChapterStyleContext = React.createContext<ChapterStyle>(defaultStyle);
