import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-toolbar',
  imports: [],
  template: `<div class="primary"><ng-content/></div><div class="spacer"></div><ng-content select="aside"/>`,
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
}
