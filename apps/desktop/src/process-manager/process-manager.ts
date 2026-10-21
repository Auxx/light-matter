import { app, IpcMainInvokeEvent, shell } from 'electron';
import { SystemPathMapping } from 'internal-api';
import { stat } from 'node:fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import App from '../app/app';
import { IpcHandler } from '../app/decorators/ipc-handler';
import { environment } from '../environments/environment';

export class ProcessManager {
  @IpcHandler({ name: 'ProcessManager.getAppVersion' })
  readonly getAppVersion = async (): Promise<string> => {
    try {
      const { mtime } = await stat(process.execPath);
      return `${environment.version} ${mtime.toLocaleString('de-AT')}`;
    } catch (_) {
      return environment.version;
    }
  };

  @IpcHandler({ name: 'ProcessManager.quit' })
  readonly quit = async (_: IpcMainInvokeEvent, code: number): Promise<void> => app.exit(code);

  @IpcHandler({ name: 'ProcessManager.setWindowTitle' })
  readonly setWindowTitle = async (_: IpcMainInvokeEvent, title: string): Promise<void> => {
    App.mainWindow?.setTitle(title || 'Light Matter');
  };

  @IpcHandler({ name: 'ProcessManager.isPackaged' })
  readonly isPackaged = async (): Promise<boolean> => App.application.isPackaged;

  @IpcHandler({ name: 'ProcessManager.getDevToolsOpen' })
  readonly getDevToolsOpen = async (): Promise<boolean> => App.startupConfig.devToolsOpen();

  @IpcHandler({ name: 'ProcessManager.setDevToolsOpen' })
  readonly setDevToolsOpen = async (_: IpcMainInvokeEvent, open: boolean): Promise<void> => {
    await App.setDevToolsOpen(open === true);
  };

  @IpcHandler({ name: 'ProcessManager.openConfigFile' })
  readonly openConfigFile = async (): Promise<string> => shell.openPath(App.startupConfig.configPath());

  @IpcHandler({ name: 'ProcessManager.getPlatform' })
  readonly getPlatform = async (): Promise<string> => process.platform;

  @IpcHandler({ name: 'ProcessManager.argv' })
  readonly argv = async () => yargs(hideBin(process.argv)).parse();

  @IpcHandler({ name: 'ProcessManager.getSystemPaths' })
  readonly getSystemPaths = async (): Promise<SystemPathMapping> => {
    const getPath = (name: Parameters<typeof app.getPath>[0]): string => {
      try {
        return App.application.getPath(name);
      } catch (_) {
        return '';
      }
    };

    return {
      home: getPath('home'),
      appData: getPath('appData'),
      userData: getPath('userData'),
      temp: getPath('temp'),
      exe: getPath('exe'),
      desktop: getPath('desktop'),
      documents: getPath('documents'),
      downloads: getPath('downloads'),
      music: getPath('music'),
      pictures: getPath('pictures'),
      videos: getPath('videos'),
      recent: getPath('recent'),
      appConfig: App.startupConfig.configPath()
    };
  };
}
