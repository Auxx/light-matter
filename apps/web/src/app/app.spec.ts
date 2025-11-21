import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ App ]
    }).compileComponents();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
