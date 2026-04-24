import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryPage } from './gallery.page';

describe('GalleryPage', () => {
  let component: GalleryPage;
  let fixture: ComponentFixture<GalleryPage>;

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
});
