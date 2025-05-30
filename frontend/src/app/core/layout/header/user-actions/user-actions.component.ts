import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

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
  private readonly router = inject(Router);
  readonly submenuService = inject(SubmenuService);

  isHidden = computed(() => {
    const url = this.router.url;
    return url.includes('/watch-lessons');
  });

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
