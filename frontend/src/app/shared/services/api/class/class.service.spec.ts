import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ClassService } from './class.service';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { StatusCode } from '../../../constants/status-code.constant';
import { of, throwError } from 'rxjs';

describe('ClassService', () => {
  let service: ClassService;
  let requestService: any;
  let toastService: any;

  const mockClass = {
    id: '1',
    schoolId: 1,
    className: 'Test Class',
    name: 'Test Class',
    classCode: 'C1',
    classId: 'C1',
    studentId: 'S1',
    teacherName: 'Teacher',
    studentName: 'Student',
    schoolName: 'Test School',
    backgroundImageUrl: '',
    teacherAvatarUrl: '',
    studentAvatarUrl: '',
    enrolledAt: '2024-01-01',
    classStatus: 0,
    countLessonMaterial: 10,
  };
  const mockClasses = [
    mockClass,
    {
      ...mockClass,
      id: '2',
      className: 'Class 2',
      name: 'Class 2',
      classCode: 'C2',
      classId: 'C2',
    },
  ];
  const mockListResponse = {
    statusCode: StatusCode.SUCCESS,
    data: { data: mockClasses, count: 2 },
  };
  const mockEntityList = { data: mockClasses, count: 2 };

  beforeEach(() => {
    requestService = { get: vi.fn() };
    toastService = { errorGeneral: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        ClassService,
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastService },
      ],
    });
    service = TestBed.inject(ClassService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get student classes enrolled and update signals on success', async () => {
    requestService.get.mockReturnValue(of(mockListResponse));
    const result = await service
      .getStudentClassesEnrolled({} as any)
      .toPromise();
    expect(result).toEqual(mockEntityList);
    expect(service.classes()).toEqual(mockClasses);
    expect(service.totalClass()).toBe(2);
    expect(toastService.errorGeneral).not.toHaveBeenCalled();
  });

  it('should handle error in getStudentClassesEnrolled', async () => {
    requestService.get.mockReturnValue(throwError(() => new Error('fail')));
    const result = await service
      .getStudentClassesEnrolled({} as any)
      .toPromise();
    expect(result).toBeUndefined(); // EMPTY observable emits nothing
    expect(toastService.errorGeneral).not.toHaveBeenCalled();
  });

  it('should get student class by id and update signal on success', async () => {
    const mockResponse = { statusCode: StatusCode.SUCCESS, data: mockClass };
    requestService.get.mockReturnValue(of(mockResponse));
    const result = await service.getStudentClassById('1').toPromise();
    expect(result).toEqual(mockClass);
    expect(service.classModel()).toEqual(mockClass);
    expect(toastService.errorGeneral).not.toHaveBeenCalled();
  });

  it('should handle error in getStudentClassById', async () => {
    requestService.get.mockReturnValue(throwError(() => new Error('fail')));
    const result = await service.getStudentClassById('1').toPromise();
    expect(result).toBeNull();
    expect(toastService.errorGeneral).toHaveBeenCalled();
  });

  it('should clear classes and totalClass signals', () => {
    service['classesSignal'].set(mockClasses);
    service['totalClassSignal'].set(5);
    service.clearClasses();
    expect(service.classes()).toEqual([]);
    expect(service.totalClass()).toBe(0);
  });
});
