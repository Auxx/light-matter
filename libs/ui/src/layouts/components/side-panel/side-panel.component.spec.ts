import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelComponent } from './side-panel.component';

xdescribe('SidePanelComponent', () => {
  let component: SidePanelComponent;
  let fixture: ComponentFixture<SidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SidePanelComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SidePanelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
