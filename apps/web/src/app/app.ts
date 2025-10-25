import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import 'internal-api';

@Component({
  imports: [ RouterModule ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    this.debug().then();
  }

  readonly debug = async () => {
    console.log('argv', window.desktop.argv)
    console.log('isPackaged', await window.desktop.isPackaged())
    console.log('AppVersion',await window.desktop.getAppVersion());
  }
}
