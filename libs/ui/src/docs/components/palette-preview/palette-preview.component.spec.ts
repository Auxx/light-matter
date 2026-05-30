import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalettePreviewComponent } from './palette-preview.component';

describe('PalettePreviewComponent', () => {
  let component: PalettePreviewComponent;
  let fixture: ComponentFixture<PalettePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PalettePreviewComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PalettePreviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
