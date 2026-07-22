import { IpcMainInvokeEvent } from 'electron';
import { ExifTool } from 'exiftool-vendored';
import { ApiResponse, ExifTags } from 'internal-api';
import { IpcHandler } from '../app/decorators/ipc-handler';

export class Exif {
  @IpcHandler({ name: 'Exif.read' })
  readonly read = async (_: IpcMainInvokeEvent, path: string): Promise<ApiResponse<ExifTags>> => {
    const et = new ExifTool();

    try {
      return { success: true, data: await et.read(path) };
    } catch (e) {
      return { success: false, errorMessage: e instanceof Error ? e.message : 'Unknown error' };
    }
  };
}
