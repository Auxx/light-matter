import { app, dialog, ipcMain, IpcMainInvokeEvent } from 'electron';
import { FileListing } from 'internal-api';
import * as fsSync from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Dialogs } from '../../dialogs/dialogs';
import { FileSystem } from '../../file-system/file-system';
import { ProcessManager } from '../../process-manager/process-manager';
import { IpcRegistry } from '../decorators/ipc-registry';

const supportedFileExtensions: string[] = [
  'jpg',
  'jpeg',
  'jxl',
  'png',
  'gif',
  'svg',
  'webp',
  'avif',
  'bmp'
];

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    IpcRegistry
      .getInstance()
      .registerIpcHandlers(
        ipcMain,
        [
          new ProcessManager(),
          new FileSystem(),
          new Dialogs()
        ]
      );

    return ipcMain;
  }
}

ipcMain.handle('openFolder', async (): Promise<FileListing> => {
  const result = await dialog.showOpenDialog({ properties: [ 'openDirectory' ] });

  if (!result.canceled && result.filePaths.length > 0) {
    const folder = result.filePaths[0];

    return {
      success: true,
      data: {
        folder,
        files: await readFolder(folder)
      }
    };
  }

  return { success: false, errorMessage: '' };
});

ipcMain.handle('openFile', async (): Promise<FileListing> => {
  const result = await dialog.showOpenDialog({
    properties: [ 'openFile' ],
    filters: [ { name: 'Images', extensions: supportedFileExtensions } ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const fileName = result.filePaths[0];
    const folder = path.dirname(fileName);

    return {
      success: true,
      data: {
        folder,
        files: await readFolder(folder),
        selected: fileName
      }
    };
  }

  return { success: false, errorMessage: '' };
});

ipcMain.handle('openFileFromArgs', async (_: IpcMainInvokeEvent, fileName: string): Promise<FileListing> => {
  const folder = path.dirname(fileName);

  return {
    success: true,
    data: {
      folder,
      files: await readFolder(folder),
      selected: fileName
    }
  };
});

ipcMain.on('quit', (_, code) => app.exit(code));

const readFolder = async (folder: string): Promise<string[]> =>
  (await fs.readdir(folder))
    .map(f => path.join(folder, f))
    .filter(f => fsSync.lstatSync(f).isFile())
    .filter(f => supportedFileExtensions.includes(path.extname(f).toLowerCase().replace('.', '')));
