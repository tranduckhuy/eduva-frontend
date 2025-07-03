import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../../core/layout/header/header.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideoDescriptionComponent } from './video-description/video-description.component';
import { LessonFeedbackComponent } from './lesson-feedback/lesson-feedback.component';
import { LessonSidebarComponent } from './lesson-sidebar/lesson-sidebar.component';
import { LessonFooterComponent } from './lesson-footer/lesson-footer.component';
import { ChapterModalComponent } from './chapter-modal/chapter-modal.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { FolderManagementService } from '../../shared/services/api/folder/folder-management.service';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { ActivatedRoute } from '@angular/router';
import { LessonMaterialsService } from '../../shared/services/api/lesson-materials/lesson-materials.service';
// import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
// import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
// import { AudioListenerComponent } from './audio-listener/audio-listener.component';

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
    // PdfViewerComponent,
    // DocViewerComponent,
    // AudioListenerComponent,
  ],
  templateUrl: './watch-lessons.component.html',
  styleUrl: './watch-lessons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchLessonsComponent implements OnInit {
  private readonly folderService = inject(FolderManagementService);
  private readonly loadingService = inject(LoadingService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly lessonMaterialService = inject(LessonMaterialsService);

  // Signals from service
  isLoadingGetFolders = this.loadingService.is('get-folders');
  isLoadingGetMaterial = this.loadingService.is('get-material');
  folders = this.folderService.folderList;
  material = this.lessonMaterialService.lessonMaterial;

  readonly materialId = input.required<string>();
  classId = signal<string>('');
  folderId = signal<string>('');

  isSidebarOpen = signal<boolean>(false);
  isChapterModalOpen = signal<boolean>(false);
  isCommentModalOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.classId.set(params['classId']);
      this.folderId.set(params['folderId']);
    });

    // this.getMaterial();
  }

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

  private getMaterial() {
    this.lessonMaterialService
      .fetchLessonMaterialById(this.materialId())
      .subscribe();
  }
}
