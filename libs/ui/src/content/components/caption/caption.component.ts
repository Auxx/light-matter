import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { allVariants, Variant } from '../../types/variant.types';

@Component({
  selector: 'ui-caption',
  imports: [],
  template: `<ng-content/>`,
  styleUrl: './caption.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--color]': 'color()'
  }
})
export class CaptionComponent {
  readonly variant = input<Variant>(allVariants[0]);

  protected readonly color = computed(() => `var(--content-${this.variant()}-lowest)`);
}
