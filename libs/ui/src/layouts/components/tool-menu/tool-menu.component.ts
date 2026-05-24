import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-tool-menu',
  imports: [],
  template: `<div class="container"><ng-content select="section"/></div>`,
  styleUrl: './tool-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolMenuComponent {
}
