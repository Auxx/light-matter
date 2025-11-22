import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  imports: [ RouterModule ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = inject(Title);

  constructor() {
    this.setAppTitle().then();
  }

  setAppTitle = async () => this.title.setTitle(`Light Matter v${await window.desktop.getAppVersion()}`);
}
