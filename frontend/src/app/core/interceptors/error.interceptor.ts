import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { ConfirmationService } from 'primeng/api';

import { JwtService } from '../auth/services/jwt.service';
import { AuthService } from '../auth/services/auth.service';
import { UserService } from '../../shared/services/api/user/user.service';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';

import { StatusCode } from '../../shared/constants/status-code.constant';
import { BYPASS_AUTH_ERROR } from '../../shared/tokens/context/http-context.token';

import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const jwtService = inject(JwtService);
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const globalModalService = inject(GlobalModalService);
  const confirmationService = inject(ConfirmationService);

  const isByPass = req.context.get(BYPASS_AUTH_ERROR);

  const handleServerError = () => router.navigateByUrl('/500');

  const handleUnauthorized = () => {
    globalModalService.close();
    confirmationService.confirm({
      header: 'Phiên đã hết hạn',
      message: 'Vui lòng đăng nhập lại.',
      closable: false,
      rejectVisible: false,
      acceptButtonProps: { label: 'Đồng ý' },
      accept: () => {
        // ? Clear user profile cache
        authService.clearSession();

        // ? Open Auth Modal
        globalModalService.open(AuthModalComponent);

        // ? Close Submenus
        window.dispatchEvent(new Event('close-all-submenus'));

        router.navigateByUrl('/home', { replaceUrl: true });
      },
    });
  };

  const handleForbidden = () => router.navigateByUrl('/403');

  const handleMissingSchoolOrSubscription = () => {
    confirmationService.confirm({
      header: 'Trường chưa có gói sử dụng',
      message: `
        <p>Trường của bạn hiện chưa có gói sử dụng.</p>
        <p>Vui lòng liên hệ<strong>giáo viên</strong> hoặc <strong>quản trị viên</strong> để được cấp quyền truy cập.</p>
      `,
      acceptButtonProps: { label: 'Đăng xuất' },
      rejectVisible: false,
      closable: false,
      accept: () => {
        // ? Clear user profile cache
        authService.clearSession();

        // ? Close Modal
        globalModalService.close();

        // ? Close Submenus
        window.dispatchEvent(new Event('close-all-submenus'));

        router.navigateByUrl('/home', { replaceUrl: true });
      },
    });
  };

  const handleSubscriptionExpired = () => {
    confirmationService.confirm({
      header: 'Gói sử dụng đã hết hạn',
      message: `
        <p>Gói sử dụng của trường bạn đã hết hạn.</p>
        <p>Hãy liên hệ <strong>giáo viên</strong> hoặc <strong>quản trị viên</strong> để gia hạn và tiếp tục sử dụng hệ thống.</p>
      `,
      acceptButtonProps: { label: 'Đăng xuất' },
      rejectVisible: false,
      closable: false,
      accept: () => {
        // ? Clear user profile cache
        authService.clearSession();

        // ? Close Modal
        globalModalService.close();

        // ? Close Submenus
        window.dispatchEvent(new Event('close-all-submenus'));

        router.navigateByUrl('/home', { replaceUrl: true });
      },
    });
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isUnauthorized = error.status === 401;
      const isPaymentRequired = error.status === 402;
      const isForbidden = error.status === 403;
      const isServerError = error.status === 0 || error.status >= 500;

      const statusCode = error.error?.statusCode;

      if (isServerError) {
        handleServerError();
        return throwError(() => error);
      }

      if (isUnauthorized && !isByPass) {
        handleUnauthorized();
        return throwError(() => error);
      }

      if (isPaymentRequired) {
        handleSubscriptionExpired();
        return throwError(() => error);
      }

      if (isForbidden && !isByPass) {
        if (
          statusCode &&
          (statusCode === StatusCode.SCHOOL_AND_SUBSCRIPTION_REQUIRED ||
            statusCode === StatusCode.SCHOOL_SUBSCRIPTION_NOT_FOUND)
        ) {
          handleMissingSchoolOrSubscription();
        } else {
          handleForbidden();
        }
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};
