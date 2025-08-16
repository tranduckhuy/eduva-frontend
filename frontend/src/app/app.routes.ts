import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

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
        path: 'classes/:classId',
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Chi tiết lớp học',
          roles: [UserRoles.STUDENT],
        },
        loadComponent: () =>
          import('./features/classroom-detail/classroom-detail.component').then(
            mod => mod.ClassroomDetailComponent
          ),
      },
      {
        path: 'classes',
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Danh sách lớp học',
          roles: [UserRoles.STUDENT],
        },
        loadComponent: () =>
          import('./features/classes/classes.component').then(
            mod => mod.ClassesComponent
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
        path: 'learn/:materialId',
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Bài học',
          roles: [UserRoles.STUDENT],
        },
        loadComponent: () =>
          import('./features/watch-lessons/watch-lessons.component').then(
            mod => mod.WatchLessonsComponent
          ),
      },
      {
        path: 'settings',
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Cài đặt',
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
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Thông tin cá nhân',
          roles: [UserRoles.STUDENT],
        },
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            mod => mod.ProfileComponent
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import(
            './shared/pages/errors/errors-layout/errors-layout.component'
          ).then(mod => mod.ErrorsLayoutComponent),
        loadChildren: () =>
          import('./shared/pages/errors/errors.routes').then(
            mod => mod.errorRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
