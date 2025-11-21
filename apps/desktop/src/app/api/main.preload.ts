import { contextBridge, ipcRenderer } from 'electron';
import { Desktop } from 'internal-api';

const api: Desktop = {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform,
  argv: () => ipcRenderer.invoke('argv'),
  isPackaged: () => ipcRenderer.invoke('isPackaged'),
  openFolder: () => ipcRenderer.invoke('openFolder'),
  openFile: () => ipcRenderer.invoke('openFile'),
  openFileFromArgs: (fileName: string) => ipcRenderer.invoke('openFileFromArgs', fileName)
};

contextBridge.exposeInMainWorld('desktop', api);
