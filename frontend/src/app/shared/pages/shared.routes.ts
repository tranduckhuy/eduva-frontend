import { Routes } from '@angular/router';

export const sharedRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../core/layout/blank-layout/blank-layout.component').then(
        mod => mod.BlankLayoutComponent
      ),
    children: [
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
