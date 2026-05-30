import { CdkMenuTrigger } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, input, output, TemplateRef } from '@angular/core';
import { ActionButtonComponent, IconComponent, IconName } from '@light-matter/ui';
import { StopPropagation } from '../../../ui/directives/stop-propagation/stop-propagation';

@Component({
  selector: 'app-location-element',
  imports: [
    StopPropagation,
    IconComponent,
    ActionButtonComponent,
    CdkMenuTrigger
  ],
  templateUrl: './location-element.component.html',
  styleUrl: './location-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--level]': 'level()',
    '[class.root]': 'level() === 0',
    '[class.selected]': 'selected()',
    '[attr.title]': 'description()',
    '(click)': 'onSelect()'
  }
})
export class LocationElementComponent<T> {
  readonly icon = input.required<IconName>();

  readonly level = input.required<number>();

  readonly selected = input.required<boolean>();

  readonly description = input<string | null>();

  readonly menu = input<TemplateRef<unknown> | null>(null);

  readonly menuData = input<T | null>(null);

  readonly clicked = output();

  readonly onSelect = () => this.clicked.emit();
}
