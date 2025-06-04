import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { SubmenuDirective } from '../../../../../shared/directives/submenu/submenu.directive';

@Component({
  selector: 'header-subjects',
  standalone: true,
  imports: [SubmenuDirective, ButtonModule, TooltipModule, ProgressBarModule],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsComponent {
  readonly clickOutside = output<void>();
}
