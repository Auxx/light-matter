import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualPaneComponent } from './dual-pane.component';

describe('DualPaneComponent', () => {
  let component: DualPaneComponent;
  let fixture: ComponentFixture<DualPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DualPaneComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DualPaneComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
