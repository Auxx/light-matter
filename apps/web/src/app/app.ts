import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { OverlayComponent } from '@light-matter/ui';
import { ProcessManager } from '../ipc/process-manager';

@Component({
  imports: [ RouterModule, OverlayComponent ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly title = inject(Title);

  private readonly processManager = inject(ProcessManager);

  constructor() {
    this.setAppTitle().then();
  }

  setAppTitle = async () => this.title.setTitle(`Light Matter v${await this.processManager.getAppVersion()}`);
}
