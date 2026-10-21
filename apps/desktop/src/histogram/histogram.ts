import { ApiResponse, ImageHistogram } from 'internal-api';
import { IpcMainInvokeEvent } from 'electron';
import { extname } from 'node:path';
import { IpcHandler } from '../app/decorators/ipc-handler';
import { Injector } from '../injector/injector';

const requiresConversion = new Set([ '.jxr', '.avif', '.heif', '.heic', '.exr', '.hdr', '.tif', '.tiff' ]);

export class Histogram {
  @IpcHandler({ name: 'Histogram.calculate' })
  readonly calculate = async (_: IpcMainInvokeEvent, fileName: string): Promise<ApiResponse<ImageHistogram>> => {
    try {
      const injector = Injector.getInstance();
      const cacheManager = injector.inject('CacheManager');
      const thumbManager = injector.inject('ThumbManager');
      const extension = extname(fileName).toLowerCase();
      let source = fileName;

      if (requiresConversion.has(extension)) {
        const isTiff = extension === '.tif' || extension === '.tiff';
        const tag = `${extension.slice(1)}-full-${isTiff ? 'hdr-v6' : 'uhdr'}`;
        const result = await cacheManager.get(
          fileName,
          tag,
          async target => await thumbManager.generate(fileName, target, 0, 0),
          '.jpg'
        );

        if (result === null) {
          throw new Error(`Could not decode ${extension} image for histogram.`);
        }

        source = result;
      }

      const result = await thumbManager.histogram(source);
      if (result === null) {
        throw new Error('Histogram worker returned no image data.');
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : String(error)
      };
    }
  };
}
