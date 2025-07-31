import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router, NavigationBehaviorOptions } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { ConfirmationService } from 'primeng/api';

import { AuthService } from '../auth/services/auth.service';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';

import { StatusCode } from '../../shared/constants/status-code.constant';
import {
  BYPASS_AUTH_ERROR,
  BYPASS_NOT_FOUND_ERROR,
  BYPASS_PAYMENT_ERROR,
} from '../../shared/tokens/context/http-context.token';

import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';

const showConfirmation = (
  confirmationService: ConfirmationService,
  options: {
    header: string;
    message: string;
    acceptLabel: string;
    onAccept: () => void;
    closable?: boolean;
    rejectVisible?: boolean;
  }
) => {
  confirmationService.confirm({
    header: options.header,
    message: options.message,
    closable: options.closable ?? false,
    rejectVisible: options.rejectVisible ?? false,
    acceptButtonProps: { label: options.acceptLabel },
    accept: options.onAccept,
  });
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const globalModalService = inject(GlobalModalService);
  const confirmationService = inject(ConfirmationService);

  const isByPassAuth = req.context.get(BYPASS_AUTH_ERROR);
  const isByPassPayment = req.context.get(BYPASS_PAYMENT_ERROR);
  const isByPassNotFound = req.context.get(BYPASS_NOT_FOUND_ERROR);

  const navigate = (url: string, extras?: NavigationBehaviorOptions) =>
    router.navigateByUrl(url, extras);

  const handleUnauthorized = () => {
    globalModalService.close();
    showConfirmation(confirmationService, {
      header: 'Phiên đã hết hạn',
      message: 'Vui lòng đăng nhập lại.',
      acceptLabel: 'Đồng ý',
      onAccept: () => {
        authService.clearSession();
        globalModalService.open(AuthModalComponent);
        window.dispatchEvent(new Event('close-all-submenus'));
        navigate('/home', { replaceUrl: true } as any);
      },
      closable: false,
      rejectVisible: false,
    });
  };

  const handleMissingOrExpiredSubscription = (expired: boolean) => {
    const header = expired
      ? 'Gói sử dụng đã hết hạn'
      : 'Trường chưa có gói sử dụng';
    const message = expired
      ? `
        <p>Gói sử dụng của trường bạn đã hết hạn.</p>
        <p>Hãy liên hệ <strong>giáo viên</strong> hoặc <strong>quản trị viên</strong> để gia hạn và tiếp tục sử dụng hệ thống.</p>
      `
      : `
        <p>Trường của bạn hiện chưa có gói sử dụng.</p>
        <p>Vui lòng liên hệ <strong>giáo viên</strong> hoặc <strong>quản trị viên</strong> để được cấp quyền truy cập.</p>
      `;
    showConfirmation(confirmationService, {
      header,
      message,
      acceptLabel: 'Đăng xuất',
      onAccept: () => {
        authService.clearSession();
        globalModalService.close();
        window.dispatchEvent(new Event('close-all-submenus'));
        navigate('/home', { replaceUrl: true } as any);
      },
      closable: false,
      rejectVisible: false,
    });
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const status = error.status;
      const errorStatusCode = error.error?.statusCode;

      if (status === 0 || status >= 500) {
        navigate('/500');
        return throwError(() => error);
      }

      if (status === 401 && !isByPassAuth) {
        handleUnauthorized();
        return throwError(() => error);
      }

      if (!errorStatusCode) {
        return throwError(() => error);
      }

      if (
        status === 402 &&
        !isByPassPayment &&
        errorStatusCode === StatusCode.SUBSCRIPTION_EXPIRED_WITH_DATA_LOSS_RISK
      ) {
        handleMissingOrExpiredSubscription(true);
        return throwError(() => error);
      }

      if (status === 403 && !isByPassAuth) {
        if (errorStatusCode === StatusCode.SCHOOL_AND_SUBSCRIPTION_REQUIRED) {
          handleMissingOrExpiredSubscription(false);
        } else {
          navigate('/403');
        }
        return throwError(() => error);
      }

      if (status === 404 && !isByPassNotFound) {
        if (errorStatusCode === StatusCode.SCHOOL_SUBSCRIPTION_NOT_FOUND) {
          handleMissingOrExpiredSubscription(false);
        } else {
          navigate('/404');
        }
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};
