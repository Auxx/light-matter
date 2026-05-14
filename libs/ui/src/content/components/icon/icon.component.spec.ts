import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';

xdescribe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('size', () => {
    it('should set correct size class', () => {
      const styles: CSSStyleDeclaration = fixture.debugElement.styles as unknown as CSSStyleDeclaration;

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--icon-size')).toBe('var(--icon-size-medium)');

      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--icon-size')).toBe('var(--icon-size-small)');

      fixture.componentRef.setInput('size', 'x-small');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--icon-size')).toBe('var(--icon-size-x-small)');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--icon-size')).toBe('var(--icon-size-large)');

      fixture.componentRef.setInput('size', 'x-large');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--icon-size')).toBe('var(--icon-size-x-large)');
    });
  });
});
