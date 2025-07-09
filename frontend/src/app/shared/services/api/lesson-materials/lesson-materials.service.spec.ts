import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LessonMaterialsService } from './lesson-materials.service';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { StatusCode } from '../../../constants/status-code.constant';
import { of, throwError } from 'rxjs';

describe('LessonMaterialsService', () => {
  let service: LessonMaterialsService;
  let requestService: any;
  let toastService: any;

  const mockLessonMaterial = {
    id: '1',
    schoolId: 1,
    title: 'Material 1',
    description: 'desc',
    contentType: 0,
    tag: 'tag',
    lessonStatus: 0,
    duration: 100,
    fileSize: 1024,
    isAIContent: false,
    sourceUrl: 'http://example.com',
    visibility: 0,
    createdAt: '2024-01-01',
    lastModifiedAt: '2024-01-02',
    status: 0,
    createdById: 'U1',
    createdByName: 'User',
  };
  const mockLessonMaterials = [
    mockLessonMaterial,
    { ...mockLessonMaterial, id: '2', title: 'Material 2' },
  ];

  beforeEach(() => {
    requestService = { get: vi.fn() };
    toastService = { error: vi.fn(), errorGeneral: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        LessonMaterialsService,
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastService },
      ],
    });
    service = TestBed.inject(LessonMaterialsService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get lesson materials and update signal on success', async () => {
    const mockResponse = {
      statusCode: StatusCode.SUCCESS,
      data: { data: mockLessonMaterials },
    };
    requestService.get.mockReturnValue(of(mockResponse));
    const result = await service.getLessonMaterials({}).toPromise();
    expect(result).toEqual({ data: mockLessonMaterials });
    expect(service.lessonMaterials()).toEqual(mockLessonMaterials);
    expect(toastService.errorGeneral).not.toHaveBeenCalled();
  });

  it('should handle error in getLessonMaterials', async () => {
    requestService.get.mockReturnValue(throwError(() => new Error('fail')));
    const result = await service.getLessonMaterials({}).toPromise();
    expect(result).toBeNull();
    expect(toastService.errorGeneral).toHaveBeenCalled();
  });

  it('should fetch lesson material by id and update signal on success', async () => {
    const mockResponse = {
      statusCode: StatusCode.SUCCESS,
      data: mockLessonMaterial,
    };
    requestService.get.mockReturnValue(of(mockResponse));
    const result = await service.fetchLessonMaterialById('1').toPromise();
    expect(result).toEqual(mockLessonMaterial);
    expect(service.lessonMaterial()).toEqual(mockLessonMaterial);
    expect(toastService.errorGeneral).not.toHaveBeenCalled();
  });

  it('should handle error in fetchLessonMaterialById', async () => {
    requestService.get.mockReturnValue(throwError(() => new Error('fail')));
    const result = await service.fetchLessonMaterialById('1').toPromise();
    expect(result).toBeNull();
    expect(toastService.errorGeneral).toHaveBeenCalled();
  });
});
