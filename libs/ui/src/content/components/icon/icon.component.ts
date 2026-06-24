import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { allExtendedSizes, ExtendedSize } from '../../types/size.types';
import { allVariants, Variant } from '../../types/variant.types';
import { allThicknesses, Thickness } from './icon.component.types';
import { iconMapping, IconName } from './icons/icon.mapping';

@Component({
  selector: 'ui-icon',
  imports: [],
  template: ``,
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[innerHTML]': 'iconCode()',
    '[style.--icon-size]': '`var(--icon-size-${size()})`',
    '[style.--stroke-width]': 'strokeWidth()',
    '[style.--color]': 'color()'
  }
})
export class IconComponent {
  readonly icon = input.required<IconName | 'EMPTY'>();

  readonly size = input<ExtendedSize>(allExtendedSizes[0]);

  readonly variant = input<Variant>(allVariants[0]);

  readonly thickness = input<Thickness>(allThicknesses[0]);

  readonly inherit = input(false);

  protected readonly iconCode = computed(() => {
    const icon = this.icon();

    if (icon === 'EMPTY') {
      return '';
    }

    return this.sanitizer.bypassSecurityTrustHtml(iconMapping[icon]);
  });

  protected readonly strokeWidth = computed(() => {
    switch (this.thickness()) {
      case 'medium':
        return '0.5px';
      case 'thin':
        return '0';
    }
  });

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly color = computed(() => {
    const inherit = this.inherit();
    const variant = this.variant();

    return inherit
      ? 'currentColor'
      : `var(--color-content-${variant}-highest)`;
  });
}
