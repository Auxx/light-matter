import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Dialogs {
  readonly openFolder = () => window.desktop.Dialogs.openFolder();
}
