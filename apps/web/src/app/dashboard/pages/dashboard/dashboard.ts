import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import 'internal-api';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatButton
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  readonly openFolder = async () => {
    const result = await window.desktop.openFolder();

    console.log('openFolder', result);
  };

  readonly openFile = () => {
    console.log('Open file');
  };
}
