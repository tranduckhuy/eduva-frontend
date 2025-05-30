import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchLessonsComponent } from './watch-lessons.component';

describe('WatchLessonComponent', () => {
  let component: WatchLessonsComponent;
  let fixture: ComponentFixture<WatchLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchLessonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
