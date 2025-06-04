import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';

import { HeaderSubmenuService } from '../services/header-submenu.service';
import { AuthModalService } from '../../../../shared/services/modal/auth-modal/auth-modal.service';

import { SubjectsComponent } from './subjects/subjects.component';
import { InformationComponent } from './information/information.component';
import { NotificationsComponent } from './notifications/notifications.component';

@Component({
  selector: 'header-user-actions',
  standalone: true,
  imports: [
    ButtonModule,
    NotificationsComponent,
    InformationComponent,
    SubjectsComponent,
  ],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActionsComponent {
  private readonly headerSubmenuService = inject(HeaderSubmenuService);
  private readonly authModalService = inject(AuthModalService);

  constructor() {
    effect(() => {
      const isModalOpen = this.authModalService.isOpen();
      document.body.classList.toggle('overflow-hidden', isModalOpen);
    });
  }

  get activeSubmenu() {
    return this.headerSubmenuService.getActiveSubmenuMenu();
  }

  openAuthModal() {
    this.authModalService.open();
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
}
