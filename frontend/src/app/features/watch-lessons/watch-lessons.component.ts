import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  DestroyRef,
  inject,
  input,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { FolderManagementService } from '../../shared/services/api/folder/folder-management.service';
import { LessonMaterialsService } from '../../shared/services/api/lesson-materials/lesson-materials.service';
import { LessonProgressService } from '../../shared/services/api/local-lesson-progress/local-lesson-progress.service';

import { FolderOwnerType } from '../../shared/models/enum/folder-owner-type.enum';

import { HeaderComponent } from '../../core/layout/header/header.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideoDescriptionComponent } from './video-description/video-description.component';
import { LessonFeedbackComponent } from './lesson-feedback/lesson-feedback.component';
import { LessonSidebarComponent } from './lesson-sidebar/lesson-sidebar.component';
import { LessonFooterComponent } from './lesson-footer/lesson-footer.component';
import { ChapterModalComponent } from './chapter-modal/chapter-modal.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { AudioListenerComponent } from './audio-listener/audio-listener.component';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';

import { type Folder } from '../../shared/models/entities/folder.model';
import { type LessonMaterial } from '../../shared/models/entities/lesson-material.model';
import { type GetFoldersRequest } from '../../shared/models/api/request/query/get-folders-request.model';

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
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly folderService = inject(FolderManagementService);
  private readonly loadingService = inject(LoadingService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly lessonMaterialService = inject(LessonMaterialsService);
  private readonly localLessonProgressService = inject(LessonProgressService);

  // Service signals
  folders = this.folderService.folderList;
  folder = this.folderService.folder;
  material = this.lessonMaterialService.lessonMaterial;
  isLoadingGetFolders = this.loadingService.is('get-folders');
  isLoadingGetMaterial = this.loadingService.is('get-material');

  // Component inputs
  readonly materialId = input.required<string>();

  classId = signal<string>('');
  folderId = signal<string>('');
  currentFolderIndex = signal<number>(0);
  currentFolder = signal<Folder | undefined>(undefined);

  // UI state
  isSidebarOpen = signal<boolean>(false);
  isChapterModalOpen = signal<boolean>(false);
  isCommentModalOpen = signal<boolean>(false);

  // Track loading state to prevent loops
  private readonly isInitialLoad = signal<boolean>(true);
  private readonly lastLoadedMaterialId = signal<string | null>(null);

  // --- Computed signals for disabling buttons ---
  isFirstMaterial = computed(() => {
    const folders = this.folders();
    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    if (currentFolderIndex === -1) return true;
    const currentMaterials =
      this.folderMaterialsCache.get(currentFolderId) ?? [];
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);
    // First folder and first material
    return currentFolderIndex === 0 && currentIndex === 0;
  });

  isLastMaterial = computed(() => {
    const folders = this.folders();
    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    if (currentFolderIndex === -1) return true;
    const currentMaterials =
      this.folderMaterialsCache.get(currentFolderId) ?? [];
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);
    // Last folder and last material
    return (
      currentFolderIndex === folders.length - 1 &&
      currentIndex === currentMaterials.length - 1
    );
  });

  // Cache for folder materials
  private readonly folderMaterialsCache = new Map<string, LessonMaterial[]>();

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.classId.set(params['classId'] ?? '');
        this.folderId.set(params['folderId'] ?? '');

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

  // --- Navigation Methods ---
  private async loadMaterialsForFolder(
    folderId: string
  ): Promise<LessonMaterial[]> {
    if (this.folderMaterialsCache.has(folderId)) {
      return this.folderMaterialsCache.get(folderId)!;
    }
    // Use lessonMaterialService to get materials in folder
    return new Promise(resolve => {
      this.lessonMaterialService
        .getLessonMaterialsInFolder({
          classId: this.classId(),
          folderId,
          lessonStatus: 1,
          sortBy: 'lastmodifiedat',
          sortDirection: 'asc',
        })
        .subscribe(materials => {
          const result = materials ?? [];
          this.folderMaterialsCache.set(folderId, result);
          resolve(result);
        });
    });
  }

  private getCurrentMaterialIndex(materials: LessonMaterial[]): number {
    return materials.findIndex(m => m.id === this.materialId());
  }

  async goToNextMaterial() {
    const folders = this.folders();
    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    const currentMaterials = await this.loadMaterialsForFolder(currentFolderId);
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);
    let currentMaterial;

    if (currentIndex < currentMaterials.length - 1) {
      this.navigateToMaterial(
        currentMaterials[currentIndex + 1],
        currentFolderId
      );
      currentMaterial = currentMaterials[currentIndex + 1];
    } else if (currentFolderIndex < folders.length - 1) {
      const nextFolder = folders[currentFolderIndex + 1];
      const nextMaterials = await this.loadMaterialsForFolder(nextFolder.id);
      if (nextMaterials.length > 0) {
        this.navigateToMaterial(nextMaterials[0], nextFolder.id);
      }
      currentMaterial = nextMaterials[0];
    }
    this.localLessonProgressService.setLastLesson(
      this.classId(),
      currentFolderId,
      currentMaterial!.id
    );
  }

  async goToPreviousMaterial() {
    const folders = this.folders();
    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    const currentMaterials = await this.loadMaterialsForFolder(currentFolderId);
    let currentMaterial;
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);
    if (currentIndex > 0) {
      this.navigateToMaterial(
        currentMaterials[currentIndex - 1],
        currentFolderId
      );
      currentMaterial = currentMaterials[currentIndex - 1];
    } else if (currentFolderIndex > 0) {
      const prevFolder = folders[currentFolderIndex - 1];
      const prevMaterials = await this.loadMaterialsForFolder(prevFolder.id);
      if (prevMaterials.length > 0) {
        this.navigateToMaterial(
          prevMaterials[prevMaterials.length - 1],
          prevFolder.id
        );
      }
      currentMaterial = prevMaterials[prevMaterials.length - 1];
    }

    this.localLessonProgressService.setLastLesson(
      this.classId(),
      currentFolderId,
      currentMaterial!.id
    );
  }

  private navigateToMaterial(material: LessonMaterial, folderId: string) {
    this.router.navigate(['/learn', material.id], {
      queryParams: {
        classId: this.classId(),
        folderId,
      },
    });
  }

  // --- Event Handlers for Footer ---
  onNextMaterial() {
    this.goToNextMaterial();
  }

  onPrevMaterial() {
    this.goToPreviousMaterial();
  }
}
