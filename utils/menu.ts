import type { MenuItem, MenuItemId } from '../types';
import { MENU_ITEMS } from '../constants';

// --- Create a Parent Map for efficient lookups ---
export const parentMap = new Map<MenuItemId, MenuItemId>();
const buildParentMap = (items: MenuItem[], parentId: MenuItemId | null = null) => {
    for (const item of items) {
        if (parentId) {
            parentMap.set(item.id, parentId);
        }
        if (item.children) {
            buildParentMap(item.children, item.id);
        }
    }
};
buildParentMap(MENU_ITEMS); // Build the map once on module load

// --- Flatten Menu Items ---
export const flattenMenuItems = (): MenuItem[] => {
  const flattened: MenuItem[] = [];
  const recurse = (items: MenuItem[]) => {
    for (const item of items) {
      flattened.push(item);
      if (item.children) {
        recurse(item.children);
      }
    }
  };
  recurse(MENU_ITEMS);
  return flattened;
};

// --- Find Menu Item by ID ---
export const findMenuItem = (id: MenuItemId, items: MenuItem[] = MENU_ITEMS): MenuItem | null => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findMenuItem(id, item.children);
      if (found) return found;
    }
  }
  return null;
};

// --- Find Root Chapter Parent ---
// Traverses up from any child ID to find its top-level chapter object.
export const findChapterParent = (id: MenuItemId): MenuItem | null => {
  let currentId: MenuItemId | undefined = id;
  let parentId: MenuItemId | undefined;

  // Walk up the tree using the map until we find an item with no parent in the map (a top-level item)
  while (currentId) {
    parentId = parentMap.get(currentId);
    if (!parentId) {
      break; 
    }
    currentId = parentId;
  }

  // Find the actual menu item object for that top-level ID
  if (currentId) {
    return MENU_ITEMS.find(item => item.id === currentId) || null;
  }

  return null;
};


// --- Find Menu Item Path for Breadcrumbs ---
export const findMenuItemPath = (id: MenuItemId): MenuItem[] => {
  const findPath = (items: MenuItem[], targetId: MenuItemId, path: MenuItem[]): MenuItem[] | null => {
    for (const item of items) {
      const newPath = [...path, item];
      if (item.id === targetId) {
        return newPath;
      }
      if (item.children) {
        const foundPath = findPath(item.children, targetId, newPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
    return null;
  };
  return findPath(MENU_ITEMS, id, []) || [];
};

// --- Filter Menu Items for Search ---
export const filterMenuItems = (items: MenuItem[], query: string): MenuItem[] => {
    if (!query) {
      return items;
    }
  
    const lowerCaseQuery = query.toLowerCase();
  
    const filter = (items: MenuItem[]): MenuItem[] => {
      const result: MenuItem[] = [];
      for (const item of items) {
        const hasChildren = !!item.children?.length;
        
        let children: MenuItem[] = [];
        if (hasChildren) {
          children = filter(item.children!);
        }
  
        const labelMatches = item.label.toLowerCase().includes(lowerCaseQuery);
        
        if (labelMatches || children.length > 0) {
          result.push({ ...item, children: children });
        }
      }
      return result;
    };
  
    return filter(items);
};


// --- Sidebar-specific Helpers using the shared parentMap ---
export const getAncestorIds = (itemId: MenuItemId): Set<MenuItemId> => {
    const ancestors = new Set<MenuItemId>();
    let currentId: MenuItemId | undefined = itemId;
    while (currentId && (currentId = parentMap.get(currentId))) {
        ancestors.add(currentId);
    }
    return ancestors;
};

export const isDescendantActive = (itemId: MenuItemId, activeId: MenuItemId): boolean => {
    let currentId: MenuItemId | undefined = activeId;
    while (currentId && (currentId = parentMap.get(currentId))) {
        if (currentId === itemId) {
            return true;
        }
    }
    return false;
};
