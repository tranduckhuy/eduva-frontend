import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TextExpanderDirective } from '../../../shared/directives/text-expander/text-expander.directive';

@Component({
  selector: 'profile-user-information',
  standalone: true,
  imports: [TextExpanderDirective],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInformationComponent {}
