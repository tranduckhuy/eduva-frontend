import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchLessonBadgeComponent } from './watch-lesson-badge.component';

describe('WatchLessonBadgeComponent', () => {
  let component: WatchLessonBadgeComponent;
  let fixture: ComponentFixture<WatchLessonBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchLessonBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchLessonBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
