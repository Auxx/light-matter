import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-vertical-divider',
  imports: [],
  template: '',
  styles: ':host { height: 20px; width: 1px; background: var(--mat-sys-on-surface); }',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalDivider {}
