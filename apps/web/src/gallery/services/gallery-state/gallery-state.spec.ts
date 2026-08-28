import { TestBed } from '@angular/core/testing';
import { AppConfigV1, defaultThumbHeight, defaultThumbWidth } from 'internal-api';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { FileSystem } from '../../../ipc/file-system';
import { Configuration } from '../../../system/services/configuration/configuration';
import { GalleryLocations } from '../gallery-locations/gallery-locations';
import { GalleryState } from './gallery-state';

describe('GalleryState', () => {
  let service: GalleryState;
  let configSubject: BehaviorSubject<AppConfigV1>;
  let updateGalleryConfigMock: jest.Mock;

  const mockConfig: AppConfigV1 = {
    version: 1,
    gallery: {
      locations: [ '/pics' ],
      thumbWidth: defaultThumbWidth,
      thumbHeight: defaultThumbHeight
    },
    system: {
      minimiseOnStart: false
    }
  };

  beforeEach(() => {
    configSubject = new BehaviorSubject<AppConfigV1>(mockConfig);
    updateGalleryConfigMock = jest.fn(options => {
      const current = configSubject.getValue();
      configSubject.next({
        ...current,
        gallery: { ...current.gallery, ...options }
      });
    });

    const configurationMock = {
      config: () => configSubject.asObservable(),
      updateGalleryConfig: updateGalleryConfigMock
    };

    const galleryLocationsMock = {
      locations: () => of([ '/pics' ])
    };

    const fileSystemMock = {
      readImages: jest.fn().mockResolvedValue({ success: true, data: [] }),
      readDirectories: jest.fn().mockResolvedValue({ success: true, data: [] })
    };

    TestBed.configureTestingModule({
      providers: [
        GalleryState,
        { provide: Configuration, useValue: configurationMock },
        { provide: GalleryLocations, useValue: galleryLocationsMock },
        { provide: FileSystem, useValue: fileSystemMock }
      ]
    });
    service = TestBed.inject(GalleryState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial thumbSize as small', async () => {
    const size = await firstValueFrom(service.thumbSize());
    expect(size).toBe('small');
  });

  it('should update thumbnail size when changeThumbnailSize is called', async () => {
    service.changeThumbnailSize('medium');
    expect(updateGalleryConfigMock).toHaveBeenCalledWith({
      thumbWidth: 288,
      thumbHeight: 192
    });

    const size = await firstValueFrom(service.thumbSize());
    expect(size).toBe('medium');
  });

  it('should update to large thumbnail size', async () => {
    service.changeThumbnailSize('large');
    expect(updateGalleryConfigMock).toHaveBeenCalledWith({
      thumbWidth: 384,
      thumbHeight: 256
    });

    const size = await firstValueFrom(service.thumbSize());
    expect(size).toBe('large');
  });
});
