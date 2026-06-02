import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  const dialogData = { title: 'title', description: 'description' };

  const dialogRef = {
    open: jest.fn().mockReturnValue({ closed: of(true) })
  };

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

  describe('open', () => {
    it('should open a dialog and pass data', () => {
      const options = { title: 'title', description: 'description' };
      ConfirmationDialogComponent.open(dialogRef as unknown as Dialog, options);
      expect(dialogRef.open).toHaveBeenCalledWith(ConfirmationDialogComponent, { data: options });
    });
  });
});
