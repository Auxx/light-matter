import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerticalDivider } from './vertical-divider';

describe('VerticalDivider', () => {
  let component: VerticalDivider;
  let fixture: ComponentFixture<VerticalDivider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VerticalDivider ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalDivider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
