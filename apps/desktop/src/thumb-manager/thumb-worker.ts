import { stat } from 'node:fs/promises';
import { parentPort } from 'node:worker_threads';
import Vips from 'wasm-vips';

export interface ThumbWorkerRequest {
  id: string;
  source: string;
  target: string;
  width: number;
  height: number;
}

export interface ThumbWorkerResponse {
  id: string;
  success: boolean;
  error?: string;
}

let vipsInstance: typeof Vips | null = null;

async function getVips(): Promise<typeof Vips> {
  if (!vipsInstance) {
    vipsInstance = await Vips();
  }
  return vipsInstance;
}

// Pre-initialize Vips in worker
getVips().catch(err => {
  console.error('[ThumbWorker] Failed to initialize Vips:', err);
});

if (parentPort) {
  parentPort.on('message', async (request: ThumbWorkerRequest) => {
    const { id, source, target, width, height } = request;

    console.log(`[ThumbWorker] Processing ${source}...`);

    try {
      try {
        await stat(target);
        parentPort?.postMessage({ id, success: false } satisfies ThumbWorkerResponse);

        return;
      } catch (_) {
        // Target does not exist, proceed to create thumbnail
      }

      const vips = await getVips();
      {
        using thumb = vips.Image.thumbnail(
          source,
          width,
          {
            height,
            size: 2,
            crop: 1
          }
        );

        thumb.writeToFile(target, { Q: 80 });
      }

      parentPort?.postMessage({ id, success: true } satisfies ThumbWorkerResponse);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`[ThumbWorker] Thumbnail generation error (${source}):`, errorMessage);
      parentPort?.postMessage(
        {
          id,
          success: false,
          error: errorMessage
        } satisfies ThumbWorkerResponse
      );
    }
  });
}
