import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  const dialogData = { title: 'title', description: 'description' };

  const dialogRef = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ConfirmationDialogComponent ],
      providers: [
        { provide: DIALOG_DATA, useValue: dialogData },
        { provide: DialogRef, useValue: dialogRef }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
