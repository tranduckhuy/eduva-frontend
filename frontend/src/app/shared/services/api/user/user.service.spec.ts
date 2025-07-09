import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { StatusCode } from '../../../constants/status-code.constant';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';

const mockUser = {
  id: '1',
  fullName: 'Test User',
  phoneNumber: '1234567890',
  email: 'test@example.com',
  avatarUrl: 'avatar.png',
  school: {
    id: 1,
    name: 'Test School',
    contactEmail: 'school@example.com',
    contactPhone: '111-222-3333',
    address: '123 Main St',
    status: 0,
  },
  roles: ['Student' as any],
  creditBalance: 100,
  is2FAEnabled: false,
  isEmailConfirmed: true,
  status: 0,
  userSubscriptionResponse: {
    isSubscriptionActive: true,
    subscriptionEndDate: '2025-01-01',
  },
};

describe('UserService', () => {
  let service: UserService;
  let requestService: any;
  let toastService: any;
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
    requestService = {
      get: vi.fn(),
      put: vi.fn(),
    };
    toastService = {
      errorGeneral: vi.fn(),
      success: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastService },
      ],
    });
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should hydrate from localStorage if present', () => {
    localStorageMock['eduva_user'] = JSON.stringify(mockUser);
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
    });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: RequestService, useValue: requestService },
        { provide: ToastHandlingService, useValue: toastService },
      ],
    });
    service = TestBed.inject(UserService);
    expect(service.currentUser()).toEqual(mockUser);
  });

  it('getCurrentProfile should set and return user on success', async () => {
    const response = { statusCode: StatusCode.SUCCESS, data: mockUser };
    requestService.get.mockReturnValue(of(response));
    const result = await service.getCurrentProfile().toPromise();
    expect(result).toEqual(mockUser);
    expect(service.currentUser()).toEqual(mockUser);
  });

  it('getCurrentProfile should handle error', async () => {
    requestService.get.mockReturnValue(throwError(() => new Error('fail')));
    const result = await service.getCurrentProfile().toPromise();
    expect(result).toBeNull();
    expect(toastService.errorGeneral).toHaveBeenCalled();
  });

  it('updateUserProfile should update and merge user on success', async () => {
    service['currentUserSignal'].set(mockUser);
    const updated = {
      ...mockUser,
      fullName: 'Updated',
      roles: ['Teacher' as any],
    };
    const response = { statusCode: StatusCode.SUCCESS, data: updated };
    requestService.put.mockReturnValue(of(response));
    const result = await service
      .updateUserProfile({ fullName: 'Updated' })
      .toPromise();
    expect(result).toEqual(updated);
    expect(service.currentUser()?.fullName).toBe('Updated');
    expect(toastService.success).toHaveBeenCalled();
  });

  it('updateUserProfile should handle error', async () => {
    requestService.put.mockReturnValue(throwError(() => new Error('fail')));
    const result = await service.updateUserProfile({} as any).toPromise();
    expect(result).toBeNull();
    expect(toastService.errorGeneral).toHaveBeenCalled();
  });

  it('updateCurrentUserPartial should merge partial update', () => {
    service['currentUserSignal'].set(mockUser);
    service.updateCurrentUserPartial({ fullName: 'Partial' });
    expect(service.currentUser()?.fullName).toBe('Partial');
  });

  it('updateCurrentUserPartial should do nothing if no current user', () => {
    service['currentUserSignal'].set(null);
    service.updateCurrentUserPartial({ fullName: 'Partial' });
    expect(service.currentUser()).toBeNull();
  });

  it('clearCurrentUser should set currentUser to null and remove from localStorage', () => {
    service['currentUserSignal'].set(mockUser);
    service.clearCurrentUser();
    expect(service.currentUser()).toBeNull();
    expect(localStorageMock['eduva_user']).toBeUndefined();
  });
});
