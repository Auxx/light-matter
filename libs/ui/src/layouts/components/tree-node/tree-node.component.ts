import { CdkMenuTrigger } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, computed, input, output, TemplateRef } from '@angular/core';
import { ActionButtonComponent } from '../../../actions';
import { IconComponent, TextComponent } from '../../../content';
import { StopPropagation } from '../../../dom';
import { TreeNode } from './tree-node.component.types';

@Component({
  selector: 'ui-tree-node',
  imports: [
    ActionButtonComponent,
    IconComponent,
    StopPropagation,
    CdkMenuTrigger,
    TextComponent
  ],
  templateUrl: './tree-node.component.html',
  styleUrl: './tree-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--level-offset]': 'offset()',
    '[class.selected]': 'isSelected()',
    '(click)': 'onClick()'
  }
})
export class TreeNodeComponent<T> {
  readonly node = input.required<TreeNode<T>>();

  readonly level = input.required<number>();

  readonly menu = input<TemplateRef<unknown> | null>(null);

  readonly pressed = output<TreeNode<T>>();

  protected readonly offset = computed(() => `calc(${this.level()} * var(--dim-medium) * 3 + var(--dim-medium))`);

  protected readonly icon = computed(() => {
    const node = this.node();

    return node.isLoading
      ? 'arrowClockwise'
      : node.isOpen
      ? node.openIcon
      : node.closedIcon;
  });

  protected readonly isSelected = computed(() => this.node().isSelected === true);

  protected readonly onClick = () => this.pressed.emit(this.node());
}
