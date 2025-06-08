import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  libIcon = inject(FaIconLibrary);

  currentYear = signal(new Date().getFullYear());

  constructor() {
    this.scheduleYearUpdate();

    this.libIcon.addIcons(faHeart);
  }

  private scheduleYearUpdate() {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);
    const msUntilNextYear = nextYear.getTime() - now.getTime();

    setTimeout(() => {
      this.currentYear.set(new Date().getFullYear());
      this.scheduleYearUpdate();
    }, msUntilNextYear);
  }
}
