import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
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
