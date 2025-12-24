import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, signal, viewChild } from '@angular/core';
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

  protected readonly selectedIndex = signal(0);

  protected readonly hidingIndex = signal(-1);

  protected readonly showingIndex = signal(-1);

  protected readonly direction = signal<'left' | 'right'>('left');

  protected readonly images = computed(() =>
    Array
      .from(this.view().nativeElement.children)
      .map(element => element.getAttribute('src'))
      .filter(url => url !== null)
      .map((url, index) => ({
        url,
        showing: this.showingIndex() === index,
        hiding: this.hidingIndex() === index,
        hidden: (this.hidingIndex() !== index && this.selectedIndex() !== index)
          || (this.hidingIndex() !== -1 && this.selectedIndex() === index)
      }))
  );

  protected readonly isEmpty = computed(() => this.images().length === 0);

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

  protected readonly onPrev = () => {
    this.direction.set('right');
    this.hidingIndex.set(this.selectedIndex());
    this.selectedIndex.update(value => value - 1);
  };

  protected readonly onNext = () => {
    this.direction.set('left');
    this.hidingIndex.set(this.selectedIndex());
    this.selectedIndex.update(value => value + 1);
  };

  protected readonly onAnimationEnd = (event: AnimationEvent) => {
    if (event.target instanceof HTMLImageElement) {
      if (event.target.classList.contains('hiding')) {
        this.showingIndex.set(this.selectedIndex());
        this.hidingIndex.set(-1);
      } else if (event.target.classList.contains('showing')) {
        this.showingIndex.set(-1);
      }
    }
  };
}
