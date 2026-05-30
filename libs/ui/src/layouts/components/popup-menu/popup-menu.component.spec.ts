import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMenuComponent } from './popup-menu.component';

describe('PopupMenuComponent', () => {
  let component: PopupMenuComponent;
  let fixture: ComponentFixture<PopupMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PopupMenuComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PopupMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
