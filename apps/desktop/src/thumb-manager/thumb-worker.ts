import { stat } from 'node:fs/promises';
import { parentPort } from 'node:worker_threads';
import Vips from 'wasm-vips';

export interface ThumbWorkerGenerateRequest {
  type?: 'generate';
  id: string;
  source: string;
  target: string;
  width: number;
  height: number;
}

export interface ThumbWorkerCancelRequest {
  type: 'cancel';
  id: string;
}

export type ThumbWorkerRequest = ThumbWorkerGenerateRequest | ThumbWorkerCancelRequest;

export interface ThumbWorkerResponse {
  id: string;
  success: boolean;
  error?: string;
}

const cancelledRequests = new Set<string>();

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

function cancelRequest(id: string) {
  parentPort?.postMessage(
    {
      id,
      success: false,
      error: 'Cancelled'
    } satisfies ThumbWorkerResponse
  );
}

if (parentPort) {
  parentPort.on('message', async (request: ThumbWorkerRequest) => {
    if (request.type === 'cancel') {
      cancelledRequests.add(request.id);
      return;
    }

    const { id, source, target, width, height } = request;

    console.log(`[ThumbWorker] Processing ${source}...`);

    try {
      if (cancelledRequests.has(id)) {
        cancelRequest(id);
        return;
      }

      try {
        await stat(target);
        parentPort?.postMessage({ id, success: false } satisfies ThumbWorkerResponse);

        return;
      } catch (_) {
        // Target does not exist, proceed to create thumbnail
      }

      if (cancelledRequests.has(id)) {
        cancelRequest(id);
        return;
      }

      const vips = await getVips();

      if (cancelledRequests.has(id)) {
        cancelRequest(id);
        return;
      }

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

        if (cancelledRequests.has(id)) {
          cancelRequest(id);
          return;
        }

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
    } finally {
      cancelledRequests.delete(id);
    }
  });
}
