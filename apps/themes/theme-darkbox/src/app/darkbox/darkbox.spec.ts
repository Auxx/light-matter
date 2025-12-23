import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Darkbox } from './darkbox';

describe('Darkbox', () => {
  let component: Darkbox;
  let fixture: ComponentFixture<Darkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ Darkbox ]
    }).compileComponents();

    fixture = TestBed.createComponent(Darkbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
