import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faClock, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

type Subject = {
  title: string;
  grade: string;
  createdBy: string;
  mediaNumbers: string;
  duration: string;
  subjectImage: string;
  creatorAvatar: string;
  isRecommend?: boolean;
};

@Component({
  selector: 'subject-card',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './subject-card.component.html',
  styleUrl: './subject-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectCardComponent {
  libIcon = inject(FaIconLibrary);

  subject = input.required<Subject>();

  constructor() {
    this.libIcon.addIcons(faClock, faCirclePlay);
  }
}
