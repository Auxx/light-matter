import { CdkMenuTrigger } from '@angular/cdk/menu';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionButtonComponent, IconComponent } from '@light-matter/ui';
import { MockComponents, MockDirectives } from 'ng-mocks';
import { StopPropagation } from '../../../ui/directives/stop-propagation/stop-propagation';

import { LocationElementComponent } from './location-element.component';

describe('LocationElementComponent', () => {
  let component: LocationElementComponent<unknown>;
  let fixture: ComponentFixture<LocationElementComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LocationElementComponent,
        MockComponents(
          IconComponent,
          ActionButtonComponent
        ),
        MockDirectives(
          StopPropagation,
          CdkMenuTrigger
        )
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LocationElementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
