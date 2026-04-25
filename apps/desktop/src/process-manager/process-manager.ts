import { SystemPathMapping } from 'internal-api';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import App from '../app/app';
import { IpcHandler } from '../app/decorators/ipc-handler';
import { environment } from '../environments/environment';

export class ProcessManager {
  @IpcHandler({ name: 'ProcessManager.getAppVersion' })
  readonly getAppVersion = async (): Promise<string> => environment.version;

  @IpcHandler({ name: 'ProcessManager.isPackaged' })
  readonly isPackaged = async (): Promise<boolean> => App.application.isPackaged;

  @IpcHandler({ name: 'ProcessManager.getPlatform' })
  readonly getPlatform = async (): Promise<string> => process.platform;

  @IpcHandler({ name: 'ProcessManager.argv' })
  readonly argv = async () => yargs(hideBin(process.argv)).parse();

  @IpcHandler({ name: 'ProcessManager.getSystemPaths' })
  readonly getSystemPaths = async (): Promise<SystemPathMapping> => ({
    home: App.application.getPath('home'),
    appData: App.application.getPath('appData'),
    userData: App.application.getPath('userData'),
    temp: App.application.getPath('temp'),
    exe: App.application.getPath('exe'),
    desktop: App.application.getPath('desktop'),
    documents: App.application.getPath('documents'),
    downloads: App.application.getPath('downloads'),
    music: App.application.getPath('music'),
    pictures: App.application.getPath('pictures'),
    videos: App.application.getPath('videos'),
    recent: App.application.getPath('recent')
  });
}
