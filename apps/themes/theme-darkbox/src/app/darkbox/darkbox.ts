import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, merge, shareReplay, startWith, Subject, take, tap } from 'rxjs';
import { hasTouchSupport } from '../utils/touch-detection';

@Component({
  selector: 'tdb-darkbox',
  imports: [
    AsyncPipe
  ],
  templateUrl: './darkbox.html',
  styleUrl: './darkbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mousemove)': 'onMouseMove()',
    '(touchstart)': 'onTap()'
  }
})
export class Darkbox {
  private readonly view = viewChild.required<ElementRef<HTMLDivElement>>('wrapper');

  protected readonly images = computed(() =>
    Array
      .from(this.view().nativeElement.children)
      .map(element => element.getAttribute('src'))
      .filter(url => url !== null)
  );

  protected readonly isEmpty = computed(() => this.images().length === 0);

  protected readonly selectedIndex = signal(0);

  protected readonly selectedImage = computed(() => this.images()[this.selectedIndex()]);

  protected readonly hasPrev = computed(() => this.selectedIndex() > 0);

  protected readonly hasNext = computed(() => this.selectedIndex() < this.images().length - 1);

  protected readonly hasTouchSupport = hasTouchSupport();

  private readonly hideTrigger$ = new Subject<void>();

  private readonly showTrigger$ = new Subject<void>();

  protected readonly isHidden$ = merge(
    this.hideTrigger$.pipe(
      this.hasTouchSupport
        ? tap()
        : debounceTime(500),
      map(() => true)
    ),
    this.showTrigger$.pipe(map(() => false))
  )
    .pipe(
      startWith(!this.hasTouchSupport),
      distinctUntilChanged(),
      shareReplay(1)
    );

  constructor() {
    this.isHidden$
      .pipe(takeUntilDestroyed())
      .subscribe(isHidden => console.log('isHidden', isHidden));
  }

  protected readonly onMouseMove = () => {
    if (this.hasTouchSupport) {
      return;
    }

    this.showTrigger$.next();
    this.hideTrigger$.next();
  };

  protected readonly onTap = () => {
    this.isHidden$
      .pipe(take(1))
      .subscribe(isHidden =>
        isHidden
          ? this.showTrigger$.next()
          : this.hideTrigger$.next()
      );
  };
}
