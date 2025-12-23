import { ChangeDetectionStrategy, Component, contentChildren, effect, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'tdb-darkbox',
  imports: [],
  templateUrl: './darkbox.html',
  styleUrl: './darkbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Darkbox {
  private readonly content = contentChildren('img');

  private readonly view = viewChild<ElementRef<HTMLDivElement>>('wrapper');

  constructor() {
    effect(() => {
      console.log('CONTENT', this.content());
      console.log('view', this.view()?.nativeElement.children);
    });
  }
}
