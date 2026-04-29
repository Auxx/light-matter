import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FileInfo } from 'internal-api';

@Component({
  selector: 'app-images',
  imports: [],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagesComponent {
  readonly contents = input.required<FileInfo[]>();
}
