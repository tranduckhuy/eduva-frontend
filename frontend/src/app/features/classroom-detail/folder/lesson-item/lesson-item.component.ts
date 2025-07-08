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

import { LessonMaterial } from '../../../../shared/models/entities/lesson-material.model';
import { ContentType } from '../../../../shared/models/enum/lesson-material.enum';
import { SecondsToMinutesPipe } from '../../../../shared/pipes/seconds-to-minutes.pipe';
import { LessonProgressService } from '../../../../shared/services/api/local-lesson-progress/local-lesson-progress.service';
import { Router } from '@angular/router';

@Component({
  selector: 'curriculum-lesson-item',
  standalone: true,
  imports: [FontAwesomeModule, SecondsToMinutesPipe],
  templateUrl: './lesson-item.component.html',
  styleUrl: './lesson-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonItemComponent {
  private readonly localLessonProgressService = inject(LessonProgressService);
  private readonly libIcon = inject(FaIconLibrary);
  private readonly router = inject(Router);

  material = input.required<LessonMaterial>();
  folderId = input.required<string>();
  classId = input.required<string>();
  index = input.required<number>();

  constructor() {
    this.libIcon.addIcons(faCirclePlay, faVolumeHigh, faFilePdf, faFileWord);
  }

  get icon() {
    switch (this.material().contentType) {
      case ContentType.Video:
        return 'circle-play';
      case ContentType.Audio:
        return 'volume-high';
      case ContentType.PDF:
        return 'file-pdf';
      case ContentType.DOCX:
        return 'file-word';
      default:
        return 'circle-play';
    }
  }

  redirect() {
    this.localLessonProgressService.setLastLesson(
      this.classId(),
      this.folderId(),
      this.material().id
    );

    this.router.navigate(['/learn', this.material().id], {
      queryParams: {
        classId: this.classId(),
        folderId: this.folderId(),
      },
    });
  }
}
