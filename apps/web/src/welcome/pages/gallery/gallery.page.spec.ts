import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Desktop, ThumbnailSize } from 'internal-api';
import { GalleryState } from '../../../gallery/services/gallery-state/gallery-state';
import { GalleryPage } from './gallery.page';

describe('GalleryPage', () => {
  let component: GalleryPage;
  let fixture: ComponentFixture<GalleryPage>;

  beforeAll(() => {
    window.desktop = {
      ProcessManager: {
        getSystemPaths: jest.fn().mockResolvedValue({
          pictures: '/pictures',
          appConfig: '/config.json'
        })
      },
      FileSystem: {
        readJson: jest.fn().mockResolvedValue({ success: false }),
        writeJson: jest.fn().mockResolvedValue({ success: true }),
        readDirectories: jest.fn().mockResolvedValue({ success: true, data: [] }),
        readImages: jest.fn().mockResolvedValue({ success: true, data: [] })
      }
    } as unknown as Desktop;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GalleryPage ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GalleryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate onThumbSizeChange to galleryState.changeThumbnailSize', () => {
    const galleryState = TestBed.inject(GalleryState);
    const spy = jest.spyOn(galleryState, 'changeThumbnailSize');

    component['onThumbSizeChange']('large' as ThumbnailSize);
    expect(spy).toHaveBeenCalledWith('large');
  });
});
