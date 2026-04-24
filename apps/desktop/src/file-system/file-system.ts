import { IpcMainInvokeEvent } from 'electron';
import { IpcHandler } from '../app/decorators/ipc-handler';

export class FileSystem {
  @IpcHandler({ name: 'test' })
  readonly test = async (event: IpcMainInvokeEvent) => {
    console.log('test', event);
  };
}
