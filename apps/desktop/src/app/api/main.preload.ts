import { contextBridge, ipcRenderer } from 'electron';
import { Desktop } from 'internal-api';

const api: Desktop = {
  ProcessManager: {
    getAppVersion: () => ipcRenderer.invoke('ProcessManager.getAppVersion'),
    isPackaged: () => ipcRenderer.invoke('ProcessManager.isPackaged'),
    getPlatform: () => ipcRenderer.invoke('ProcessManager.getPlatform'),
    argv: () => ipcRenderer.invoke('ProcessManager.argv'),
    getSystemPaths: () => ipcRenderer.invoke('ProcessManager.getSystemPaths')
  },

  FileSystem: {
    join: (...paths: string[]) => ipcRenderer.invoke('FileSystem.join', ...paths),
    readDir: (path: string) => ipcRenderer.invoke('FileSystem.readDir', path),
    readJson: (path: string) => ipcRenderer.invoke('FileSystem.readJson', path),
    writeJson: <T>(path: string, data: T) => ipcRenderer.invoke('FileSystem.writeJson', path, data),
    readGalleryLocation: (path: string) => ipcRenderer.invoke('FileSystem.readGalleryLocation', path)
  },

  Dialogs: {
    openFolder: () => ipcRenderer.invoke('Dialogs.openFolder')
  },

  Exif: {
    read: (path: string) => ipcRenderer.invoke('Exif.read', path)
  },

  // TODO: Deprecated methods, should be moved into a handler class in the future
  openFolder: () => ipcRenderer.invoke('openFolder'),
  openFile: () => ipcRenderer.invoke('openFile'),
  openFileFromArgs: (fileName: string) => ipcRenderer.invoke('openFileFromArgs', fileName)
};

contextBridge.exposeInMainWorld('desktop', api);
