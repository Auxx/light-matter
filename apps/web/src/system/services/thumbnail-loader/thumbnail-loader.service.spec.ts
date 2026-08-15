import { TestBed } from '@angular/core/testing';
import { ThumbnailLoaderService } from './thumbnail-loader.service';

class MockImage {
  private _src = '';
  listeners: { [event: string]: Array<() => void>; } = {};

  addEventListener(event: string, callback: () => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event: string, callback: () => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  set src(val: string) {
    this._src = val;
  }

  get src() {
    return this._src;
  }

  triggerLoad() {
    this.listeners['load']?.forEach(cb => cb());
  }

  triggerError() {
    this.listeners['error']?.forEach(cb => cb());
  }
}

describe('ThumbnailLoaderService', () => {
  let service: ThumbnailLoaderService;
  let mockImages: MockImage[];
  const originalImage = globalThis.Image;

  beforeEach(() => {
    mockImages = [];
    globalThis.Image = class extends MockImage {
      constructor() {
        super();
        mockImages.push(this);
      }
    } as unknown as typeof Image;

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThumbnailLoaderService);
  });

  afterEach(() => {
    globalThis.Image = originalImage;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when image loads successfully', () => {
    let result: boolean | undefined;
    service.add('test.jpg').subscribe(val => (result = val));

    expect(mockImages.length).toBe(1);
    expect(mockImages[0].src).toBe('test.jpg');

    mockImages[0].triggerLoad();
    expect(result).toBe(true);
  });

  it('should emit false when image fails to load', () => {
    let result: boolean | undefined;
    service.add('test.jpg').subscribe(val => (result = val));

    expect(mockImages.length).toBe(1);
    expect(mockImages[0].src).toBe('test.jpg');

    mockImages[0].triggerError();
    expect(result).toBe(false);
  });

  it('should limit concurrency to 4 simultaneous image requests and process subsequent items on completion', () => {
    const results: boolean[] = [];
    service.add('url1').subscribe(r => results.push(r));
    service.add('url2').subscribe(r => results.push(r));
    service.add('url3').subscribe(r => results.push(r));
    service.add('url4').subscribe(r => results.push(r));
    service.add('url5').subscribe(r => results.push(r));
    service.add('url6').subscribe(r => results.push(r));

    expect(mockImages.length).toBe(4);
    expect(mockImages.map(img => img.src)).toEqual([ 'url1', 'url2', 'url3', 'url4' ]);

    // Complete first image
    mockImages[0].triggerLoad();
    expect(mockImages.length).toBe(5);
    expect(mockImages[4].src).toBe('url5');
    expect(results).toEqual([ true ]);

    // Complete second image
    mockImages[1].triggerLoad();
    expect(mockImages.length).toBe(6);
    expect(mockImages[5].src).toBe('url6');
    expect(results).toEqual([ true, true ]);
  });

  it('should cancel queued request before it starts and skip it when slot opens', () => {
    service.add('url1').subscribe();
    service.add('url2').subscribe();
    service.add('url3').subscribe();
    service.add('url4').subscribe();
    const sub5 = service.add('url5').subscribe();
    service.add('url6').subscribe();

    expect(mockImages.length).toBe(4);

    // Cancel queued sub5
    sub5.unsubscribe();

    // Complete url1 -> should start url6 instead of url5
    mockImages[0].triggerLoad();
    expect(mockImages.length).toBe(5);
    expect(mockImages[4].src).toBe('url6');
  });

  it('should abort in-flight request on unsubscription and immediately start next queued request', () => {
    const sub1 = service.add('url1').subscribe();
    service.add('url2').subscribe();
    service.add('url3').subscribe();
    service.add('url4').subscribe();
    service.add('url5').subscribe();

    expect(mockImages.length).toBe(4);

    // Cancel in-flight sub1
    sub1.unsubscribe();

    // sub1's image should have src cleared
    expect(mockImages[0].src).toBe('');

    // Next queued item (url5) should start immediately
    expect(mockImages.length).toBe(5);
    expect(mockImages[4].src).toBe('url5');
  });
});
