import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThumbnailLoaderService {
  private readonly maxConcurrent = 4;
  private activeCount = 0;
  private readonly pendingTasks: Array<() => void> = [];

  readonly add = (url: string): Observable<boolean> => {
    return new Observable<boolean>(observer => {
      let status: 'pending' | 'active' | 'completed' | 'aborted' = 'pending';
      let image: HTMLImageElement | null = null;
      let cleanupListeners: (() => void) | null = null;

      const startLoading = () => {
        if (status !== 'pending') {
          return;
        }
        status = 'active';
        this.activeCount++;

        image = new Image();

        const onLoad = () => {
          if (status !== 'active') {
            return;
          }
          status = 'completed';
          cleanup();
          this.activeCount--;
          observer.next(true);
          observer.complete();
          this.processQueue();
        };

        const onError = () => {
          if (status !== 'active') {
            return;
          }
          status = 'completed';
          cleanup();
          this.activeCount--;
          observer.next(false);
          observer.complete();
          this.processQueue();
        };

        const cleanup = () => {
          if (image) {
            image.removeEventListener('load', onLoad);
            image.removeEventListener('error', onError);
          }
        };

        cleanupListeners = cleanup;

        image.addEventListener('load', onLoad);
        image.addEventListener('error', onError);

        image.src = url;
      };

      if (this.activeCount < this.maxConcurrent) {
        startLoading();
      } else {
        this.pendingTasks.push(startLoading);
      }

      return () => {
        if (status === 'pending') {
          status = 'aborted';
          const index = this.pendingTasks.indexOf(startLoading);
          if (index !== -1) {
            this.pendingTasks.splice(index, 1);
          }
        } else if (status === 'active') {
          status = 'aborted';
          if (cleanupListeners) {
            cleanupListeners();
          }
          if (image) {
            image.src = '';
          }
          this.activeCount--;
          this.processQueue();
        }
      };
    });
  };

  private processQueue(): void {
    while (this.activeCount < this.maxConcurrent && this.pendingTasks.length > 0) {
      const nextTask = this.pendingTasks.shift();
      if (nextTask) {
        nextTask();
      }
    }
  }
}
