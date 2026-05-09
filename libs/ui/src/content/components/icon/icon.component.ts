import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { iconMapping, IconName } from './icon.types';

export const allIconSizes = [ 'medium', 'small', 'x-small', 'large', 'x-large' ] as const;

export type IconSize = typeof allIconSizes[number];

@Component({
  selector: 'ui-icon',
  imports: [],
  template: ``,
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[innerHTML]': 'iconCode()',
    '[style.--icon-size]': '`var(--icon-size-${size()})`'
  }
})
export class IconComponent {
  readonly icon = input.required<IconName>();

  readonly size = input<IconSize>(allIconSizes[0]);

  protected readonly iconCode = computed(() => this.sanitizer.bypassSecurityTrustHtml(iconMapping[this.icon()]));

  private readonly sanitizer = inject(DomSanitizer);
}
