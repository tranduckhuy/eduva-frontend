import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

import { UserService } from '../../shared/services/api/user/user.service';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';

import { UserRole } from '../../shared/constants/user-roles.constant';

import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';

export const subscriptionActiveGuard: CanActivateFn = activatedRoute => {
  const router = inject(Router);
  const userService = inject(UserService);
  const globalModalService = inject(GlobalModalService);

  const user = userService.currentUser();
  const routeRoles = activatedRoute.data?.['roles'] as UserRole[] | undefined;

  const isProtectedUser = routeRoles?.some(role => user?.roles.includes(role));
  const isSubscriptionActive =
    user?.userSubscriptionResponse?.isSubscriptionActive;

  if (isProtectedUser && !isSubscriptionActive) {
    globalModalService.open(AuthModalComponent);
    router.navigate(['/403']);
    return false;
  }

  return true;
};
