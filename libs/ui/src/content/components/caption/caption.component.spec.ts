import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionComponent } from './caption.component';

describe('CaptionComponent', () => {
  let component: CaptionComponent;
  let fixture: ComponentFixture<CaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CaptionComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaptionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
