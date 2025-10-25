import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import 'internal-api';
import { Router } from '@angular/router';
import { appProtocol, FileListing } from 'internal-api';

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
  private readonly router = inject(Router);

  readonly openFolder = async () => await this.processResult(await window.desktop.openFolder());

  readonly openFile = async () => await this.processResult(await window.desktop.openFile());

  private readonly processResult = async (result: FileListing) => {
    if (result.success && result.data.files.length > 0) {
      const fileName = result.data.selected === undefined ? result.data.files[0] : result.data.selected;
      await this.router.navigate([ '/view', `${ appProtocol }://${ encodeURIComponent(fileName) }` ]);
    }
  };
}
