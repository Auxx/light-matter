import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ExifInfoComponent } from '../../components/exif-info/exif-info.component';
import { ViewNavigator } from '../../services/view-navigator/view-navigator';
import { ImageView } from './image-view';

describe('ImageView', () => {
  let component: ImageView;
  let fixture: ComponentFixture<ImageView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImageView ],
      providers: [
        {
          provide: ViewNavigator,
          useValue: {
            selectedImage: () => of({ path: 'test.jpg', url: 'http://localhost/test.jpg' }),
            hasPrevious: () => of(false),
            hasNext: () => of(false)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ExifInfoComponent when exifVisible is true', () => {
    (component as unknown as { exifVisible: { set: (val: boolean) => void; }; }).exifVisible.set(true);
    fixture.detectChanges();

    const exifInfoEl = fixture.debugElement.query(By.directive(ExifInfoComponent));
    expect(exifInfoEl).toBeTruthy();
  });
});
