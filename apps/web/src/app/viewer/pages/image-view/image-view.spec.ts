import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageView } from './image-view';

describe('ImageView', () => {
  let component: ImageView;
  let fixture: ComponentFixture<ImageView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageView],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
