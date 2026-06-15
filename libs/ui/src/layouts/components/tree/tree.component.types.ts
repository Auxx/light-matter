import { TreeNode } from '../tree-node/tree-node.component.types';

export interface TreeLoadRequest<T> {
  node: TreeNode<T>;
  root: TreeNode<T>;
}
