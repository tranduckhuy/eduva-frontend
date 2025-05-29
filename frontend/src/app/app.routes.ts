import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./shared/pages/shared.routes').then(mod => mod.sharedRoutes),
  },
  {
    path: 'teacher',
    loadChildren: () =>
      import('./features/teacher/teacher.routes').then(
        mod => mod.teacherRoutes
      ),
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./features/student/student.routes').then(
        mod => mod.studentRoutes
      ),
  },
];
