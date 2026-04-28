import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dual-pane',
  imports: [
    MatIcon
  ],
  templateUrl: './dual-pane.component.html',
  styleUrl: './dual-pane.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DualPaneComponent {
}
