import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchLessonCardSkeletonComponent } from './watch-lesson-card-skeleton.component';

describe('WatchLessonCardSkeletonComponent', () => {
  let component: WatchLessonCardSkeletonComponent;
  let fixture: ComponentFixture<WatchLessonCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchLessonCardSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchLessonCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
