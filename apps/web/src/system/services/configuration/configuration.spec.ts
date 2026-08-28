import { TestBed } from '@angular/core/testing';
import { defaultThumbHeight, defaultThumbWidth } from 'internal-api';
import { firstValueFrom } from 'rxjs';
import { FileSystem } from '../../../ipc/file-system';
import { ProcessManager } from '../../../ipc/process-manager';
import { Configuration } from './configuration';

describe('Configuration', () => {
  let service: Configuration;
  let fileSystemMock: {
    readJson: jest.Mock;
    writeJson: jest.Mock;
  };
  let processManagerMock: {
    getSystemPaths: jest.Mock;
  };

  beforeEach(() => {
    fileSystemMock = {
      readJson: jest.fn().mockResolvedValue({ success: false }),
      writeJson: jest.fn().mockResolvedValue({ success: true })
    };
    processManagerMock = {
      getSystemPaths: jest.fn().mockResolvedValue({
        pictures: '/pictures',
        appConfig: '/config.json'
      })
    };

    TestBed.configureTestingModule({
      providers: [
        Configuration,
        { provide: FileSystem, useValue: fileSystemMock },
        { provide: ProcessManager, useValue: processManagerMock }
      ]
    });
    service = TestBed.inject(Configuration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default thumbnail dimensions when no existing config', async () => {
    const config = await firstValueFrom(service.config());
    expect(config.gallery.thumbWidth).toBe(defaultThumbWidth);
    expect(config.gallery.thumbHeight).toBe(defaultThumbHeight);
  });
});
