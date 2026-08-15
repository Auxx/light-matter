import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import type { ThumbWorkerRequest, ThumbWorkerResponse } from './thumb-worker';

export class ThumbManager {
  private worker: Worker | null = null;

  private readonly workerPath: string;

  private readonly pendingRequests = new Map<string, (success: boolean) => void>();

  private isTerminated = false;

  constructor(customWorkerPath?: string) {
    if (customWorkerPath) {
      this.workerPath = customWorkerPath;
    } else {
      const jsPath = join(__dirname, 'thumb-worker.js');
      const tsPath = join(__dirname, 'thumb-worker.ts');
      this.workerPath = existsSync(jsPath) ? jsPath : tsPath;
    }

    this.initWorker();
  }

  private initWorker(): void {
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
  }

  private restartWorker(): void {
    if (this.isTerminated) {
      return;
    }

    this.worker = null;
    this.initWorker();
  }

  private flushPendingRequests(result: boolean): void {
    for (const [ , resolve ] of this.pendingRequests) {
      resolve(result);
    }

    this.pendingRequests.clear();
  }

  readonly generate = async (
    source: string,
    target: string,
    width: number,
    height: number
  ): Promise<boolean> => {
    if (!this.worker) {
      this.initWorker();

      if (!this.worker) {
        console.error('[ThumbManager] Worker instance missing.');
        return false;
      }
    }

    return new Promise<boolean>(resolve => {
      const id = randomUUID();
      this.pendingRequests.set(id, resolve);

      const request: ThumbWorkerRequest = {
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
          resolve(false);
        }
      } catch (err) {
        console.error('[ThumbManager] Failed to post message to worker:', err);
        this.pendingRequests.delete(id);
        resolve(false);
      }
    });
  };

  public terminate(): void {
    this.isTerminated = true;
    this.flushPendingRequests(false);

    if (this.worker) {
      this.worker.terminate().catch(err => console.error('[ThumbManager] Failed to terminate worker:', err));
      this.worker = null;
    }
  }
}
