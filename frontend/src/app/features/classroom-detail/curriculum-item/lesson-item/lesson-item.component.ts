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
import {
  faCirclePlay,
  faVolumeHigh,
  faFileWord,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

type Lesson = {
  title: string;
  duration: string;
  type: 'video' | 'audio' | 'pdf' | 'docx';
};

@Component({
  selector: 'curriculum-lesson-item',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './lesson-item.component.html',
  styleUrl: './lesson-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonItemComponent {
  lesson = input.required<Lesson>();

  libIcon = inject(FaIconLibrary);

  constructor() {
    this.libIcon.addIcons(faCirclePlay, faVolumeHigh, faFilePdf, faFileWord);
  }

  get icon() {
    switch (this.lesson().type) {
      case 'video':
        return 'circle-play';
      case 'audio':
        return 'volume-high';
      case 'pdf':
        return 'file-pdf';
      case 'docx':
        return 'file-word';
      default:
        return 'circle-play';
    }
  }
}
