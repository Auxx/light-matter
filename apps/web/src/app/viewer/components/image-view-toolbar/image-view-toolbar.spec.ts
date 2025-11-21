import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageViewToolbar } from './image-view-toolbar';

describe('ImageViewToolbar', () => {
  let component: ImageViewToolbar;
  let fixture: ComponentFixture<ImageViewToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImageViewToolbar ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageViewToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
