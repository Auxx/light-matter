import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-vertical-divider',
  imports: [],
  template: '',
  styles: ':host { display: block; height: 20px; width: 1px; background: var(--content-default-lowest); }',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalDivider {}
