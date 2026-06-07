import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output, signal, TemplateRef } from '@angular/core';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { TreeNode } from '../tree-node/tree-node.component.types';
import { TreeLoadRequest } from './tree.component.types';

@Component({
  selector: 'ui-tree',
  imports: [
    TreeNodeComponent,
    NgTemplateOutlet
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent<T> {
  readonly root = input.required<TreeNode<T>>();

  readonly enableLoading = input(false);

  readonly menu = input<TemplateRef<unknown> | null>(null);

  readonly selected = output<TreeNode<T>>();

  readonly loadRequested = output<TreeLoadRequest<T>>();

  protected readonly treeRoot = signal<TreeNode<T> | null>(null);

  constructor() {
    effect(() => this.treeRoot.set(this.root()));
  }

  readonly updateNode = (node: TreeNode<T>) => {
    const root = structuredClone(this.treeRoot());

    if (root === null) {
      return;
    }

    const target = this.findTreeNode([ root ], node.id);

    if (target === null) {
      return;
    }

    target.isLoading = false;
    target.isOpen = true;
    target.label = node.label;
    target.closedIcon = node.closedIcon;
    target.openIcon = node.openIcon;
    target.children = node.children;
    this.treeRoot.set(root);
  };

  protected readonly nodeSelected = (node: TreeNode<T>) => {
    const root = structuredClone(this.treeRoot());

    if (root === null) {
      return;
    }

    const target = this.findTreeNode([ root ], node.id);

    if (target === null) {
      return;
    }

    this.resetNodeSelection([ root ]);
    target.isSelected = true;
    this.selected.emit(target);

    this.toggleNode(target, root);
    this.treeRoot.set(root);
  };

  private readonly findTreeNode = (nodes: TreeNode<T>[], id: T): TreeNode<T> | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      if (node.children !== undefined && node.children.length > 0) {
        const result = this.findTreeNode(node.children, id);

        if (result !== null) {
          return result;
        }
      }
    }

    return null;
  };

  private readonly resetNodeSelection = (nodes: TreeNode<T>[]) => {
    for (const node of nodes) {
      node.isSelected = false;

      if (node.children !== undefined && node.children.length > 0) {
        this.resetNodeSelection(node.children);
      }
    }
  };

  private readonly toggleNode = (node: TreeNode<T>, root: TreeNode<T>) => {
    if (node.isLoading) {
      return;
    }

    if (node.isOpen === true) {
      node.isOpen = false;
      return;
    }

    if (node.children !== undefined) {
      node.isOpen = true;
      return;
    }

    if (this.enableLoading()) {
      node.isLoading = true;
      this.loadRequested.emit({ node, root });
      return;
    }

    node.isOpen = true;
  };
}
