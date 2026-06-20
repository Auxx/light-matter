import { TreeNode } from '@light-matter/ui';
import { allSortDirections, allSortTypes, SortDirection, SortType } from 'internal-api';

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

export interface SortMode {
  sortBy: SortType;
  sortDir: SortDirection;
}

export const defaultSortMode = (): SortMode => ({
  sortBy: allSortTypes[0],
  sortDir: allSortDirections[0]
});
