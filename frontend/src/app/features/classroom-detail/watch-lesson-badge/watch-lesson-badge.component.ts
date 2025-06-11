import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faPencil,
  faGaugeHigh,
  faFilm,
  faClock,
  faBatteryFull,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'classroom-watch-lesson-badge',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './watch-lesson-badge.component.html',
  styleUrl: './watch-lesson-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchLessonBadgeComponent {
  libIcon = inject(FaIconLibrary);

  constructor() {
    this.libIcon.addIcons(
      faPencil,
      faGaugeHigh,
      faFilm,
      faClock,
      faBatteryFull
    );
  }
}
