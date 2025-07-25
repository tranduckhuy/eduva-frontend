import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  DestroyRef,
  inject,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../../../shared/services/api/user/user.service';
import { HeaderSubmenuService } from '../services/header-submenu.service';

import { ClassroomsComponent } from './classrooms/classrooms.component';
import { InformationComponent } from './information/information.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { GlobalModalService } from '../../../../shared/services/layout/global-modal/global-modal.service';
import { AuthModalComponent } from '../../../../shared/components/auth-modal/auth-modal.component';
import { EnrollClassModalComponent } from './enroll-class-modal/enroll-class-modal.component';
import { NotificationSocketService } from '../../../../shared/services/api/notification/notification-socket.service';

@Component({
  selector: 'header-user-actions',
  standalone: true,
  imports: [
    ButtonModule,
    NotificationsComponent,
    InformationComponent,
    ClassroomsComponent,
    TooltipModule,
  ],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActionsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly headerSubmenuService = inject(HeaderSubmenuService);
  private readonly globalModalService = inject(GlobalModalService);
  private readonly notificationSocketService = inject(
    NotificationSocketService
  );

  isLoggedIn = this.authService.isLoggedIn;
  user = this.userService.currentUser;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.notificationSocketService.disconnect();
    });
  }

  ngOnInit(): void {
    this.notificationSocketService.connect();
  }

  get activeSubmenu() {
    return this.headerSubmenuService.getActiveSubmenuMenu();
  }

  toggleSubMenu(submenuKey: string): void {
    const current = this.headerSubmenuService.getActiveSubmenuMenu();
    if (current === submenuKey) {
      this.headerSubmenuService.close();
    } else {
      this.headerSubmenuService.open(submenuKey);
      setTimeout(() => this.headerSubmenuService.open(submenuKey));
    }
  }

  closeSubMenu() {
    this.headerSubmenuService.close();
  }

  openSignInModal() {
    this.globalModalService.open(AuthModalComponent);
  }

  openEnrollModal() {
    this.globalModalService.open(EnrollClassModalComponent);
  }
}
