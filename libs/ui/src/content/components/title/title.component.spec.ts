import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleComponent } from './title.component';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TitleComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
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
      expect(styles.getPropertyValue('--color')).toBe('var(--content-default-lowest)');

      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--color')).toBe('var(--content-primary-lowest)');

      fixture.componentRef.setInput('variant', 'warn');
      fixture.detectChanges();
      expect(styles.getPropertyValue('--color')).toBe('var(--content-warn-lowest)');
    });
  });
});
