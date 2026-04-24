import { contextBridge, ipcRenderer } from 'electron';
import { Desktop } from 'internal-api';

const api: Desktop = {
  getAppVersion: () => ipcRenderer.invoke('getAppVersion'),
  isPackaged: () => ipcRenderer.invoke('isPackaged'),
  getPlatform: () => ipcRenderer.invoke('getPlatform'),
  argv: () => ipcRenderer.invoke('argv'),

  openFolder: () => ipcRenderer.invoke('openFolder'),
  openFile: () => ipcRenderer.invoke('openFile'),
  openFileFromArgs: (fileName: string) => ipcRenderer.invoke('openFileFromArgs', fileName),

  test: () => ipcRenderer.invoke('test')
};

contextBridge.exposeInMainWorld('desktop', api);
