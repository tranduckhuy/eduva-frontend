import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { ConfirmationService } from 'primeng/api';

import { JwtService } from '../auth/services/jwt.service';
import { UserService } from '../../shared/services/api/user/user.service';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';

import { StatusCode } from '../../shared/constants/status-code.constant';
import { BYPASS_AUTH_ERROR } from '../../shared/tokens/context/http-context.token';

import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';

let hasShownUnauthorizedDialog = false;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const jwtService = inject(JwtService);
  const userService = inject(UserService);
  const globalModalService = inject(GlobalModalService);
  const confirmationService = inject(ConfirmationService);

  const isByPass = req.context.get(BYPASS_AUTH_ERROR);

  const handleServerError = () => router.navigateByUrl('/500');

  const handleUnauthorized = () => {
    if (hasShownUnauthorizedDialog) return;

    hasShownUnauthorizedDialog = true;

    globalModalService.close();
    confirmationService.confirm({
      message: 'Vui lòng đăng nhập lại.',
      header: 'Phiên đã hết hạn',
      closable: false,
      rejectVisible: false,
      acceptButtonProps: { label: 'Đồng ý' },
      accept: () => {
        jwtService.clearAll();
        userService.clearCurrentUser();
        globalModalService.open(AuthModalComponent);
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
        jwtService.clearAll();
        userService.clearCurrentUser();
        globalModalService.open(AuthModalComponent);
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
        jwtService.clearAll();
        userService.clearCurrentUser();
        globalModalService.open(AuthModalComponent);
      },
    });
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isUnauthorized = error.status === 401;
      const isPaymentRequired = error.status === 402;
      const isForbidden = error.status === 403;
      const isServerError = error.status === 0 || error.status >= 500;

      const statusCode = (error.error as any)?.statusCode;

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
