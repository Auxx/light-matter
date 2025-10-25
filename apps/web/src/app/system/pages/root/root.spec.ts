import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Root } from './root';

describe('Root', () => {
  let component: Root;
  let fixture: ComponentFixture<Root>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Root]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Root);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
