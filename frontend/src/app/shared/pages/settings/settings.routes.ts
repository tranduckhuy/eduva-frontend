import { Routes } from '@angular/router';
import { PersonalComponent } from './personal/personal.component';
import { SecurityComponent } from './security/security.component';
import { SettingsRedirectComponent } from './settings-redirect/settings-redirect.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsRedirectComponent,
  },
  {
    path: 'personal',
    component: PersonalComponent,
  },
  {
    path: 'security',
    component: SecurityComponent,
  },
];
