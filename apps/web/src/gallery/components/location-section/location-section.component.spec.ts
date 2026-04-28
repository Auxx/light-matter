import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSectionComponent } from './location-section.component';

describe('LocationSectionComponent', () => {
  let component: LocationSectionComponent;
  let fixture: ComponentFixture<LocationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationSectionComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LocationSectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
