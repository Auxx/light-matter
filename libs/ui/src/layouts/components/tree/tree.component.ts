import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { TreeNode } from '../tree-node/tree-node.component.types';

@Component({
  selector: 'ui-tree',
  imports: [
    TreeNodeComponent
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent<T> {
  readonly nodes = input.required<TreeNode<T>[]>();
}
