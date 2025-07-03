import { TestBed } from '@angular/core/testing';

import { LocalLessonProgressService } from './local-lesson-progress.service';

describe('LocalLessonProgressService', () => {
  let service: LocalLessonProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalLessonProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
