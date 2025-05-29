import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { HeaderSubmenuDirective } from '../../../../../shared/directives/header-submenu.directive';

@Component({
  selector: 'header-user-information',
  standalone: true,
  imports: [HeaderSubmenuDirective],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationComponent {
  readonly clickOutside = output<void>();
}
