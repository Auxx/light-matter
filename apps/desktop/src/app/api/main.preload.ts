import { contextBridge, ipcRenderer } from 'electron';
import { Desktop } from 'internal-api';

const api: Desktop = {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform,
  argv: () => ipcRenderer.invoke('argv'),
  isPackaged: () => ipcRenderer.invoke('isPackaged')
};

contextBridge.exposeInMainWorld('desktop', api);
