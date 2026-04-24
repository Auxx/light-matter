import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import App from '../app/app';
import { IpcHandler } from '../app/decorators/ipc-handler';
import { environment } from '../environments/environment';

export class ProcessManager {
  @IpcHandler({ name: 'getAppVersion' })
  readonly getAppVersion = async (): Promise<string> => environment.version;

  @IpcHandler({ name: 'isPackaged' })
  readonly isPackaged = async (): Promise<boolean> => App.application.isPackaged;

  @IpcHandler({ name: 'getPlatform' })
  readonly getPlatform = async (): Promise<string> => process.platform;

  @IpcHandler({ name: 'argv' })
  readonly argv = async () => yargs(hideBin(process.argv)).parse();
}
