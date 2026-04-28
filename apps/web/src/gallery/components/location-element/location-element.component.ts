import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-location-element',
  imports: [
    MatIcon,
    MatIconButton,
    MatMenuTrigger
  ],
  templateUrl: './location-element.component.html',
  styleUrl: './location-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--level]': 'level()',
    '[class.root]': 'level() === 0',
    '[attr.title]': 'description()'
  }
})
export class LocationElementComponent<T> {
  readonly icon = input.required<string>();

  readonly level = input.required<number>();

  readonly description = input<string | null>();

  readonly menu = input<MatMenu | null>(null);

  readonly menuData = input<T | null>(null);
}
