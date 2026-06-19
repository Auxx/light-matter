import { TreeNode } from '@light-matter/ui';

export const galleryRoot = (): TreeNode<string> => ({
  id: '',
  label: 'My PC',
  openIcon: 'desktop',
  closedIcon: 'desktop',
  isOpen: true,
  children: []
});

export const treeNode = (location: string, hideMenu: boolean): TreeNode<string> => ({
  id: location,
  label: formatLocationName(location),
  openIcon: 'folderOpen',
  closedIcon: 'folder',
  hideMenu
});

export const formatLocationName = (value: string): string => value.split(/[/\\]/g).pop() ?? value;

export const allSortTypes = [ 'date', 'name', 'size' ] as const;
export type SortType = typeof allSortTypes[number];

export const allSortDirections = [ 'desc', 'asc' ] as const;
export type SortDirection = typeof allSortDirections[number];
