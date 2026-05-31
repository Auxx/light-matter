import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-info-overlay',
  imports: [],
  templateUrl: './info-overlay.component.html',
  styleUrl: './info-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoOverlayComponent {
}
