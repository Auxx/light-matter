import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, signal, viewChild } from '@angular/core';

@Component({
  selector: 'tdb-darkbox',
  imports: [],
  templateUrl: './darkbox.html',
  styleUrl: './darkbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor() {
    effect(() => {
      console.log(this.images());
    });
  }
}
