import { contextBridge, ipcRenderer } from 'electron';
import { Desktop, SortDirection, SortType } from 'internal-api';

const api: Desktop = {
  ProcessManager: {
    getAppVersion: () => ipcRenderer.invoke('ProcessManager.getAppVersion'),
    isPackaged: () => ipcRenderer.invoke('ProcessManager.isPackaged'),
    getPlatform: () => ipcRenderer.invoke('ProcessManager.getPlatform'),
    argv: () => ipcRenderer.invoke('ProcessManager.argv'),
    getSystemPaths: () => ipcRenderer.invoke('ProcessManager.getSystemPaths'),
    quit: (code: number) => ipcRenderer.invoke('ProcessManager.quit', code)
  },

  FileSystem: {
    join: (...paths: string[]) => ipcRenderer.invoke('FileSystem.join', ...paths),
    dirname: (fileName: string) => ipcRenderer.invoke('FileSystem.dirname', fileName),
    readDir: (path: string) => ipcRenderer.invoke('FileSystem.readDir', path),
    readJson: (path: string) => ipcRenderer.invoke('FileSystem.readJson', path),
    writeJson: <T>(path: string, data: T) => ipcRenderer.invoke('FileSystem.writeJson', path, data),
    readGalleryLocation: (path: string) => ipcRenderer.invoke('FileSystem.readGalleryLocation', path),
    readDirectories: (path: string) => ipcRenderer.invoke('FileSystem.readDirectories', path),
    readImages: (path: string, sortBy: SortType, sortDir: SortDirection) =>
      ipcRenderer.invoke('FileSystem.readImages', path, sortBy, sortDir)
  },

  Dialogs: {
    openFolder: () => ipcRenderer.invoke('Dialogs.openFolder')
  },

  Exif: {
    read: (path: string) => ipcRenderer.invoke('Exif.read', path)
  },

  CacheManager: {
    clear: () => ipcRenderer.invoke('CacheManager.clear'),
    cacheSize: () => ipcRenderer.invoke('CacheManager.cacheSize')
  },

  // TODO: Deprecated methods, should be moved into a handler class in the future
  openFolder: () => ipcRenderer.invoke('openFolder'),
  openFile: () => ipcRenderer.invoke('openFile'),
  openFileFromArgs: (fileName: string) => ipcRenderer.invoke('openFileFromArgs', fileName)
};

contextBridge.exposeInMainWorld('desktop', api);
