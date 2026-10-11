import { app, dialog, MessageBoxOptions } from 'electron';
import { autoUpdater } from 'electron-updater';
import App from '../app';

export default class UpdateEvents {
  // initialize auto update service - must be invoked only in production
  static initAutoUpdateService() {
    // Only AppImage builds carry a publish config (app-update.yml) and support self-updating.
    // Windows builds are distributed via NSIS / Microsoft Store and are not handled here.
    if (App.isDevelopmentMode() || !UpdateEvents.isAutoUpdateSupported()) {
      return;
    }

    console.log('Initializing auto update service...\n');

    UpdateEvents.bindEvents();
    app.whenReady().then(() => UpdateEvents.checkForUpdates());
  }

  // check for updates - must be invoked after initAutoUpdateService() and only in production
  static checkForUpdates() {
    if (!App.isDevelopmentMode() && UpdateEvents.isAutoUpdateSupported()) {
      autoUpdater.checkForUpdates().catch(error => {
        console.error('There was a problem checking for updates');
        console.error(error, '\n');
      });
    }
  }

  private static isAutoUpdateSupported(): boolean {
    return process.platform === 'linux' && !!process.env.APPIMAGE;
  }

  private static bindEvents() {
    autoUpdater.on('update-downloaded', info => {
      const dialogOpts: MessageBoxOptions = {
        type: 'info' as const,
        buttons: [ 'Restart', 'Later' ],
        title: 'Application Update',
        message: info.releaseName ?? `Version ${info.version}`,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
      };

      dialog.showMessageBox(dialogOpts).then(returnValue => {
        if (returnValue.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates...\n');
    });

    autoUpdater.on('update-available', () => {
      console.log('New update available!\n');
    });

    autoUpdater.on('update-not-available', () => {
      console.log('Up to date!\n');
    });

    autoUpdater.on('error', error => {
      console.error('There was a problem updating the application');
      console.error(error, '\n');
    });
  }
}
