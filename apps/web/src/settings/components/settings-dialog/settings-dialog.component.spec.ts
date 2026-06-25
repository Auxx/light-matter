import { DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CacheManager } from '../../../ipc/cache-manager';

import { SettingsDialogComponent } from './settings-dialog.component';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let fixture: ComponentFixture<SettingsDialogComponent>;

  const dialogRef = {};

  const cacheManager = {
    cacheSize: jest.fn().mockResolvedValue(0)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SettingsDialogComponent ],
      providers: [
        { provide: DialogRef, useValue: dialogRef },
        { provide: CacheManager, useValue: cacheManager }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
