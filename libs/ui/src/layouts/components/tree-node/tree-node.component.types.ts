import { IconName } from '../../../content';

export interface TreeNode<T> {
  id: T;
  label: string;
  closedIcon: IconName;
  openIcon: IconName;

  children?: TreeNode<T>[];
  isOpen?: boolean;
  isSelected?: boolean;
  loader?: (node: TreeNode<T>) => Promise<TreeNode<T>[] | undefined>;
}
