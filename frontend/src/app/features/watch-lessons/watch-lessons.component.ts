import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
import { GetFoldersRequest } from '../../shared/models/api/request/query/get-folders-request.model';
import { FolderOwnerType } from '../../shared/models/enum/folder-owner-type.enum';
import { Folder } from '../../shared/models/entities/folder.model';
import { AudioListenerComponent } from './audio-listener/audio-listener.component';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';

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
    AudioListenerComponent,
    DocViewerComponent,
    PdfViewerComponent,
  ],
  templateUrl: './watch-lessons.component.html',
  styleUrl: './watch-lessons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchLessonsComponent implements OnInit {
  // Services
  private readonly folderService = inject(FolderManagementService);
  private readonly loadingService = inject(LoadingService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly lessonMaterialService = inject(LessonMaterialsService);
  private readonly destroyRef = inject(DestroyRef);

  // Service signals
  isLoadingGetFolders = this.loadingService.is('get-folders');
  isLoadingGetMaterial = this.loadingService.is('get-material');
  folders = this.folderService.folderList;
  folder = this.folderService.folder;
  material = this.lessonMaterialService.lessonMaterial;

  // Component inputs
  readonly materialId = input.required<string>();
  classId = signal<string>('');
  folderId = signal<string>('');

  // UI state
  isSidebarOpen = signal<boolean>(false);
  isChapterModalOpen = signal<boolean>(false);
  isCommentModalOpen = signal<boolean>(false);
  currentFolderIndex = signal<number>(0);
  currentFolder = signal<Folder | undefined>(undefined);

  // Track loading state to prevent loops
  private isInitialLoad = signal<boolean>(true);
  private lastLoadedMaterialId = signal<string | null>(null);

  // Effect to watch for materialId changes
  private readonly materialIdEffect = effect(
    () => {
      const currentMaterialId = this.materialId();
      if (
        currentMaterialId &&
        currentMaterialId !== this.lastLoadedMaterialId()
      ) {
        this.loadData();
      }
    },
    { allowSignalWrites: true }
  );

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.classId.set(params['classId'] || '');
        this.folderId.set(params['folderId'] || '');

        // Only load on initial route params if we haven't loaded yet
        if (this.isInitialLoad()) {
          this.loadData();
          this.isInitialLoad.set(false);
        }
      });
  }

  // Public methods
  openChapterModal(): void {
    this.isChapterModalOpen.set(true);
  }

  closeChapterModal(): void {
    this.isChapterModalOpen.set(false);
  }

  openCommentModal(): void {
    this.isCommentModalOpen.set(true);
  }

  closeCommentModal(): void {
    this.isCommentModalOpen.set(false);
  }

  formatUpdateDate(input?: string | null): string {
    if (!input) return 'Bài học chưa từng được cập nhật';

    const date = new Date(input);
    if (isNaN(date.getTime())) return 'Định dạng ngày không hợp lệ';

    return `Cập nhật tháng ${date.getUTCMonth() + 1} năm ${date.getUTCFullYear()}`;
  }

  // Private methods
  private loadData(): void {
    const currentMaterialId = this.materialId();
    if (
      !currentMaterialId ||
      currentMaterialId === this.lastLoadedMaterialId()
    ) {
      return;
    }

    this.lastLoadedMaterialId.set(currentMaterialId);
    this.getMaterial();
    this.getClassFolders();
  }

  private getMaterial(): void {
    this.lessonMaterialService
      .fetchLessonMaterialById(this.materialId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private getClassFolders(): void {
    const getFoldersRequest: GetFoldersRequest = {
      ownerType: FolderOwnerType.Class,
    };

    this.folderService
      .getClassFolders(getFoldersRequest, this.classId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.getCurrentFolder(),
        error: err => console.error('Failed to load folders:', err),
      });
  }

  private getCurrentFolder(): void {
    const foundFolder = this.folders().find((folder: Folder, index: number) => {
      if (folder.id === this.folderId()) {
        this.currentFolderIndex.set(index + 1);
        return true;
      }
      return false;
    });

    this.currentFolder.set(foundFolder);
  }
}
