import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { iconMapping, IconName } from './icon.types';

@Component({
  selector: 'app-icon',
  imports: [],
  template: ``,
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[innerHTML]': 'iconCode()'
  }
})
export class IconComponent {
  readonly icon = input.required<IconName>();

  protected readonly iconCode = computed(() => this.sanitizer.bypassSecurityTrustHtml(iconMapping[this.icon()]));

  private readonly sanitizer = inject(DomSanitizer);
}
