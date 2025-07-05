import { Injectable, inject, signal } from '@angular/core';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';

import { StatusCode } from '../../../constants/status-code.constant';

import { type User } from '../../../models/entities/user.model';
import { type UpdateProfileRequest } from '../../../../features/settings/models/update-profile-request.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly USER_PROFILE_API_URL = `${this.BASE_API_URL}/users/profile`;

  private readonly LOCAL_STORAGE_KEY = 'eduva_user';

  private readonly currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  private readonly usersSignal = signal<User[]>([]);
  readonly users = this.usersSignal.asReadonly();

  private readonly totalUsersSignal = signal<number>(0);
  readonly totalUsers = this.totalUsersSignal.asReadonly();

  private readonly userDetailSignal = signal<User | null>(null);
  readonly userDetail = this.userDetailSignal.asReadonly();

  constructor() {
    // Hydrate signal from sessionStorage if sessionStorage have data
    const cachedUser = this.loadUserFromStorage();
    if (cachedUser) {
      this.currentUserSignal.set(cachedUser);
    }
  }

  getCurrentProfile(): Observable<User | null> {
    return this.requestService.get<User>(this.USER_PROFILE_API_URL).pipe(
      tap(res => this.handleGetProfileSideEffect(res)),
      map(res => this.extractUserFromResponse(res)),
      catchError(() => this.handleErrorResponse())
    );
  }

  updateUserProfile(request: UpdateProfileRequest): Observable<User | null> {
    return this.requestService
      .put<User>(this.USER_PROFILE_API_URL, request)
      .pipe(
        tap(res => this.handleUpdateProfileSideEffect(res)),
        map(res => this.extractUserFromResponse(res)),
        catchError(() => this.handleErrorResponse())
      );
  }

  updateCurrentUserPartial(update: Partial<User>): void {
    const current = this.currentUserSignal();
    if (!current) return;
    const merged = { ...current, ...update };
    this.setCurrentUser(merged);
  }

  clearCurrentUser(): void {
    this.setCurrentUser(null);
  }

  // ---------------------------
  //  Private Helper Functions
  // ---------------------------

  private handleGetProfileSideEffect(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      this.setCurrentUser(res.data);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private handleUpdateProfileSideEffect(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      this.toastHandlingService.success(
        'Thành công',
        'Hồ sơ của bạn đã được thay đổi thành công'
      );

      const currentUser = this.currentUser();
      const updated = res.data;

      if (!currentUser || !updated) {
        this.toastHandlingService.errorGeneral();
        return;
      }

      const mergedUser = this.mergeUser(currentUser, updated);
      this.setCurrentUser(mergedUser);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private extractUserFromResponse(res: any): User | null {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      return res.data;
    }
    return null;
  }

  private handleErrorResponse(): Observable<null> {
    this.toastHandlingService.errorGeneral();
    return of(null);
  }

  private mergeUser(current: User, updated: Partial<User>): User {
    return {
      ...current,
      ...updated,
      school: current.school,
      roles: updated.roles?.length ? updated.roles : current.roles,
      isEmailConfirmed: updated.isEmailConfirmed ?? current.isEmailConfirmed,
      userSubscriptionResponse:
        updated.userSubscriptionResponse ?? current.userSubscriptionResponse,
    };
  }

  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
    if (user) {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }
  }
}
