import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatButtonComponent } from './flat-button.component';

describe('FlatButtonComponent', () => {
  let component: FlatButtonComponent;
  let fixture: ComponentFixture<FlatButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FlatButtonComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FlatButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
