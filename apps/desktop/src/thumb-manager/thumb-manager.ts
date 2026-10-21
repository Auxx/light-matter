import { randomUUID } from 'node:crypto';
import { extname, join } from 'node:path';
import { Worker } from 'node:worker_threads';
import type { ImageHistogram } from 'internal-api';
import type {
  ThumbWorkerCancelRequest,
  ThumbWorkerGenerateRequest,
  ThumbWorkerHistogramRequest,
  ThumbWorkerResponse
} from './thumb-worker';

export class ThumbManager {
  private static readonly workerRecycleAfterHeavyImages = 8;

  private static readonly heavyExtensions = new Set([ '.jxr', '.avif', '.heif', '.heic', '.exr', '.hdr', '.tif', '.tiff' ]);

  private worker: Worker | null = null;

  private readonly workerPath: string;

  private readonly pendingRequests = new Map<string, (response: ThumbWorkerResponse) => void>();

  private workerQueue: Promise<void> = Promise.resolve();

  private heavyImagesSinceRestart = 0;

  private isTerminated = false;

  constructor(customWorkerPath?: string) {
    this.workerPath = customWorkerPath ? customWorkerPath : join(__dirname, `thumb-worker.js`);

    this.initWorker();
  }

  readonly generate = (
    source: string,
    target: string,
    width: number,
    height: number,
    signal?: AbortSignal
  ): Promise<boolean> => this.enqueue(() => this.runWorkerOperation(
    source,
    () => this.generateQueued(source, target, width, height, signal)
  ));

  private readonly generateQueued = async (
    source: string,
    target: string,
    width: number,
    height: number,
    signal?: AbortSignal
  ): Promise<boolean> => {
    if (signal?.aborted) {
      return false;
    }

    if (!this.worker) {
      this.initWorker();

      if (!this.worker) {
        console.error('[ThumbManager] Worker instance missing.');
        return false;
      }
    }

    return new Promise<boolean>(resolve => {
      const id = randomUUID();

      let onAbort: (() => void) | undefined;

      const cleanup = () => {
        if (signal && onAbort) {
          signal.removeEventListener('abort', onAbort);
        }
      };

      const wrappedResolve = (response: ThumbWorkerResponse) => {
        cleanup();
        resolve(response.success);
      };

      this.pendingRequests.set(id, wrappedResolve);

      if (signal) {
        onAbort = () => {
          this.cancel(id);
          // Keep the queue occupied until the worker acknowledges cancellation
          // or finishes the active decode; otherwise later jobs overlap it.
        };

        if (signal.aborted) {
          onAbort();
          return;
        }

        signal.addEventListener('abort', onAbort, { once: true });
      }

      const request: ThumbWorkerGenerateRequest = {
        type: 'generate',
        id,
        source,
        target,
        width,
        height
      };

      try {
        const currentWorker = this.worker;

        if (currentWorker) {
          currentWorker.postMessage(request);
        } else {
          this.pendingRequests.delete(id);
          cleanup();
          resolve(false);
        }
      } catch (err) {
        console.error('[ThumbManager] Failed to post message to worker:', err);
        this.pendingRequests.delete(id);
        cleanup();
        resolve(false);
      }
    });
  };

  readonly histogram = (source: string): Promise<ImageHistogram | null> =>
    this.enqueue(() => this.runWorkerOperation(source, () => this.histogramQueued(source)));

  private readonly histogramQueued = async (source: string): Promise<ImageHistogram | null> => {
    if (!this.worker) {
      this.initWorker();
    }

    if (!this.worker) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const id = randomUUID();
      this.pendingRequests.set(id, response => {
        if (!response.success) {
          reject(new Error(response.error ?? 'Histogram worker failed.'));
          return;
        }

        resolve(response.histogram ?? null);
      });

      const request: ThumbWorkerHistogramRequest = { type: 'histogram', id, source };
      try {
        this.worker?.postMessage(request);
      } catch (error) {
        console.error('[ThumbManager] Failed to request image histogram:', error);
        this.pendingRequests.delete(id);
        reject(error);
      }
    });
  };

  readonly cancel = (id: string) => {
    try {
      if (this.worker) {
        const request: ThumbWorkerCancelRequest = {
          type: 'cancel',
          id
        };
        this.worker.postMessage(request);
      }
    } catch (err) {
      console.error('[ThumbManager] Failed to post cancel message to worker:', err);
    }
  };

  readonly terminate = () => {
    this.isTerminated = true;
    this.flushPendingRequests(false);

    if (this.worker) {
      this.worker.terminate().catch(err => console.error('[ThumbManager] Failed to terminate worker:', err));
      this.worker = null;
    }
  };

  private readonly initWorker = () => {
    if (this.isTerminated) {
      return;
    }

    try {
      this.heavyImagesSinceRestart = 0;
      this.worker = new Worker(this.workerPath, {
        execArgv: this.workerPath.endsWith('.ts') ? [ '--require', 'ts-node/register' ] : undefined
      });

      this.worker.on('message', (response: ThumbWorkerResponse) => {
        const callback = this.pendingRequests.get(response.id);

        if (callback) {
          this.pendingRequests.delete(response.id);
          callback(response);
        }
      });

      this.worker.on('error', err => {
        console.error('[ThumbManager] Worker error:', err);
        this.flushPendingRequests(false);
        this.restartWorker();
      });

      this.worker.on('exit', code => {
        if (!this.isTerminated) {
          if (code !== 0) {
            console.error(`[ThumbManager] Worker stopped with exit code ${code}`);
          }

          this.flushPendingRequests(false);
          this.restartWorker();
        }
      });
    } catch (err) {
      console.error('[ThumbManager] Failed to create worker:', err);
      this.worker = null;
    }
  };

  private readonly enqueue = <T>(operation: () => Promise<T>): Promise<T> => {
    const result = this.workerQueue.then(operation, operation);
    this.workerQueue = result.then(() => undefined, () => undefined);
    return result;
  };

  private readonly runWorkerOperation = async <T>(source: string, operation: () => Promise<T>): Promise<T> => {
    try {
      return await operation();
    } finally {
      if (ThumbManager.heavyExtensions.has(extname(source).toLowerCase())) {
        this.heavyImagesSinceRestart++;

        if (this.heavyImagesSinceRestart >= ThumbManager.workerRecycleAfterHeavyImages) {
          await this.recycleWorker();
        }
      }
    }
  };

  private readonly recycleWorker = async () => {
    const worker = this.worker;
    this.worker = null;

    if (worker) {
      worker.removeAllListeners();

      try {
        await worker.terminate();
      } catch (error) {
        console.error('[ThumbManager] Failed to recycle thumbnail worker:', error);
      }
    }

    this.initWorker();
  };

  private readonly restartWorker = () => {
    if (this.isTerminated) {
      return;
    }

    this.worker = null;
    this.initWorker();
  };

  private readonly flushPendingRequests = (result: boolean) => {
    for (const [ , resolve ] of this.pendingRequests) {
      resolve({ id: '', success: result });
    }

    this.pendingRequests.clear();
  };
}
