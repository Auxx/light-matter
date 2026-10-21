import { IpcMainInvokeEvent } from 'electron';
import { ExifTool } from 'exiftool-vendored';
import { open } from 'node:fs/promises';
import { ApiResponse, ExifTags } from 'internal-api';
import { IpcHandler } from '../app/decorators/ipc-handler';

export class Exif {
  private readonly exifTool = new ExifTool();

  @IpcHandler({ name: 'Exif.read' })
  readonly read = async (_: IpcMainInvokeEvent, path: string): Promise<ApiResponse<ExifTags>> => {
    try {
      const tags = await this.exifTool.read(path);

      if (/\.jpe?g$/i.test(path) && await this.hasUltraHdrGainMap(path)) {
        (tags as ExifTags & { HDRGainMap?: boolean }).HDRGainMap = true;
      }

      return { success: true, data: tags };
    } catch (e) {
      return { success: false, errorMessage: e.message };
    }
  };

  private readonly hasUltraHdrGainMap = async (path: string): Promise<boolean> => {
    const file = await open(path, 'r');

    try {
      // Gain-map metadata can occur after the first MiB, for example in the
      // embedded secondary JPEG. Scan the complete file in chunks instead.
      const buffer = Buffer.alloc(64 * 1024);
      const markerPattern = /hdrgm|gainmap|mincontentboost|maxcontentboost|ultrahdr/i;
      const overlapLength = 32;
      let position = 0;
      let overlap = '';

      while (true) {
        const { bytesRead } = await file.read(buffer, 0, buffer.length, position);
        if (bytesRead === 0) {
          return false;
        }

        const text = overlap + buffer.subarray(0, bytesRead).toString('latin1');
        if (markerPattern.test(text)) {
          return true;
        }

        overlap = text.slice(-overlapLength);
        position += bytesRead;
      }
    } finally {
      await file.close();
    }
  };
}
