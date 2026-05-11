import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-popup-menu',
  imports: [],
  template: `<ng-content/>`,
  styleUrl: './popup-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupMenuComponent {
}
