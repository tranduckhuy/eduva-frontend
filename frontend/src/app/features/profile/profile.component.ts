import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeaderComponent } from '../../core/layout/header/header.component';
import { FooterComponent } from '../../core/layout/footer/footer.component';
import { ProfileNavbarComponent } from './profile-navbar/profile-navbar.component';
import { UserInformationComponent } from './user-information/user-information.component';
import { UserActivitiesComponent } from './user-activities/user-activities.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ProfileNavbarComponent,
    UserInformationComponent,
    UserActivitiesComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {}
