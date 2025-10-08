import type React from 'react';

export type MenuItemId = string | 'home';

export interface MenuItem {
  id: MenuItemId;
  label: string;
  description?: string;
  icon?: React.FC<{ className?: string }>;
  children?: MenuItem[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  abbreviation?: string;
}
