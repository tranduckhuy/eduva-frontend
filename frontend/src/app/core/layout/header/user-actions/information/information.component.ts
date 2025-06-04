import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { SubmenuDirective } from '../../../../../shared/directives/submenu/submenu.directive';

@Component({
  selector: 'header-user-information',
  standalone: true,
  imports: [SubmenuDirective],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationComponent {
  readonly clickOutside = output<void>();
}
