import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolMenuComponent } from './tool-menu.component';

describe('ToolMenuComponent', () => {
  let component: ToolMenuComponent;
  let fixture: ComponentFixture<ToolMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ToolMenuComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ToolMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
