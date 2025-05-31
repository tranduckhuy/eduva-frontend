import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';

import { SubmenuDirective } from '../../../../../shared/directives/submenu/submenu.directive';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'header-notifications',
  standalone: true,
  imports: [SubmenuDirective, ButtonModule, TooltipModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  readonly clickOutside = output<void>();

  seen = signal<boolean>(false);
  mock = signal<{ title: string; isSeen: boolean }[]>([
    {
      title:
        'Bài học <strong>Các phương thức tĩnh của Promise</strong> mới được thêm vào.',
      isSeen: true,
    },
    {
      title:
        'Bài học <strong>Các phương thức tĩnh của Promise</strong> mới được thêm vào.',
      isSeen: false,
    },
    {
      title:
        'Bài học <strong>Các phương thức tĩnh của Promise</strong> mới được thêm vào.',
      isSeen: true,
    },
    {
      title:
        'Bài học <strong>Các phương thức tĩnh của Promise</strong> mới được thêm vào.',
      isSeen: false,
    },
  ]);
}
