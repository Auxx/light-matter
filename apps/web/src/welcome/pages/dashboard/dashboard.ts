import { ChangeDetectionStrategy, Component } from '@angular/core';
import 'internal-api';

/**
 * @deprecated Remove in the future and clean up all references
 */
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
}
