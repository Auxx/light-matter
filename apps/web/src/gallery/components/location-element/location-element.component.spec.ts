import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationElementComponent } from './location-element.component';

describe('LocationElementComponent', () => {
  let component: LocationElementComponent;
  let fixture: ComponentFixture<LocationElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationElementComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LocationElementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
