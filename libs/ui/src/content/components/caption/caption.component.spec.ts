import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionComponent } from './caption.component';

describe('CaptionComponent', () => {
  let component: CaptionComponent;
  let fixture: ComponentFixture<CaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CaptionComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaptionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('variant', () => {
    it('should update color based on variant value', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();
      expect(fixture.debugElement.styles.getPropertyValue('--color')).toBe('var(--content-default-lowest)');

      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(fixture.debugElement.styles.getPropertyValue('--color')).toBe('var(--content-primary-lowest)');

      fixture.componentRef.setInput('variant', 'warn');
      fixture.detectChanges();
      expect(fixture.debugElement.styles.getPropertyValue('--color')).toBe('var(--content-warn-lowest)');
    });
  });
});
