import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../../../core/layout/header/header.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideoDescriptionComponent } from './video-description/video-description.component';
import { LessonFeedbackComponent } from './lesson-feedback/lesson-feedback.component';
import { LessonSidebarComponent } from './lesson-sidebar/lesson-sidebar.component';
import { LessonFooterComponent } from './lesson-footer/lesson-footer.component';
import { ChapterModalComponent } from './chapter-modal/chapter-modal.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';

@Component({
  selector: 'app-watch-lessons',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    VideoPlayerComponent,
    VideoDescriptionComponent,
    LessonFeedbackComponent,
    LessonSidebarComponent,
    LessonFooterComponent,
    ChapterModalComponent,
    CommentModalComponent,
  ],
  templateUrl: './watch-lessons.component.html',
  styleUrl: './watch-lessons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchLessonsComponent {
  subjectId = input.required<string>();

  isSidebarOpen = signal<boolean>(false);
  isChapterModalOpen = signal<boolean>(false);
  isCommentModalOpen = signal<boolean>(false);

  openChapterModal() {
    this.isChapterModalOpen.set(true);
  }

  closeChapterModal() {
    this.isChapterModalOpen.set(false);
  }

  openCommentModal() {
    this.isCommentModalOpen.set(true);
  }

  closeCommentModal() {
    this.isCommentModalOpen.set(false);
  }
}
