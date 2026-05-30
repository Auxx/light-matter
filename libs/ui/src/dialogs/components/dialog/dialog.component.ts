import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {
}
