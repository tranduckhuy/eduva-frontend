import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FolderManagementService } from './folder-management.service';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { StatusCode } from '../../../constants/status-code.constant';
import { of, throwError } from 'rxjs';

describe('FolderManagementService', () => {
  let service: FolderManagementService;
  let requestService: any;
  let toastService: any;

  const mockFolder = {
    id: '1',
    name: 'Folder 1',
    userId: 'U1',
    classId: 'C1',
    ownerName: 'Owner',
    ownerType: 0,
    order: 1,
    createdAt: '2024-01-01',
    lastModifiedAt: '2024-01-02',
    countLessonMaterial: 5,
  };
  const mockFolders = [
    mockFolder,
    { ...mockFolder, id: '2', name: 'Folder 2' },
  ];

  beforeEach(() => {
    requestService = { get: vi.fn() };
    toastService = { error: vi.fn(), errorGeneral: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        FolderManagementService,
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastService },
      ],
    });
    service = TestBed.inject(FolderManagementService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get class folders and update signal on success', async () => {
    const mockResponse = { statusCode: StatusCode.SUCCESS, data: mockFolders };
    requestService.get.mockReturnValue(of(mockResponse));
    const result = await service.getClassFolders({}, 'C1').toPromise();
    expect(result).toEqual(mockFolders);
    expect(service.folderList()).toEqual(mockFolders);
    expect(toastService.error).not.toHaveBeenCalled();
  });

  it('should handle error in getClassFolders', async () => {
    requestService.get.mockReturnValue(throwError(() => new Error('fail')));
    const result = await service.getClassFolders({}, 'C1').toPromise();
    expect(result).toBeNull();
    expect(toastService.errorGeneral).toHaveBeenCalled();
  });

  it('should get folder by id and update signal on success', async () => {
    const mockResponse = { statusCode: StatusCode.SUCCESS, data: mockFolder };
    requestService.get.mockReturnValue(of(mockResponse));
    const result = await service.getFolderById('1').toPromise();
    expect(result).toEqual(mockFolder);
    expect(service.folder()).toEqual(mockFolder);
    expect(toastService.errorGeneral).not.toHaveBeenCalled();
  });

  it('should handle error in getFolderById', async () => {
    requestService.get.mockReturnValue(throwError(() => new Error('fail')));
    const result = await service.getFolderById('1').toPromise();
    expect(result).toBeNull();
    expect(toastService.errorGeneral).toHaveBeenCalled();
  });
});
