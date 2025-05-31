import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';

import { HeaderSubmenuService } from '../services/header-submenu.service';

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
  readonly headerSubmenuService = inject(HeaderSubmenuService);

  toggleMenu(submenuKey: string): void {
    const current = this.headerSubmenuService.getActiveSubmenuMenu();
    if (current === submenuKey) {
      this.headerSubmenuService.close();
    } else {
      this.headerSubmenuService.open(submenuKey);
      setTimeout(() => this.headerSubmenuService.open(submenuKey));
    }
  }
}
