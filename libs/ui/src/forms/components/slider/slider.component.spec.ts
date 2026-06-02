import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SliderComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('variant', () => {
    it('should set correct colour based on variant', () => {
      const styles: CSSStyleDeclaration = fixture.debugElement.styles as unknown as CSSStyleDeclaration;

      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--track-color')).toBe('var(--color-element-default-low)');
      expect(styles.getPropertyValue('--indicator-color')).toBe('var(--color-contrast-default-lowest)');

      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--track-color')).toBe('var(--color-element-primary-low)');
      expect(styles.getPropertyValue('--indicator-color')).toBe('var(--color-contrast-primary-lowest)');

      fixture.componentRef.setInput('variant', 'warn');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--track-color')).toBe('var(--color-element-warn-low)');
      expect(styles.getPropertyValue('--indicator-color')).toBe('var(--color-contrast-warn-lowest)');
    });
  });

  describe('min', () => {
    it('should adjust position based on a set minimum', () => {
      const styles: CSSStyleDeclaration = fixture.debugElement.styles as unknown as CSSStyleDeclaration;
      fixture.componentRef.setInput('max', 100);

      fixture.componentRef.setInput('min', 10);
      component.writeValue(10);
      fixture.detectChanges();
      expect(styles.getPropertyValue('--position')).toBe('0%');

      component.writeValue(55);
      fixture.detectChanges();
      expect(styles.getPropertyValue('--position')).toBe('50%');

      fixture.componentRef.setInput('min', 20);
      component.writeValue(20);
      fixture.detectChanges();
      expect(styles.getPropertyValue('--position')).toBe('0%');

      component.writeValue(55);
      fixture.detectChanges();
      expect(styles.getPropertyValue('--position')).toBe('43.75%');
    });
  });

  describe('man', () => {
    it('should adjust position based on a set maximum', () => {
      const styles: CSSStyleDeclaration = fixture.debugElement.styles as unknown as CSSStyleDeclaration;
      fixture.componentRef.setInput('min', 0);

      fixture.componentRef.setInput('max', 80);
      component.writeValue(80);
      fixture.detectChanges();
      expect(styles.getPropertyValue('--position')).toBe('100%');

      component.writeValue(55);
      fixture.detectChanges();
      expect(styles.getPropertyValue('--position')).toBe('68.75%');

      fixture.componentRef.setInput('max', 60);
      component.writeValue(60);
      fixture.detectChanges();
      expect(styles.getPropertyValue('--position')).toBe('100%');

      component.writeValue(30);
      fixture.detectChanges();
      expect(styles.getPropertyValue('--position')).toBe('50%');
    });
  });
});
