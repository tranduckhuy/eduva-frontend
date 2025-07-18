import { Routes } from '@angular/router';

export const errorRoutes: Routes = [
  {
    path: '500',
    loadComponent: () =>
      import('./internal-error/internal-error.component').then(
        mod => mod.InternalErrorComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./not-found-error/not-found-error.component').then(
        mod => mod.NotFoundErrorComponent
      ),
  },
  {
    path: '403',
    loadComponent: () =>
      import('./unauthorized-error/unauthorized-error.component').then(
        mod => mod.UnauthorizedErrorComponent
      ),
  },
];
