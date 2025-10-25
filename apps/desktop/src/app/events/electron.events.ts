import { app, dialog, ipcMain } from 'electron';
import { FileListing } from 'internal-api';
import * as fsSync from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { environment } from '../../environments/environment';
import App from '../app';

const supportedFileExtensions: string[] = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.svg',
  '.webp',
  '.avif',
  '.bmp'
];

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

ipcMain.handle('get-app-version', () => environment.version);

ipcMain.handle('isPackaged', () => App.application.isPackaged);

ipcMain.handle('argv', () => yargs(hideBin(process.argv)).parse());

ipcMain.handle('openFolder', async (): Promise<FileListing> => {
  const result = await dialog.showOpenDialog({ properties: [ 'openDirectory' ] });

  if (!result.canceled && result.filePaths.length > 0) {
    const folder = result.filePaths[0];
    const contents = (await fs.readdir(folder))
      .map(f => path.join(folder, f))
      .filter(f => fsSync.lstatSync(f).isFile())
      .filter(f => supportedFileExtensions.includes(path.extname(f).toLowerCase()));

    return {
      success: true,
      data: {
        folder,
        files: contents
      }
    };
  }

  return { success: false };
});

ipcMain.on('quit', (_, code) => app.exit(code));
