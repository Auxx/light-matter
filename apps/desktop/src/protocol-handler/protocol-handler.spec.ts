import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { getMimeType, protocolHandler, streamFile } from './protocol-handler';

const mockCacheManager = {
  get: jest.fn()
};

const mockThumbManager = {
  generate: jest.fn()
};

jest.mock('../injector/injector', () => {
  return {
    Injector: {
      getInstance: () => ({
        inject: (key: string) => {
          if (key === 'CacheManager') {
            return mockCacheManager;
          }
          if (key === 'ThumbManager') {
            return mockThumbManager;
          }
          return {};
        }
      })
    }
  };
});

describe('protocolHandler', () => {
  let tempDir: string;
  let testImagePath: string;
  let testPngPath: string;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'light-matter-protocol-test-'));
    testImagePath = path.join(tempDir, 'test-image.jpg');
    testPngPath = path.join(tempDir, 'test-image.png');
    fs.writeFileSync(testImagePath, 'fake-jpeg-data');
    fs.writeFileSync(testPngPath, 'fake-png-data');
  });

  afterAll(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (err) {
      console.error('Failed to clean up test directory:', err);
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMimeType', () => {
    it('should return correct MIME types for supported extensions', () => {
      expect(getMimeType('photo.jpg')).toBe('image/jpeg');
      expect(getMimeType('photo.jpeg')).toBe('image/jpeg');
      expect(getMimeType('image.png')).toBe('image/png');
      expect(getMimeType('image.webp')).toBe('image/webp');
      expect(getMimeType('image.jxl')).toBe('image/jxl');
      expect(getMimeType('image.gif')).toBe('image/gif');
      expect(getMimeType('vector.svg')).toBe('image/svg+xml');
      expect(getMimeType('photo.avif')).toBe('image/avif');
      expect(getMimeType('photo.bmp')).toBe('image/bmp');
      expect(getMimeType('file.xyz')).toBe('application/octet-stream');
    });
  });

  describe('streamFile', () => {
    it('should return a 404 response for non-existent files', async () => {
      const response = streamFile(path.join(tempDir, 'non-existent.jpg'));
      expect(response.status).toBe(404);
      expect(await response.text()).toBe('Not found');
    });

    it('should return a 200 response with readable stream and correct MIME type for existing files', async () => {
      const response = streamFile(testImagePath);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('image/jpeg');
      expect(response.body).toBeDefined();

      const text = await response.text();
      expect(text).toBe('fake-jpeg-data');
    });
  });

  describe('protocolHandler route handling', () => {
    it('should return 404 for unknown endpoints', async () => {
      const request = new Request('atom://app/unknown');
      const response = await protocolHandler(request);
      expect(response.status).toBe(404);
    });

    describe('/raw endpoint', () => {
      it('should return 404 if image parameter is missing', async () => {
        const request = new Request('atom://app/raw');
        const response = await protocolHandler(request);
        expect(response.status).toBe(404);
      });

      it('should stream the raw image if file exists', async () => {
        const encodedPath = encodeURIComponent(testPngPath);
        const request = new Request(`atom://app/raw?image=${encodedPath}`);
        const response = await protocolHandler(request);
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('image/png');
        expect(await response.text()).toBe('fake-png-data');
      });

      it('should return 404 if target file does not exist', async () => {
        const encodedPath = encodeURIComponent(path.join(tempDir, 'missing.png'));
        const request = new Request(`atom://app/raw?image=${encodedPath}`);
        const response = await protocolHandler(request);
        expect(response.status).toBe(404);
      });
    });

    describe('/thumbs endpoint', () => {
      it('should return 404 if image parameter is missing', async () => {
        const request = new Request('atom://app/thumbs?width=200&height=200');
        const response = await protocolHandler(request);
        expect(response.status).toBe(404);
      });

      it('should call cacheManager and stream thumbnail when available', async () => {
        mockCacheManager.get.mockResolvedValue(testImagePath);

        const encodedPath = encodeURIComponent(testImagePath);
        const request = new Request(`atom://app/thumbs?image=${encodedPath}&width=200&height=200`);
        const response = await protocolHandler(request);

        expect(mockCacheManager.get).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('image/jpeg');
        expect(await response.text()).toBe('fake-jpeg-data');
      });

      it('should fallback to source file if cacheManager.get returns null', async () => {
        mockCacheManager.get.mockResolvedValue(null);

        const encodedPath = encodeURIComponent(testImagePath);
        const request = new Request(`atom://app/thumbs?image=${encodedPath}&width=200&height=200`);
        const response = await protocolHandler(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('image/jpeg');
        expect(await response.text()).toBe('fake-jpeg-data');
      });

      it('should return 404 if generated/fallback file does not exist', async () => {
        mockCacheManager.get.mockResolvedValue(path.join(tempDir, 'missing-thumb.jpg'));

        const encodedPath = encodeURIComponent(path.join(tempDir, 'missing-source.jpg'));
        const request = new Request(`atom://app/thumbs?image=${encodedPath}&width=200&height=200`);
        const response = await protocolHandler(request);

        expect(response.status).toBe(404);
      });
    });
  });
});
