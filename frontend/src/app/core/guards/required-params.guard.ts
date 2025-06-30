import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';

import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';
import { ToastHandlingService } from '../../shared/services/core/toast/toast-handling.service';

import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';

export const requireQueryParamsGuard = (
  requiredParams: string[]
): CanMatchFn => {
  return () => {
    const router = inject(Router);
    const globalModalService = inject(GlobalModalService);
    const toastHandlingService = inject(ToastHandlingService);

    const urlTree = router.parseUrl(router.url);
    const queryParams = urlTree.queryParams;

    const missingParams = requiredParams.filter(p => !queryParams[p]);

    if (missingParams.length > 0) {
      toastHandlingService.errorGeneral();
      globalModalService.open(AuthModalComponent);
      return false;
    }

    return true;
  };
};
