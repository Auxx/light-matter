import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { Desktop, SortDirection, SortType } from 'internal-api';

const api: Desktop = {
  ProcessManager: {
    getAppVersion: () => ipcRenderer.invoke('ProcessManager.getAppVersion'),
    isPackaged: () => ipcRenderer.invoke('ProcessManager.isPackaged'),
    getDevToolsOpen: () => ipcRenderer.invoke('ProcessManager.getDevToolsOpen'),
    setDevToolsOpen: (open: boolean) => ipcRenderer.invoke('ProcessManager.setDevToolsOpen', open),
    getPlatform: () => ipcRenderer.invoke('ProcessManager.getPlatform'),
    argv: () => ipcRenderer.invoke('ProcessManager.argv'),
    getSystemPaths: () => ipcRenderer.invoke('ProcessManager.getSystemPaths'),
    openConfigFile: () => ipcRenderer.invoke('ProcessManager.openConfigFile'),
    quit: (code: number) => ipcRenderer.invoke('ProcessManager.quit', code),
    setWindowTitle: (title: string) => ipcRenderer.invoke('ProcessManager.setWindowTitle', title)
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
      ipcRenderer.invoke('FileSystem.readImages', path, sortBy, sortDir),
    deleteFile: (path: string) => ipcRenderer.invoke('FileSystem.deleteFile', path)
  },

  Dialogs: {
    openFolder: () => ipcRenderer.invoke('Dialogs.openFolder')
  },

  Exif: {
    read: (path: string) => ipcRenderer.invoke('Exif.read', path)
  },

  CacheManager: {
    clear: () => ipcRenderer.invoke('CacheManager.clear'),
    clearFullSize: () => ipcRenderer.invoke('CacheManager.clearFullSize'),
    clearThumbnails: () => ipcRenderer.invoke('CacheManager.clearThumbnails'),
    cacheSize: () => ipcRenderer.invoke('CacheManager.cacheSize'),
    cacheInfo: () => ipcRenderer.invoke('CacheManager.cacheInfo'),
    openCacheFolder: () => ipcRenderer.invoke('CacheManager.openCacheFolder')
  },

  Histogram: {
    calculate: (path: string) => ipcRenderer.invoke('Histogram.calculate', path)
  },

  // TODO: Deprecated methods, should be moved into a handler class in the future
  openFolder: () => ipcRenderer.invoke('openFolder'),
  openFile: () => ipcRenderer.invoke('openFile'),
  openFileFromArgs: (fileName: string) => ipcRenderer.invoke('openFileFromArgs', fileName),
  getPathForFile: (file: File) => webUtils.getPathForFile(file)
};

contextBridge.exposeInMainWorld('desktop', api);
