import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExifTags } from 'internal-api';
import { ExifInfoComponent } from './exif-info.component';

describe('ExifInfoComponent', () => {
  let component: ExifInfoComponent;
  let fixture: ComponentFixture<ExifInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ExifInfoComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExifInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render loading state when exif is false', () => {
    fixture.componentRef.setInput('exif', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const dtList = compiled.querySelectorAll('dt');
    const ddList = compiled.querySelectorAll('dd');

    expect(dtList.length).toBe(1);
    expect(dtList[0].textContent).toBe('Loading...');
    expect(ddList.length).toBe(1);
    expect(ddList[0].textContent).toBe('');
  });

  it('should render basic metadata and dimensions when exif data is loaded', () => {
    const mockExif: ExifTags = {
      FileName: 'photo.jpg',
      FileSize: '3.5 MB',
      FileType: 'JPEG',
      MIMEType: 'image/jpeg'
    };

    fixture.componentRef.setInput('exif', mockExif);
    fixture.componentRef.setInput('dimensions', { width: 1920, height: 1080 });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';

    expect(text).toContain('File name');
    expect(text).toContain('photo.jpg');
    expect(text).toContain('File size');
    expect(text).toContain('3.5 MB');
    expect(text).toContain('Format');
    expect(text).toContain('JPEG');
    expect(text).toContain('MIME type');
    expect(text).toContain('image/jpeg');
    expect(text).toContain('Dimensions');
    expect(text).toContain('1920 x 1080');

    // Optional fields should not be present
    expect(text).not.toContain('Comment');
    expect(text).not.toContain('Camera make');
    expect(text).not.toContain('Camera model');
    expect(text).not.toContain('Lens');
    expect(text).not.toContain('GPS coordinates');
  });

  it('should render all optional metadata fields when they are provided', () => {
    const mockExif: ExifTags = {
      FileName: 'landscape.jpg',
      FileSize: '12 MB',
      FileType: 'JPEG',
      MIMEType: 'image/jpeg',
      Comment: 'A scenic mountain landscape',
      ColorComponents: 3,
      BitsPerSample: 8,
      ImagePixelDepth: '8-bit',
      ChromaFormat: '4:2:0',
      YCbCrSubSampling: '2 2',
      EncodingProcess: 'Baseline DCT',
      ColorPrimaries: 'sRGB',
      ProfileDescription: 'Display P3',
      ColorSpace: 'sRGB',
      GPSLatitude: '37.7749 N',
      GPSLongitude: '122.4194 W',
      Make: 'Sony',
      Model: 'ILCE-7RM4',
      LensID: 'FE 24-70mm F2.8 GM',
      FocalLength: '35 mm',
      ShutterSpeedValue: '1/1000',
      ISO: 200
    };

    fixture.componentRef.setInput('exif', mockExif);
    fixture.componentRef.setInput('dimensions', { width: 4000, height: 3000 });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';

    expect(text).toContain('Comment');
    expect(text).toContain('A scenic mountain landscape');
    expect(text).toContain('Color components');
    expect(text).toContain('3');
    expect(text).toContain('Bits per sample');
    expect(text).toContain('8');
    expect(text).toContain('Image pixel depth');
    expect(text).toContain('8-bit');
    expect(text).toContain('Chroma format');
    expect(text).toContain('4:2:0');
    expect(text).toContain('YCbCr sub sampling');
    expect(text).toContain('2 2');
    expect(text).toContain('Encoding process');
    expect(text).toContain('Baseline DCT');
    expect(text).toContain('Color primaries');
    expect(text).toContain('sRGB');
    expect(text).toContain('Colour profile');
    expect(text).toContain('Display P3');
    expect(text).toContain('Colour space');
    expect(text).toContain('sRGB');
    expect(text).toContain('GPS coordinates');
    expect(text).toContain('37.7749 N 122.4194 W');
    expect(text).toContain('Camera make');
    expect(text).toContain('Sony');
    expect(text).toContain('Camera model');
    expect(text).toContain('ILCE-7RM4');
    expect(text).toContain('Lens');
    expect(text).toContain('FE 24-70mm F2.8 GM');
    expect(text).toContain('Focal length');
    expect(text).toContain('35 mm');
    expect(text).toContain('Shutter speed');
    expect(text).toContain('1/1000');
    expect(text).toContain('ISO');
    expect(text).toContain('200');
  });

  it('should not render GPS coordinates if latitude or longitude is missing', () => {
    const mockExif: ExifTags = {
      FileName: 'photo.jpg',
      FileSize: '1 MB',
      FileType: 'JPEG',
      MIMEType: 'image/jpeg',
      GPSLatitude: '37.7749 N'
      // GPSLongitude omitted
    };

    fixture.componentRef.setInput('exif', mockExif);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';

    expect(text).not.toContain('GPS coordinates');
  });
});
