import { inject } from '@angular/core';

import { Router, CanActivateFn } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';

import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const globalModalService = inject(GlobalModalService);

  const isLoggedIn = authService.isLoggedIn();

  if (isLoggedIn) return true;

  globalModalService.open(AuthModalComponent);
  router.navigateByUrl('/home');
  return false;
};
