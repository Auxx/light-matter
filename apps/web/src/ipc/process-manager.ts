import { Injectable } from '@angular/core';
import { DesktopProcessManager, SystemPathMapping } from 'internal-api';
import { Arguments } from 'yargs';

@Injectable({ providedIn: 'root' })
export class ProcessManager implements DesktopProcessManager {
  readonly getAppVersion = (): Promise<string> => window.desktop.ProcessManager.getAppVersion();

  readonly isPackaged = (): Promise<boolean> => window.desktop.ProcessManager.isPackaged();

  readonly getPlatform = (): Promise<string> => window.desktop.ProcessManager.getPlatform();

  readonly argv = (): Promise<Arguments> => window.desktop.ProcessManager.argv();

  readonly getSystemPaths = (): Promise<SystemPathMapping> => window.desktop.ProcessManager.getSystemPaths();

  readonly quit = (code: number): Promise<void> => window.desktop.ProcessManager.quit(code);
}
