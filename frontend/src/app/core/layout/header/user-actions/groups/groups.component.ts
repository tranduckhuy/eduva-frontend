import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';

import { SubmenuDirective } from '../../../../../shared/directives/submenu/submenu.directive';

@Component({
  selector: 'header-groups',
  standalone: true,
  imports: [SubmenuDirective, ButtonModule, TooltipModule, ProgressBarModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent {
  readonly clickOutside = output<void>();
}
