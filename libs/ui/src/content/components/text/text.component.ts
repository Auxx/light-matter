import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { allVariants, Variant } from '../../types/variant.types';

@Component({
  selector: 'ui-text',
  imports: [],
  template: `<ng-content/>`,
  styleUrl: './text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--color]': 'color()',
    '[class.important]': 'important()',
    '[class.multi-line]': 'multiLine()'
  }
})
export class TextComponent {
  readonly variant = input<Variant>(allVariants[0]);

  readonly important = input(false);

  readonly multiLine = input(false);

  readonly inherit = input(false);

  protected readonly color = computed(() => {
    const inherit = this.inherit();
    const variant = this.variant();

    return inherit
      ? 'currentColor'
      : `var(--color-content-${variant}-highest)`;
  });
}
