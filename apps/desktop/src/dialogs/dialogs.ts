import { dialog, IpcMainInvokeEvent } from 'electron';
import { ApiResponse } from 'internal-api';
import { IpcHandler } from '../app/decorators/ipc-handler';

export class Dialogs {
  @IpcHandler({ name: 'Dialogs.openFolder' })
  readonly openFolder = async (_: IpcMainInvokeEvent): Promise<ApiResponse<string>> => {
    const result = await dialog.showOpenDialog({ properties: [ 'openDirectory' ] });

    return (result.canceled || result.filePaths.length === 0)
      ? { success: false, errorMessage: '' }
      : { success: true, data: result.filePaths[0] };
  };
}
