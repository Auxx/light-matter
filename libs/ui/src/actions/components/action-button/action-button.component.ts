import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { allSizes, Size } from '../../../content/types/size.types';
import { allVariants, Variant } from '../../../content/types/variant.types';
import { allButtonTypes, ButtonType } from '../../types/button.types';

@Component({
  selector: 'ui-action-button',
  imports: [],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'disabled()',
    '[class.size-small]': 'size() === "small"',
    '[class.size-medium]': 'size() === "medium"',
    '[class.size-large]': 'size() === "large"',
    '[style.--color]': 'color()'
  }
})
export class ActionButtonComponent {
  readonly variant = input<Variant>(allVariants[0]);

  readonly type = input<ButtonType>(allButtonTypes[0]);

  readonly size = input<Size>(allSizes[0]);

  readonly disabled = input(false);

  protected readonly color = computed(() => `var(--element-${this.variant()}-low)`);
}
