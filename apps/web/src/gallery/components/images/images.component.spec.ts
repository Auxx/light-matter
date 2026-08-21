import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileInfo } from 'internal-api';
import { MockComponents } from 'ng-mocks';
import { ThumbnailComponent } from '../../../ui/components/thumbnail/thumbnail.component';

import { ImagesComponent } from './images.component';
import { groupImagesByYearAndMonth } from './images.component.types';

describe('ImagesComponent', () => {
  let component: ImagesComponent;
  let componentRef: ComponentRef<ImagesComponent>;
  let fixture: ComponentFixture<ImagesComponent>;

  const mockFile = (path: string, createdAt: number): FileInfo => ({
    name: path.split('/').pop() ?? path,
    path,
    size: 1024,
    createdAt
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ImagesComponent,
        MockComponents(ThumbnailComponent)
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ImagesComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('images', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('groupImagesByYearAndMonth', () => {
    it('should return empty array for null or empty list', () => {
      expect(groupImagesByYearAndMonth(null)).toEqual([]);
      expect(groupImagesByYearAndMonth([])).toEqual([]);
    });

    it('should group images by year and month preserving order', () => {
      // 2024-05-15, 2024-05-10, 2024-01-20, 2023-11-05
      const img1 = mockFile('/img1.jpg', new Date(2024, 4, 15).getTime()); // May 2024
      const img2 = mockFile('/img2.jpg', new Date(2024, 4, 10).getTime()); // May 2024
      const img3 = mockFile('/img3.jpg', new Date(2024, 0, 20).getTime()); // Jan 2024
      const img4 = mockFile('/img4.jpg', new Date(2023, 10, 5).getTime()); // Nov 2023

      const groups = groupImagesByYearAndMonth([ img1, img2, img3, img4 ]);

      expect(groups.length).toBe(2);

      // 2024 group
      expect(groups[0].year).toBe(2024);
      expect(groups[0].months.length).toBe(2);
      expect(groups[0].months[0].month).toBe(4);
      expect(groups[0].months[0].monthName).toBe('May');
      expect(groups[0].months[0].sectionId).toBe('date-group-2024-4');
      expect(groups[0].months[0].images).toEqual([ img1, img2 ]);

      expect(groups[0].months[1].month).toBe(0);
      expect(groups[0].months[1].monthName).toBe('January');
      expect(groups[0].months[1].sectionId).toBe('date-group-2024-0');
      expect(groups[0].months[1].images).toEqual([ img3 ]);

      // 2023 group
      expect(groups[1].year).toBe(2023);
      expect(groups[1].months.length).toBe(1);
      expect(groups[1].months[0].month).toBe(10);
      expect(groups[1].months[0].monthName).toBe('November');
      expect(groups[1].months[0].sectionId).toBe('date-group-2023-10');
      expect(groups[1].months[0].images).toEqual([ img4 ]);
    });
  });

  describe('computed signals', () => {
    it('should determine isDateSorted correctly based on sortBy input', () => {
      componentRef.setInput('sortBy', 'name');
      fixture.detectChanges();
      expect(component.isDateSorted()).toBe(false);

      componentRef.setInput('sortBy', 'size');
      fixture.detectChanges();
      expect(component.isDateSorted()).toBe(false);

      componentRef.setInput('sortBy', 'date');
      fixture.detectChanges();
      expect(component.isDateSorted()).toBe(true);
    });

    it('should return empty groupedImages when not sorted by date', () => {
      const img = mockFile('/img1.jpg', new Date(2024, 5, 1).getTime());
      componentRef.setInput('images', [ img ]);
      componentRef.setInput('sortBy', 'name');
      fixture.detectChanges();

      expect(component.groupedImages()).toEqual([]);
    });

    it('should compute groupedImages when sorted by date', () => {
      const img = mockFile('/img1.jpg', new Date(2024, 5, 1).getTime());
      componentRef.setInput('images', [ img ]);
      componentRef.setInput('sortBy', 'date');
      fixture.detectChanges();

      const groups = component.groupedImages();
      expect(groups.length).toBe(1);
      expect(groups[0].year).toBe(2024);
      expect(groups[0].months[0].monthName).toBe('June');
      expect(groups[0].months[0].images).toEqual([ img ]);
    });
  });

  describe('template rendering', () => {
    it('should render flat list when sortBy is name', () => {
      const img1 = mockFile('/img1.jpg', new Date(2024, 5, 1).getTime());
      const img2 = mockFile('/img2.jpg', new Date(2023, 10, 1).getTime());

      componentRef.setInput('images', [ img1, img2 ]);
      componentRef.setInput('sortBy', 'name');
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.querySelector('.gallery-layout')).toBeNull();
      expect(element.querySelectorAll('.year-group').length).toBe(0);
      expect(element.querySelectorAll('app-thumbnail').length).toBe(2);
    });

    it('should render grouped sections when sortBy is date', () => {
      const img1 = mockFile('/img1.jpg', new Date(2024, 5, 1).getTime());
      const img2 = mockFile('/img2.jpg', new Date(2023, 10, 1).getTime());

      componentRef.setInput('images', [ img1, img2 ]);
      componentRef.setInput('sortBy', 'date');
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.querySelector('.gallery-layout')).not.toBeNull();
      expect(element.querySelectorAll('.year-group').length).toBe(2);
      expect(element.querySelectorAll('.month-group').length).toBe(2);
      expect(element.querySelectorAll('app-thumbnail').length).toBe(2);
      expect(element.querySelector('app-timeline-indicators')).not.toBeNull();
    });

    it('should show empty message when images list is empty', () => {
      componentRef.setInput('images', []);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('No images found in this folder.');
    });
  });

  describe('timeline navigation and scrolling', () => {
    it('should call scrollIntoView and update activeSectionId on scrollToSection', () => {
      const img = mockFile('/img1.jpg', new Date(2024, 4, 1).getTime());
      componentRef.setInput('images', [ img ]);
      componentRef.setInput('sortBy', 'date');
      fixture.detectChanges();

      const targetSection = fixture.nativeElement.querySelector('#date-group-2024-4');
      expect(targetSection).not.toBeNull();

      const scrollSpy = jest.fn();
      targetSection.scrollIntoView = scrollSpy;

      component.scrollToSection('date-group-2024-4');

      expect(component.activeSectionId()).toBe('date-group-2024-4');
      expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });
  });
});
