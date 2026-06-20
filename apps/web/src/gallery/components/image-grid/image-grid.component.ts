import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import {
  ActionButtonComponent,
  IconComponent,
  MenuSeparatorComponent,
  PopupMenuComponent,
  StopPropagation,
  TextComponent,
  TitleComponent,
  ToolbarComponent
} from '@light-matter/ui';
import { allSortDirections, allSortTypes, FileInfo, SortDirection, SortType } from 'internal-api';
import { ImagesComponent } from '../images/images.component';

@Component({
  selector: 'app-image-grid',
  imports: [
    ImagesComponent,
    ToolbarComponent,
    TitleComponent,
    ActionButtonComponent,
    IconComponent,
    StopPropagation,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    PopupMenuComponent,
    TextComponent,
    MenuSeparatorComponent
  ],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGridComponent {
  /* Inputs */
  readonly images = input.required<FileInfo[] | null>();

  readonly selectedLocation = input.required<string | null>();

  readonly sortBy = input<SortType>(allSortTypes[0]);

  readonly sortDirection = input<SortDirection>(allSortDirections[0]);

  /* Outputs */
  readonly selected = output<FileInfo>();

  /* State */
  private readonly scrollBox = viewChild<ElementRef<HTMLDivElement>>('scrollBox');

  /* Constructor */
  constructor() {
    effect(() => {
      this.selectedLocation();
      const scrollBox = this.scrollBox();

      if (scrollBox === undefined) {
        return;
      }

      scrollBox.nativeElement.scrollTo(0, 0);
    });
  }
}
