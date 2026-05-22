import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageRendererComponent } from './image-renderer.component';

describe('ImageRendererComponent', () => {
  let component: ImageRendererComponent;
  let fixture: ComponentFixture<ImageRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImageRendererComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ImageRendererComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
