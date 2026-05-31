import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoOverlayComponent } from './info-overlay.component';

describe('InfoOverlayComponent', () => {
  let component: InfoOverlayComponent;
  let fixture: ComponentFixture<InfoOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InfoOverlayComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InfoOverlayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
