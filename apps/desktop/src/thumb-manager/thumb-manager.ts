import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import App from '../app/app';
import type { ThumbWorkerCancelRequest, ThumbWorkerGenerateRequest, ThumbWorkerResponse } from './thumb-worker';

export class ThumbManager {
  private worker: Worker | null = null;

  private readonly workerPath: string;

  private readonly pendingRequests = new Map<string, (success: boolean) => void>();

  private isTerminated = false;

  constructor(customWorkerPath?: string) {
    if (customWorkerPath) {
      this.workerPath = customWorkerPath;
    } else {
      this.workerPath = join(__dirname, `thumb-worker.${App.application.isPackaged ? 'js' : 'ts'}`);
    }

    this.initWorker();
  }

  readonly generate = async (
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

      const wrappedResolve = (success: boolean) => {
        cleanup();
        resolve(success);
      };

      this.pendingRequests.set(id, wrappedResolve);

      if (signal) {
        onAbort = () => {
          this.cancel(id);
          const callback = this.pendingRequests.get(id);
          if (callback) {
            this.pendingRequests.delete(id);
            callback(false);
          }
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
      this.worker = new Worker(this.workerPath, {
        execArgv: this.workerPath.endsWith('.ts') ? [ '--require', 'ts-node/register' ] : undefined
      });

      this.worker.on('message', (response: ThumbWorkerResponse) => {
        const callback = this.pendingRequests.get(response.id);

        if (callback) {
          this.pendingRequests.delete(response.id);
          callback(response.success);
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

  private readonly restartWorker = () => {
    if (this.isTerminated) {
      return;
    }

    this.worker = null;
    this.initWorker();
  };

  private readonly flushPendingRequests = (result: boolean) => {
    for (const [ , resolve ] of this.pendingRequests) {
      resolve(result);
    }

    this.pendingRequests.clear();
  };
}
