import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';

import { SubmenuDirective } from '../../../../../shared/directives/submenu/submenu.directive';

@Component({
  selector: 'header-classrooms',
  standalone: true,
  imports: [SubmenuDirective, ButtonModule, TooltipModule, ProgressBarModule],
  templateUrl: './classrooms.component.html',
  styleUrl: './classrooms.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassroomsComponent {
  readonly clickOutside = output<void>();
}
