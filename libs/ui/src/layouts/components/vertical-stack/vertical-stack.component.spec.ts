import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalStackComponent } from './vertical-stack.component';

describe('VerticalStackComponent', () => {
  let component: VerticalStackComponent;
  let fixture: ComponentFixture<VerticalStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VerticalStackComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VerticalStackComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
