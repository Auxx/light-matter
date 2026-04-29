import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldersComponent } from './folders.component';

describe('FoldersComponent', () => {
  let component: FoldersComponent;
  let fixture: ComponentFixture<FoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FoldersComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoldersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
