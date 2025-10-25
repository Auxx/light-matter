import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  template: ``,
  styles: ':host { display: block; }',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Root {
}
