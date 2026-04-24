import { contextBridge, ipcRenderer } from 'electron';
import { Desktop } from 'internal-api';

const api: Desktop = {
  ProcessManager: {
    getAppVersion: () => ipcRenderer.invoke('ProcessManager.getAppVersion'),
    isPackaged: () => ipcRenderer.invoke('ProcessManager.isPackaged'),
    getPlatform: () => ipcRenderer.invoke('ProcessManager.getPlatform'),
    argv: () => ipcRenderer.invoke('ProcessManager.argv')
  },

  FileSystem: {
    join: (...paths: string[]) => ipcRenderer.invoke('FileSystem.join', ...paths),
    readDir: (path: string) => ipcRenderer.invoke('FileSystem.readDir', path)
  },

  // TODO: Deprecated methods, should be moved into a handler class in the future
  openFolder: () => ipcRenderer.invoke('openFolder'),
  openFile: () => ipcRenderer.invoke('openFile'),
  openFileFromArgs: (fileName: string) => ipcRenderer.invoke('openFileFromArgs', fileName)
};

contextBridge.exposeInMainWorld('desktop', api);
