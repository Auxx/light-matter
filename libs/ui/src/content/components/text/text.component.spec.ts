import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextComponent } from './text.component';

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TextComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('variant', () => {
    it('should update color based on variant value', () => {
      const styles: CSSStyleDeclaration = fixture.debugElement.styles as unknown as CSSStyleDeclaration;

      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--color')).toBe('var(--color-content-default-highest)');

      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--color')).toBe('var(--color-content-primary-highest)');

      fixture.componentRef.setInput('variant', 'warn');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--color')).toBe('var(--color-content-warn-highest)');
    });
  });

  describe('important', () => {
    it('should add important class when needed', () => {
      fixture.componentRef.setInput('important', true);
      fixture.detectChanges();
      expect(fixture.debugElement.classes['important']).toBe(true);

      fixture.componentRef.setInput('important', false);
      fixture.detectChanges();
      expect(fixture.debugElement.classes['important']).toBeUndefined();
    });
  });
});
