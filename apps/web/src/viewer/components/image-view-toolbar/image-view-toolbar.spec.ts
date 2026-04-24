import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ImageViewToolbar } from './image-view-toolbar';

describe('ImageViewToolbar', () => {
  let component: ImageViewToolbar;
  let fixture: ComponentFixture<ImageViewToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImageViewToolbar ],
      providers: [ provideRouter([]) ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageViewToolbar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fit', 'contain');
    fixture.componentRef.setInput('fileName', '');
    fixture.componentRef.setInput('imageElement', null);
    fixture.componentRef.setInput('isFullScreen', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
