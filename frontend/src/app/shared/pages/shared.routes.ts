import { Routes } from '@angular/router';

export const sharedRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../core/layout/blank-layout/blank-layout.component').then(
        mod => mod.BlankLayoutComponent
      ),
    children: [
      {
        path: 'settings',
        loadComponent: () =>
          import('../pages/settings/settings.component').then(
            mod => mod.SettingsComponent
          ),
        loadChildren: () =>
          import('./settings/settings.routes').then(mod => mod.settingsRoutes),
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
  // {
  //   path: '',
  //   loadComponent: () =>
  //     import('../../core/layout/main-layout/main-layout.component').then(
  //       mod => mod.MainLayoutComponent
  //     ),
  //   children: [],
  // },
];
