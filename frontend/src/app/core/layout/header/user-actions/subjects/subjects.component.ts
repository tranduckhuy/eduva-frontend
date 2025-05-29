import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { HeaderSubmenuDirective } from '../../../../../shared/directives/header-submenu.directive';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'header-subjects',
  standalone: true,
  imports: [
    HeaderSubmenuDirective,
    ButtonModule,
    TooltipModule,
    ProgressBarModule,
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsComponent {
  readonly clickOutside = output<void>();
}
