import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { allExtendedSizes, ExtendedSize } from '../../types/size.types';
import { allVariants, Variant } from '../../types/variant.types';
import { iconMapping, IconName } from './icon.types';

@Component({
  selector: 'ui-icon',
  imports: [],
  template: ``,
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[innerHTML]': 'iconCode()',
    '[style.--icon-size]': '`var(--icon-size-${size()})`',
    '[style.--icon-color]': 'color()'
  }
})
export class IconComponent {
  readonly icon = input.required<IconName>();

  readonly size = input<ExtendedSize>(allExtendedSizes[0]);

  readonly variant = input<Variant>(allVariants[0]);

  protected readonly iconCode = computed(() => this.sanitizer.bypassSecurityTrustHtml(iconMapping[this.icon()]));

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly color = computed(() => `var(--content-${this.variant()}-low)`);
}
