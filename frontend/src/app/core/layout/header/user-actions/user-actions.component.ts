import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  DestroyRef,
  inject,
  computed,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { HeaderSubmenuService } from '../services/header-submenu.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../../../shared/services/api/user/user.service';
import { NotificationService } from '../../../../shared/services/api/notification/notification.service';
import { NotificationSocketService } from '../../../../shared/services/api/notification/notification-socket.service';

import { ClassroomsComponent } from './classrooms/classrooms.component';
import { InformationComponent } from './information/information.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { GlobalModalService } from '../../../../shared/services/layout/global-modal/global-modal.service';
import { AuthModalComponent } from '../../../../shared/components/auth-modal/auth-modal.component';
import { EnrollClassModalComponent } from './enroll-class-modal/enroll-class-modal.component';

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
  private readonly headerSubmenuService = inject(HeaderSubmenuService);
  private readonly globalModalService = inject(GlobalModalService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly notificationSocketService = inject(
    NotificationSocketService
  );

  isLoggedIn = this.authService.isLoggedIn;
  user = this.userService.currentUser;
  unreadCount = this.notificationService.unreadCount;

  readonly hasUnreadNotification = computed(() => this.unreadCount() > 0);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.notificationSocketService.disconnect();
    });
  }

  ngOnInit(): void {
    this.notificationSocketService.connect();
    this.notificationService.getNotificationSummary().subscribe();
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
