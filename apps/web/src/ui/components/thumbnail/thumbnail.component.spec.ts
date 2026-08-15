import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileInfo } from 'internal-api';
import { Observable, Subject } from 'rxjs';
import { ThumbnailLoaderService } from '../../../system/services/thumbnail-loader/thumbnail-loader.service';
import { ThumbnailComponent } from './thumbnail.component';

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);

  constructor(public callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this);
  }

  static get lastInstance(): MockIntersectionObserver | null {
    return MockIntersectionObserver.instances.length > 0
      ? MockIntersectionObserver.instances[MockIntersectionObserver.instances.length - 1]
      : null;
  }

  triggerIntersect(isIntersecting: boolean) {
    this.callback(
      [
        {
          intersectionRatio: isIntersecting ? 1 : 0,
          isIntersecting,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: {} as Element,
          time: Date.now()
        }
      ],
      this as unknown as IntersectionObserver
    );
  }
}

describe('ThumbnailComponent', () => {
  let component: ThumbnailComponent;
  let fixture: ComponentFixture<ThumbnailComponent>;
  let loaderSubject: Subject<boolean>;
  let teardownSpy: jest.Mock;
  let addSpy: jest.Mock;
  const originalIntersectionObserver = globalThis.IntersectionObserver;

  const mockImage: FileInfo = {
    path: '/path/to/test.jpg',
    name: 'test.jpg'
  };

  beforeEach(async () => {
    MockIntersectionObserver.instances = [];
    globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

    teardownSpy = jest.fn();
    loaderSubject = new Subject<boolean>();

    addSpy = jest.fn().mockImplementation(() => {
      return new Observable<boolean>(subscriber => {
        const sub = loaderSubject.subscribe(subscriber);
        return () => {
          teardownSpy();
          sub.unsubscribe();
        };
      });
    });

    await TestBed.configureTestingModule({
      imports: [ ThumbnailComponent ],
      providers: [
        {
          provide: ThumbnailLoaderService,
          useValue: {
            add: addSpy
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThumbnailComponent);
    fixture.componentRef.setInput('image', mockImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
    window.IntersectionObserver = originalIntersectionObserver;
  });

  it('should create and observe native element', () => {
    expect(component).toBeTruthy();
    expect(MockIntersectionObserver.lastInstance).not.toBeNull();
    expect(MockIntersectionObserver.lastInstance?.observe).toHaveBeenCalledWith(fixture.nativeElement);
  });

  it('should disconnect IntersectionObserver on destroy', () => {
    fixture.destroy();
    expect(MockIntersectionObserver.lastInstance?.disconnect).toHaveBeenCalled();
  });

  it('should start loading thumbnail when becoming visible', () => {
    expect(addSpy).not.toHaveBeenCalled();

    MockIntersectionObserver.lastInstance?.triggerIntersect(true);
    fixture.detectChanges();

    expect(addSpy).toHaveBeenCalledWith(component.url());
    expect(component.isLoading()).toBe(true);

    const caption = fixture.debugElement.query(By.css('ui-caption'));
    expect(caption.nativeElement.textContent).toContain('Loading...');
  });

  it('should display image when loading succeeds', () => {
    MockIntersectionObserver.lastInstance?.triggerIntersect(true);
    fixture.detectChanges();

    loaderSubject.next(true);
    loaderSubject.complete();
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(false);

    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain(encodeURIComponent(mockImage.path));
  });

  it('should display error caption when loading fails', () => {
    MockIntersectionObserver.lastInstance?.triggerIntersect(true);
    fixture.detectChanges();

    loaderSubject.next(false);
    loaderSubject.complete();
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(true);

    const caption = fixture.debugElement.query(By.css('ui-caption'));
    expect(caption.nativeElement.textContent).toContain('Failed to load an image');
  });

  it('should unsubscribe from loader on destroy', () => {
    MockIntersectionObserver.lastInstance?.triggerIntersect(true);
    fixture.detectChanges();

    expect(teardownSpy).not.toHaveBeenCalled();

    fixture.destroy();
    expect(teardownSpy).toHaveBeenCalled();
  });

  it('should emit clicked output when button is clicked', () => {
    MockIntersectionObserver.lastInstance?.triggerIntersect(true);
    fixture.detectChanges();

    loaderSubject.next(true);
    loaderSubject.complete();
    fixture.detectChanges();

    const clickedSpy = jest.fn();
    component.clicked.subscribe(clickedSpy);

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(clickedSpy).toHaveBeenCalledWith(mockImage);
  });
});
