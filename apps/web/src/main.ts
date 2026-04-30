import { bootstrapApplication } from '@angular/platform-browser';
import { setPackagedMode } from 'internal-api';
import { App } from './app/app';
import { appConfig } from './app/app.config';

window.desktop
  .ProcessManager
  .isPackaged()
  .then(isPackaged => {
    setPackagedMode(isPackaged);
    bootstrapApplication(App, appConfig).catch(err => console.error(err));
  });
