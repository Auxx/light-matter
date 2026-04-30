import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationListingComponent } from './location-listing.component';

describe('LocationListingComponent', () => {
  let component: LocationListingComponent;
  let fixture: ComponentFixture<LocationListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationListingComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LocationListingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
