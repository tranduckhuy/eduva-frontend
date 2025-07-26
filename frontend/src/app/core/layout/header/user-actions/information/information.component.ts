import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';

import { SubmenuDirective } from '../../../../../shared/directives/submenu/submenu.directive';

import { AuthService } from '../../../../auth/services/auth.service';
import { UserService } from '../../../../../shared/services/api/user/user.service';
import { ThemeService } from '../../../../../shared/services/core/theme/theme.service';
import { GlobalModalService } from '../../../../../shared/services/layout/global-modal/global-modal.service';

import { EnrollClassModalComponent } from '../enroll-class-modal/enroll-class-modal.component';

@Component({
  selector: 'header-user-information',
  standalone: true,
  imports: [RouterLink, SubmenuDirective],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly themeService = inject(ThemeService);
  private readonly globalModalService = inject(GlobalModalService);

  readonly clickOutside = output<void>();

  user = this.userService.currentUser;
  theme = this.themeService.theme;

  toggleTheme() {
    this.theme() === 'light'
      ? this.themeService.setTheme('dark')
      : this.themeService.setTheme('light');
  }

  logout() {
    this.authService.logout().subscribe();
  }

  openEnrollModal() {
    this.globalModalService.open(EnrollClassModalComponent);
  }
}
