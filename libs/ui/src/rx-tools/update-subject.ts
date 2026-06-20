import { map, Observable, Subject, take, tap } from 'rxjs';

export function updateSubject<T>(subject: Subject<T>, reducer: (data: T) => T): Observable<boolean>;
export function updateSubject<T>(subject: Subject<T>, data: Partial<T>): Observable<boolean>;
export function updateSubject<T>(
  subject: Subject<T>,
  dataOrReducer: Partial<T> | ((data: T) => T)
): Observable<boolean> {
  return subject
    .pipe(
      take(1),
      tap(result => {
        subject.next(
          typeof dataOrReducer === 'function'
            ? dataOrReducer(result)
            : { ...result, ...dataOrReducer }
        );
      }),
      map(() => true)
    );
}
