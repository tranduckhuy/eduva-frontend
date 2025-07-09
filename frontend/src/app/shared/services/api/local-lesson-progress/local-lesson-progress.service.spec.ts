import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LessonProgressService } from './local-lesson-progress.service';

describe('LessonProgressService', () => {
  let service: LessonProgressService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
    });
    TestBed.configureTestingModule({
      providers: [LessonProgressService],
    });
    service = TestBed.inject(LessonProgressService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get last lesson for a class', () => {
    service.setLastLesson('class1', 'folder1', 'material1');
    const result = service.getLastLesson('class1');
    expect(result).toEqual({ folder: 'folder1', material: 'material1' });
  });

  it('should return null if no last lesson for class', () => {
    expect(service.getLastLesson('unknown')).toBeNull();
  });

  it('should remove last lesson for a class', () => {
    service.setLastLesson('class1', 'folder1', 'material1');
    service.removeLastLesson('class1');
    expect(service.getLastLesson('class1')).toBeNull();
  });

  it('should clear all lessons', () => {
    service.setLastLesson('class1', 'folder1', 'material1');
    service.setLastLesson('class2', 'folder2', 'material2');
    service.clearAll();
    expect(localStorageMock['lastLessons']).toBeUndefined();
  });
});
