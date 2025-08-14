import { Injectable, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { RequestService } from '../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';
import { GlobalModalService } from '../../../shared/services/layout/global-modal/global-modal.service';
import { JwtService } from './jwt.service';
import { UserService } from '../../../shared/services/api/user/user.service';
import { EmailVerificationService } from './email-verification.service';
import { NotificationService } from '../../../shared/services/api/notification/notification.service';
import { NotificationSocketService } from '../../../shared/services/api/notification/notification-socket.service';

import { StatusCode } from '../../../shared/constants/status-code.constant';
import { UserRoles } from '../../../shared/constants/user-roles.constant';

import { AuthModalComponent } from '../../../shared/components/auth-modal/auth-modal.component';

import { type LoginRequest } from '../models/request/login-request.model';
import { type RefreshTokenRequest } from '../models/request/refresh-token-request.model';
import { type EmailLinkRequest } from '../models/request/email-link-request.model';
import { type AuthTokenResponse } from '../models/response/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);
  private readonly globalModalService = inject(GlobalModalService);
  private readonly jwtService = inject(JwtService);
  private readonly userService = inject(UserService);
  private readonly emailVerificationService = inject(EmailVerificationService);
  private readonly notificationService = inject(NotificationService);
  private readonly notificationSocketService = inject(
    NotificationSocketService
  );

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly LOGIN_API_URL = `${this.BASE_API_URL}/auth/login`;
  private readonly REFRESH_TOKEN_API_URL = `${this.BASE_API_URL}/auth/refresh-token`;
  private readonly LOGOUT_API_URL = `${this.BASE_API_URL}/auth/logout`;

  private readonly CLIENT_URL = environment.clientUrl;

  private readonly isLoggedInSignal = signal<boolean>(
    !!this.jwtService.getAccessToken()
  );
  isLoggedIn = this.isLoggedInSignal.asReadonly();

  login(request: LoginRequest): Observable<AuthTokenResponse | null> {
    return this.requestService
      .post<AuthTokenResponse>(this.LOGIN_API_URL, request, {
        bypassAuth: true,
        bypassAuthError: true,
        bypassNotFoundError: true,
      })
      .pipe(
        map(res => {
          if (!res.statusCode || !res.data) {
            this.toastHandlingService.errorGeneral();
            return null;
          }

          switch (res.statusCode) {
            case StatusCode.SUCCESS:
              this.handleLoginSuccess(res.data);
              return res.data;

            case StatusCode.REQUIRES_OTP_VERIFICATION:
              this.handleRequiresOtpVerification(res.data.email);
              return res.data;

            default:
              this.toastHandlingService.errorGeneral();
              return null;
          }
        }),
        catchError(err => {
          this.handleLoginError(err, request.email);
          return of(null);
        })
      );
  }

  refreshToken(
    request: RefreshTokenRequest
  ): Observable<AuthTokenResponse | null> {
    return this.requestService
      .post<AuthTokenResponse>(this.REFRESH_TOKEN_API_URL, request, {
        bypassAuth: true,
        showLoading: false,
      })
      .pipe(
        map(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            this.handleTokenStorage(res.data);
            return res.data;
          }

          this.clearSession();
          return null;
        }),
        catchError(() => {
          this.clearSession();
          this.router.navigateByUrl('/home');
          return of(null);
        })
      );
  }

  logout(): Observable<void> {
    return this.requestService
      .post(this.LOGOUT_API_URL, undefined, { bypassAuthError: true })
      .pipe(
        tap(() => {
          // ? Clear user profile cache
          this.clearSession();

          // ? Clear notification data
          this.clearSessionData();

          this.router.navigateByUrl('/home', { replaceUrl: true });
        }),
        map(() => void 0),
        catchError(() => of(void 0))
      );
  }

  handleLoginSuccess(data: AuthTokenResponse): void {
    this.handleTokenStorage(data);
    this.handleAfterLogin();
  }

  clearSession(): void {
    this.jwtService.clearAll();
    this.userService.clearCurrentUser();
    this.isLoggedInSignal.set(false);
  }

  clearSessionData() {
    // ? Clear notification data
    this.notificationService.clearSignal();
    this.notificationSocketService.disconnect();

    // ? Close modal
    this.globalModalService.close();

    // ? Close Submenus
    window.dispatchEvent(new Event('close-all-submenus'));
  }

  // ---------------------------
  //  Private Helper Functions
  // ---------------------------

  private handleTokenStorage(data: AuthTokenResponse): void {
    const { accessToken, refreshToken, expiresIn } = data;
    this.jwtService.setAccessToken(accessToken);
    this.jwtService.setRefreshToken(refreshToken);
    this.jwtService.setExpiresDate(
      new Date(Date.now() + expiresIn * 1000).toISOString()
    );
  }

  private handleAfterLogin(): void {
    this.userService.getCurrentProfile().subscribe(user => {
      if (!user) {
        this.toastHandlingService.errorGeneral();
        return;
      }

      const userRoles = user?.roles;

      if (!userRoles.includes(UserRoles.STUDENT)) {
        this.clearSession();
        this.isLoggedInSignal.set(false);
        this.globalModalService.close();
        this.router.navigateByUrl('/403');
        return;
      }

      this.isLoggedInSignal.set(true);
      this.globalModalService.close();
    });
  }

  private handleLoginError(err: HttpErrorResponse, email: string): void {
    const statusCode = err.error?.statusCode;

    switch (statusCode) {
      case StatusCode.USER_NOT_EXISTS:
      case StatusCode.INVALID_CREDENTIALS:
        this.toastHandlingService.warn(
          'Đăng nhập thất bại',
          'Tên đăng nhập hoặc mật khẩu chưa chính xác.'
        );
        break;

      case StatusCode.USER_NOT_CONFIRMED:
        this.toastHandlingService.info(
          'Xác minh tài khoản',
          'Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để hoàn tất xác minh.'
        );
        this.resendConfirmEmail(email);
        break;

      case StatusCode.USER_ACCOUNT_LOCKED:
        this.toastHandlingService.error(
          'Đăng nhập thất bại',
          'Tài khoản của bạn đã bị vô hiệu hóa.'
        );
        break;

      default:
        this.toastHandlingService.errorGeneral();
    }
  }

  private handleRequiresOtpVerification(email: string) {
    this.globalModalService.close();
    this.globalModalService.open(AuthModalComponent, {
      screenState: 'otp',
      email,
    });
  }

  private resendConfirmEmail(email: string): void {
    const request: EmailLinkRequest = {
      email,
      clientUrl: this.CLIENT_URL,
    };

    this.emailVerificationService
      .resendConfirmEmail(request, {
        title: 'Email xác minh đã được gửi lại',
        description: 'Vui lòng kiểm tra email của bạn để hoàn tất xác minh.',
      })
      .subscribe();
  }
}
