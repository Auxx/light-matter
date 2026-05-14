import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ActionButtonComponent } from './action-button.component';

describe('ActionButtonComponent', () => {
  let component: ActionButtonComponent;
  let fixture: ComponentFixture<ActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ActionButtonComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActionButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Presentation', () => {
    it('should have correct defaults', () => {
      expect(component.variant()).toBe('default');
      expect(component.type()).toBe('button');
      expect(component.size()).toBe('medium');
      expect(component.compact()).toBe(false);
      expect(component.disabled()).toBe(false);
    });
  });

  describe('variant', () => {
    it('should update color based on variant value', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();
      expect(fixture.debugElement.styles.getPropertyValue('--color')).toBe('var(--element-default-low)');
      expect(fixture.debugElement.styles.getPropertyValue('--highlight-color')).toBe('var(--surface-default-high)');

      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(fixture.debugElement.styles.getPropertyValue('--color')).toBe('var(--element-primary-low)');
      expect(fixture.debugElement.styles.getPropertyValue('--highlight-color')).toBe('var(--surface-primary-high)');

      fixture.componentRef.setInput('variant', 'warn');
      fixture.detectChanges();
      expect(fixture.debugElement.styles.getPropertyValue('--color')).toBe('var(--element-warn-low)');
      expect(fixture.debugElement.styles.getPropertyValue('--highlight-color')).toBe('var(--surface-warn-high)');
    });
  });

  describe('type', () => {
    it('should set correct button type', () => {
      fixture.componentRef.setInput('type', 'button');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('button')).attributes.type).toBe('button');

      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('button')).attributes.type).toBe('submit');

      fixture.componentRef.setInput('type', 'reset');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('button')).attributes.type).toBe('reset');
    });
  });

  describe('size', () => {
    it('should set correct size class', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(fixture.debugElement.classes['size-medium']).toBe(true);

      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(fixture.debugElement.classes['size-small']).toBe(true);

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(fixture.debugElement.classes['size-large']).toBe(true);
    });
  });

  describe('compact', () => {
    it('should set correct compact class', () => {
      fixture.componentRef.setInput('compact', true);
      fixture.detectChanges();
      expect(fixture.debugElement.classes['compact']).toBe(true);

      fixture.componentRef.setInput('compact', false);
      fixture.detectChanges();
      expect(fixture.debugElement.classes['compact']).toBeUndefined();
    });
  });

  describe('disabled', () => {
    it('should set correct disabled class', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(fixture.debugElement.classes['disabled']).toBe(true);

      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      expect(fixture.debugElement.classes['disabled']).toBeUndefined();
    });
  });

  describe('pressed', () => {
    it('should emit pressed event', () => {
      const pressedSpy = jest.spyOn(component.pressed, 'emit');
      fixture.debugElement.query(By.css('button')).triggerEventHandler('click');
      fixture.detectChanges();
      expect(pressedSpy).toHaveBeenCalled();
    });
  });
});
