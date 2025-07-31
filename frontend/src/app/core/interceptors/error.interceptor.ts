import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { ConfirmationService } from 'primeng/api';

import { AuthService } from '../auth/services/auth.service';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';

import { StatusCode } from '../../shared/constants/status-code.constant';
import {
  BYPASS_AUTH_ERROR,
  BYPASS_NOT_FOUND_ERROR,
} from '../../shared/tokens/context/http-context.token';

import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const globalModalService = inject(GlobalModalService);
  const confirmationService = inject(ConfirmationService);

  const isByPass = req.context.get(BYPASS_AUTH_ERROR);
  const isByPassNotFound = req.context.get(BYPASS_NOT_FOUND_ERROR);

  const handleServerError = () => router.navigateByUrl('/500');

  const handleForbidden = () => router.navigateByUrl('/403');

  const handleNotFound = () => router.navigateByUrl('/404');

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
      const isNotFound = error.status === 404;
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

      if (isNotFound && !isByPassNotFound) {
        handleNotFound();
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};
