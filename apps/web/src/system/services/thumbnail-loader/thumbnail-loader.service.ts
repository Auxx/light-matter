import { Injectable } from '@angular/core';
import { concatMap, filter, map, Observable, ReplaySubject, Subject, take } from 'rxjs';

interface QueueItem {
  id: string;
  obs: Observable<boolean>;
}

interface QueueResult {
  id: string;
  status: boolean;
}

@Injectable({ providedIn: 'root' })
export class ThumbnailLoaderService {
  private readonly queue$ = new Subject<QueueItem>();

  private readonly result$ = new ReplaySubject<QueueResult>(1);

  constructor() {
    this.queue$
      .pipe(
        concatMap(item =>
          item.obs
            .pipe(
              map(status => ({
                id: item.id,
                status
              }))
            )
        )
      )
      .subscribe(result => this.result$.next(result));
  }

  readonly add = (url: string): Observable<boolean> => {
    const result = this.result$
      .pipe(
        filter(r => r.id === url),
        take(1),
        map(r => r.status)
      );

    this.queue$.next({
      id: url,
      obs: this.loadImage(url)
    });

    return result;
  };

  private readonly loadImage = (url: string) =>
    new Observable<boolean>(observer => {
      const image = new Image();

      image.addEventListener('load', () => {
        observer.next(true);
        observer.complete();
      });

      image.addEventListener('error', () => {
        observer.next(false);
        observer.complete();
      });

      image.src = url;
    });
}
