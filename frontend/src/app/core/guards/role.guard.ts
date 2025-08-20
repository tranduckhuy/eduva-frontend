import { inject } from '@angular/core';

import { Router, CanActivateFn } from '@angular/router';

import { UserService } from '../../shared/services/api/user/user.service';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';

import {
  UserRole,
  UserRoles,
} from '../../shared/constants/user-roles.constant';

import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';

export const roleGuard: CanActivateFn = activatedRoute => {
  const router = inject(Router);
  const userService = inject(UserService);
  const globalModalService = inject(GlobalModalService);

  const expectedRoles = activatedRoute.data?.['roles'] as
    | UserRole[]
    | undefined;
  const user = userService.currentUser();

  const isLoggedIn =
    !!user && Array.isArray(user.roles) && user.roles.length > 0;
  if (!isLoggedIn) {
    globalModalService.open(AuthModalComponent);
    return false;
  }

  const hasExpectedRole = expectedRoles?.some(role =>
    user.roles.includes(role)
  );

  // ? If the user has the required role(s), allow access to the route
  if (hasExpectedRole) return true;

  // ? If the user does NOT have the required role(s),
  // ? Check if they are Student then redirect to home page
  // ? else redirect them to their unauthorized page
  if (user.roles.includes(UserRoles.STUDENT)) {
    router.navigateByUrl('/home');
  } else {
    router.navigateByUrl('/403');
  }

  return false;
};
