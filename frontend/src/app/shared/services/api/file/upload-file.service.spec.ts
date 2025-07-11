import { TestBed } from '@angular/core/testing';
import { UploadFileService } from './upload-file.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn(),
  };
});

import { createClient } from '@supabase/supabase-js';

describe('UploadFileService', () => {
  let service: UploadFileService;
  let toastService: any;
  let mockSupabaseClient: any;
  let mockStorage: any;
  let mockFrom: any;

  const fakeFile = new Blob(['test'], { type: 'text/plain' });

  beforeEach(() => {
    toastService = { errorGeneral: vi.fn() };
    mockFrom = {
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
    };
    mockStorage = {
      from: vi.fn(() => mockFrom),
    };
    mockSupabaseClient = { storage: mockStorage };
    (createClient as any).mockReturnValue(mockSupabaseClient);

    TestBed.configureTestingModule({
      providers: [
        UploadFileService,
        { provide: ToastHandlingService, useValue: toastService },
      ],
    });
    service = TestBed.inject(UploadFileService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload file and return public URL on success', async () => {
    mockFrom.upload.mockResolvedValue({
      data: { path: 'file.txt' },
      error: null,
    });
    mockFrom.getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://public.url/file.txt' },
    });
    const result = await service.uploadFile(fakeFile, 'file.txt', 'bucket');
    expect(mockStorage.from).toHaveBeenCalledWith('bucket');
    expect(mockFrom.upload).toHaveBeenCalledWith('file.txt', fakeFile, {
      cacheControl: '3600',
      upsert: true,
    });
    expect(result).toBe('https://public.url/file.txt');
    expect(toastService.errorGeneral).not.toHaveBeenCalled();
  });

  it('should return null and call errorGeneral if upload returns error', async () => {
    mockFrom.upload.mockResolvedValue({
      data: null,
      error: { message: 'fail' },
    });
    const result = await service.uploadFile(fakeFile, 'file.txt', 'bucket');
    expect(result).toBeNull();
    expect(toastService.errorGeneral).toHaveBeenCalled();
  });

  it('should return null and call errorGeneral if upload throws', async () => {
    mockFrom.upload.mockRejectedValue(new Error('fail'));
    const result = await service.uploadFile(fakeFile, 'file.txt', 'bucket');
    expect(result).toBeNull();
    expect(toastService.errorGeneral).toHaveBeenCalled();
  });
});
