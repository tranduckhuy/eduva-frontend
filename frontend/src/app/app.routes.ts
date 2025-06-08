import { Routes } from '@angular/router';

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
        loadComponent: () =>
          import('./features/home/home.component').then(
            mod => mod.HomeComponent
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
        loadComponent: () =>
          import('./features/watch-lessons/watch-lessons.component').then(
            mod => mod.WatchLessonsComponent
          ),
      },
      {
        path: 'settings',
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
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            mod => mod.ProfileComponent
          ),
      },
      // {
      //   path: '**', // Not-Found
      // },
      // {
      //   path: 'internal-error',
      // },
      // {
      //   path: 'coming-soon',
      // },
    ],
  },
];
