import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';

import { SubmenuService } from '../services/submenu.service';

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
  readonly submenuService = inject(SubmenuService);

  toggleMenu(submenuKey: string): void {
    const current = this.submenuService.getActiveSubmenuMenu();
    if (current === submenuKey) {
      this.submenuService.close();
    } else {
      this.submenuService.open(submenuKey);
      setTimeout(() => this.submenuService.open(submenuKey));
    }
  }
}
