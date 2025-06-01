import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faHouse,
  faSquarePlus,
  faComments,
  faShareFromSquare,
  faFileCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'profile-navbar',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './profile-navbar.component.html',
  styleUrl: './profile-navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileNavbarComponent {
  libIcon = inject(FaIconLibrary);

  constructor() {
    this.libIcon.addIcons(
      faHouse,
      faSquarePlus,
      faComments,
      faShareFromSquare,
      faFileCircleCheck
    );
  }
}
