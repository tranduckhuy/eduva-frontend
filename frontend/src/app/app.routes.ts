import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { subscriptionActiveGuard } from './core/guards/subscription-active.guard';

import { UserRoles } from './shared/constants/user-roles.constant';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then(
        mod => mod.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then(
            mod => mod.HomeComponent
          ),
      },
      {
        path: 'classroom-detail',
        canActivate: [authGuard, roleGuard, subscriptionActiveGuard],
        data: {
          roles: [UserRoles.STUDENT],
        },
        loadComponent: () =>
          import('./features/classroom-detail/classroom-detail.component').then(
            mod => mod.ClassroomDetailComponent
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/blank-layout/blank-layout.component').then(
        mod => mod.BlankLayoutComponent
      ),
    children: [
      {
        path: 'watch-lessons',
        canActivate: [authGuard, roleGuard, subscriptionActiveGuard],
        data: {
          roles: [UserRoles.STUDENT],
        },
        loadComponent: () =>
          import('./features/watch-lessons/watch-lessons.component').then(
            mod => mod.WatchLessonsComponent
          ),
      },
      {
        path: 'settings',
        canActivate: [authGuard, roleGuard, subscriptionActiveGuard],
        data: {
          roles: [UserRoles.STUDENT],
        },
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            mod => mod.SettingsComponent
          ),
        loadChildren: () =>
          import('./features/settings/settings.routes').then(
            mod => mod.settingsRoutes
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard, roleGuard, subscriptionActiveGuard],
        data: {
          roles: [UserRoles.STUDENT],
        },
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            mod => mod.ProfileComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
