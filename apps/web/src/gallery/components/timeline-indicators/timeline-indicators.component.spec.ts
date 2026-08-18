import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { YearGroup } from '../images/images.component.types';
import { TimelineIndicatorsComponent } from './timeline-indicators.component';

describe('TimelineIndicatorsComponent', () => {
  let component: TimelineIndicatorsComponent;
  let componentRef: ComponentRef<TimelineIndicatorsComponent>;
  let fixture: ComponentFixture<TimelineIndicatorsComponent>;

  const mockGroups: YearGroup[] = [
    {
      year: 2024,
      months: [
        {
          year: 2024,
          month: 4,
          monthName: 'May',
          sectionId: 'date-group-2024-4',
          images: []
        },
        {
          year: 2024,
          month: 0,
          monthName: 'January',
          sectionId: 'date-group-2024-0',
          images: []
        }
      ]
    },
    {
      year: 2023,
      months: [
        {
          year: 2023,
          month: 10,
          monthName: 'November',
          sectionId: 'date-group-2023-10',
          images: []
        }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TimelineIndicatorsComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineIndicatorsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('groups', mockGroups);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render year milestones and month buttons', () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    const yearLabels = element.querySelectorAll('.timeline-year-label');
    expect(yearLabels.length).toBe(2);
    expect(yearLabels[0].textContent?.trim()).toBe('2024');
    expect(yearLabels[1].textContent?.trim()).toBe('2023');

    const monthButtons = element.querySelectorAll('.timeline-indicator-btn');
    expect(monthButtons.length).toBe(3);
    expect(monthButtons[0].textContent?.trim()).toBe('May');
    expect(monthButtons[1].textContent?.trim()).toBe('Jan');
    expect(monthButtons[2].textContent?.trim()).toBe('Nov');
  });

  it('should apply active class to the currently active section', () => {
    componentRef.setInput('activeSectionId', 'date-group-2024-0');
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const buttons = element.querySelectorAll('.timeline-indicator-btn');
    expect(buttons[0].classList.contains('active')).toBe(false);
    expect(buttons[1].classList.contains('active')).toBe(true);
    expect(buttons[2].classList.contains('active')).toBe(false);
  });

  it('should emit sectionSelect when a month indicator button is clicked', () => {
    let selectedId: string | null = null;
    component.sectionSelect.subscribe(id => {
      selectedId = id;
    });

    fixture.detectChanges();
    const buttonDe = fixture.debugElement.query(By.css('.timeline-indicator-btn'));
    buttonDe.triggerEventHandler('click', null);

    expect(selectedId).toBe('date-group-2024-4');
  });
});
