import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import 'internal-api';
import { Router } from '@angular/router';
import { FileListing } from 'internal-api';
import { ViewNavigator } from '../../../viewer/services/view-navigator/view-navigator';

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

  private readonly viewNavigator = inject(ViewNavigator);

  readonly openFolder = async () => await this.processResult(await window.desktop.openFolder());

  readonly openFile = async () => await this.processResult(await window.desktop.openFile());

  private readonly processResult = async (result: FileListing) => {
    if (!result.success) {
      this.viewNavigator.reset();
      return;
    }

    this.viewNavigator.setFiles(result.data.files, result.data.selected);
    await this.router.navigate([ '/view' ]);
  };
}
