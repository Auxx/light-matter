import { app, ipcMain } from 'electron';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { environment } from '../../environments/environment';
import App from '../app';

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

ipcMain.handle('get-app-version', () => environment.version);

ipcMain.handle('isPackaged', () => App.application.isPackaged);

ipcMain.handle('argv', () => yargs(hideBin(process.argv)).parse());

ipcMain.on('quit', (_, code) => app.exit(code));
