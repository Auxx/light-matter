import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThumbnailSize } from 'internal-api';
import { ImageGridComponent } from './image-grid.component';

describe('ImageGridComponent', () => {
  let component: ImageGridComponent;
  let fixture: ComponentFixture<ImageGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImageGridComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ImageGridComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', []);
    fixture.componentRef.setInput('selectedLocation', '/test');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default thumbSize as small', () => {
    expect(component.thumbSize()).toBe('small');
  });

  it('should accept custom thumbSize input', () => {
    fixture.componentRef.setInput('thumbSize', 'medium');
    expect(component.thumbSize()).toBe('medium');
  });

  it('should emit thumbSizeChanged when triggered', () => {
    const emitted: ThumbnailSize[] = [];
    component.thumbSizeChanged.subscribe(size => emitted.push(size));

    component.thumbSizeChanged.emit('large');
    expect(emitted).toEqual([ 'large' ]);
  });
});
