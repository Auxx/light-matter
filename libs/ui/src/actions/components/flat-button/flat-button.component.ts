import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { allSizes, allVariants, Size, Variant } from '../../../content';
import { allButtonTypes, ButtonType } from '../../types/button.types';

@Component({
  selector: 'ui-flat-button',
  imports: [],
  templateUrl: './flat-button.component.html',
  styleUrl: './flat-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'disabled()',
    '[class.compact]': 'compact()',
    '[class.size-small]': 'size() === "small"',
    '[class.size-medium]': 'size() === "medium"',
    '[class.size-large]': 'size() === "large"',
    '[style.--text-color]': 'textColor()',
    '[style.--disabled-text-color]': 'disabledTextColor()',
    '[style.--background-color]': 'backgroundColor()',
    '[style.--disabled-background-color]': 'disabledBackgroundColor()'
  }
})
export class FlatButtonComponent {
  readonly variant = input<Variant>(allVariants[0]);

  readonly type = input<ButtonType>(allButtonTypes[0]);

  readonly size = input<Size>(allSizes[0]);

  readonly compact = input(false);

  readonly disabled = input(false);

  readonly pressed = output();

  protected readonly textColor = computed(() => `var(--color-contrast-${this.variant()}-highest)`);

  protected readonly disabledTextColor = computed(() => `var(--color-contrast-${this.variant()}-low)`);

  protected readonly backgroundColor = computed(() => `var(--color-element-${this.variant()}-low)`);

  protected readonly disabledBackgroundColor = computed(() => `var(--color-element-${this.variant()}-high)`);
}
