import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  DestroyRef,
  inject,
  input,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DrawerModule } from 'primeng/drawer';

import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { LessonMaterialsService } from '../../shared/services/api/lesson-materials/lesson-materials.service';
import { LessonProgressService } from '../../shared/services/api/local-lesson-progress/local-lesson-progress.service';

import { clearQueryParams } from '../../shared/utils/util-functions';

import { HeaderComponent } from '../../core/layout/header/header.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideoDescriptionComponent } from './video-description/video-description.component';
import { LessonFeedbackComponent } from './lesson-feedback/lesson-feedback.component';
import { LessonSidebarComponent } from './lesson-sidebar/lesson-sidebar.component';
import { LessonFooterComponent } from './lesson-footer/lesson-footer.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { AudioListenerComponent } from './audio-listener/audio-listener.component';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { PreviewLessonSkeletonComponent } from '../../shared/components/skeleton/view-lesson-skeleton/view-lesson-skeleton.component';

import { type LessonMaterial } from '../../shared/models/entities/lesson-material.model';
import { type GetAllFoldersMaterialsResponse } from '../../shared/models/api/response/query/get-all-folders-materials-response.model';

@Component({
  selector: 'app-watch-lessons',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    HeaderComponent,
    VideoPlayerComponent,
    VideoDescriptionComponent,
    LessonFeedbackComponent,
    LessonSidebarComponent,
    LessonFooterComponent,
    CommentModalComponent,
    AudioListenerComponent,
    DocViewerComponent,
    PdfViewerComponent,
    PreviewLessonSkeletonComponent,
  ],
  templateUrl: './watch-lessons.component.html',
  styleUrl: './watch-lessons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchLessonsComponent implements OnInit {
  // Services
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loadingService = inject(LoadingService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly lessonMaterialService = inject(LessonMaterialsService);
  private readonly localLessonProgressService = inject(LessonProgressService);

  // Service signals
  material = this.lessonMaterialService.lessonMaterial;
  foldersAndLessonMaterials = this.lessonMaterialService.foldersLessonMaterials;

  isLoadingGetMaterial = this.loadingService.is('get-material');
  isLoadingGetAllFoldersAndMaterials = this.loadingService.is(
    'all-folders-and-materials'
  );

  // Component inputs
  readonly materialId = input.required<string>();

  classId = signal<string>('');
  folderId = signal<string>('');
  materialIdFromRoute = signal<string>('');
  questionIdFromNotification = signal<string>('');
  currentFolderIndex = signal<number>(0);
  currentFolder = signal<GetAllFoldersMaterialsResponse | undefined>(undefined);
  searchTerm = signal<string>('');

  // UI state
  isSidebarOpen = signal<boolean>(false);
  isChapterModalOpen = false;
  isCommentModalOpen = false;

  // Track loading state to prevent loops
  private readonly isInitialLoad = signal<boolean>(true);
  private readonly lastLoadedMaterialId = signal<string | null>(null);
  private readonly lastLoadedFolderId = signal<string | null>(null);

  // Track if we are in search mode
  isSearching = computed(() => {
    const term = this.searchTerm();
    return term !== null && term !== undefined && term.trim().length > 0;
  });

  // Computed signal for filtered materials
  filteredFoldersAndMaterials = computed(() => {
    const folders = this.foldersAndLessonMaterials();
    const searchTerm = this.searchTerm().trim().toLowerCase();

    // Return original list if no folders or no search
    if (!folders || folders.length === 0 || !this.isSearching()) {
      return folders ?? [];
    }

    // Create a new array to avoid mutating the original
    return folders.reduce((acc: GetAllFoldersMaterialsResponse[], folder) => {
      // Deep clone the folder to avoid mutation
      const newFolder = { ...folder };

      // Filter materials that match the search term
      const filteredMaterials =
        folder.lessonMaterials?.filter(
          material =>
            material.title?.toLowerCase().includes(searchTerm) ||
            material.description?.toLowerCase().includes(searchTerm)
        ) ?? [];

      // Only include folder if it has matching materials
      if (filteredMaterials.length > 0) {
        newFolder.lessonMaterials = filteredMaterials;
        newFolder.countLessonMaterials = filteredMaterials.length;
        acc.push(newFolder);
      }

      return acc;
    }, []);
  });

  // --- Computed signals for disabling buttons ---
  isFirstMaterial = computed(() => {
    const folders = this.filteredFoldersAndMaterials();
    if (!folders || folders.length === 0) return true;

    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    if (currentFolderIndex === -1) return true;

    const currentFolder = folders[currentFolderIndex];
    const currentMaterials = currentFolder.lessonMaterials ?? [];
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);

    // First material in first folder
    return currentFolderIndex === 0 && currentIndex === 0;
  });

  isLastMaterial = computed(() => {
    const folders = this.filteredFoldersAndMaterials();
    if (!folders || folders.length === 0) return true;

    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    if (currentFolderIndex === -1) return true;

    const currentFolder = folders[currentFolderIndex];
    const currentMaterials = currentFolder.lessonMaterials ?? [];
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);

    // Last material in last folder
    return (
      currentFolderIndex === folders.length - 1 &&
      currentIndex === currentMaterials.length - 1
    );
  });

  constructor() {
    // Watch for material ID and folder ID changes
    effect(
      () => {
        const currentMaterialId = this.materialId();
        const currentFolderId = this.folderId();

        // Skip on initial load
        if (this.isInitialLoad()) return;

        // Check if material ID changed
        if (
          currentMaterialId &&
          currentMaterialId !== this.lastLoadedMaterialId()
        ) {
          this.lastLoadedMaterialId.set(currentMaterialId);
          this.getMaterial();
        }

        // Check if folder ID changed
        if (currentFolderId && currentFolderId !== this.lastLoadedFolderId()) {
          this.lastLoadedFolderId.set(currentFolderId);
          this.getCurrentFolder();
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  ngOnInit(): void {
    // Combine both route params and query params to handle URL changes
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const routeMaterialId = params['materialId'];
        if (routeMaterialId) {
          this.materialIdFromRoute.set(routeMaterialId);
          this.lastLoadedMaterialId.set(routeMaterialId);
          // Always reload material when materialId changes
          this.getMaterial();
        }
      });

    // Listen to query parameters (classId, folderId)
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const newClassId = params['classId'] ?? '';
        const newFolderId = params['folderId'] ?? '';
        const classIdChanged = newClassId !== this.classId();
        const folderIdChanged = newFolderId !== this.folderId();

        this.classId.set(newClassId);
        this.folderId.set(newFolderId);

        if (classIdChanged) {
          // When class changes, reload everything
          this.getFoldersAndMaterials();
        }

        if (folderIdChanged) {
          this.lastLoadedFolderId.set(newFolderId);
          this.getCurrentFolder();
        }

        // Initial load
        if (this.isInitialLoad()) {
          this.loadData();
          this.isInitialLoad.set(false);
        }
      });

    this.activatedRoute.queryParamMap.subscribe(params => {
      const questionId = params.get('questionId');
      const isLinkedFromNotification = params.has('isLinkedFromNotification');

      if (isLinkedFromNotification) {
        this.isCommentModalOpen = true;

        if (questionId) {
          this.questionIdFromNotification.set(questionId);
        }

        clearQueryParams(this.router, this.activatedRoute, [
          'isLinkedFromNotification',
          'questionId',
        ]);
      }
    });
  }

  // Public methods
  openChapterModal(): void {
    this.isChapterModalOpen = true;
  }

  closeChapterModal(): void {
    this.isChapterModalOpen = false;
  }

  openCommentModal(): void {
    this.isCommentModalOpen = true;
  }

  closeCommentModal(): void {
    this.isCommentModalOpen = false;
  }

  formatUpdateDate(input?: string | null): string {
    if (!input) return 'Bài học chưa từng được cập nhật';

    const date = new Date(input);
    if (isNaN(date.getTime())) return 'Định dạng ngày không hợp lệ';

    return `Cập nhật tháng ${date.getUTCMonth() + 1} năm ${date.getUTCFullYear()}`;
  }

  onSearchTriggered(term: string): void {
    this.searchTerm.set(term);
  }

  // Private methods
  private loadData(): void {
    const currentMaterialId = this.materialIdFromRoute() ?? this.materialId();
    const currentFolderId = this.folderId();
    const currentClassId = this.classId();

    if (!currentClassId) {
      return;
    }

    // Set last loaded values
    this.lastLoadedMaterialId.set(currentMaterialId);
    this.lastLoadedFolderId.set(currentFolderId);

    // First get folders and materials
    this.getFoldersAndMaterials();

    // Then get the current material
    if (currentMaterialId) {
      this.getMaterial();
    }
  }

  private getMaterial(): void {
    const materialIdToUse = this.materialIdFromRoute() ?? this.materialId();

    if (!materialIdToUse) return;

    if (this.isLoadingGetMaterial()) return;

    this.lessonMaterialService
      .fetchLessonMaterialById(materialIdToUse)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // After getting material, ensure folders are loaded
          if (!this.foldersAndLessonMaterials().length) {
            this.getFoldersAndMaterials();
          }
        },
      });
  }
  private getFoldersAndMaterials(): void {
    if (!this.classId()) return;

    // Prevent multiple simultaneous calls
    if (this.isLoadingGetAllFoldersAndMaterials()) return;

    this.lessonMaterialService
      .getAllFoldersAndLessonMaterials(this.classId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Wait for the next tick to ensure the data is updated
          setTimeout(() => {
            this.getCurrentFolder();
          }, 0);
        },
      });
  }

  private getCurrentFolder(): void {
    const folders = this.foldersAndLessonMaterials();
    if (!folders || folders.length === 0) {
      // If folders are not loaded yet, wait for them
      this.getFoldersAndMaterials();
      return;
    }

    const foundFolder = folders.find(
      (item: GetAllFoldersMaterialsResponse, index: number) => {
        if (item.id === this.folderId()) {
          this.currentFolderIndex.set(index + 1);
          return true;
        }
        return false;
      }
    );

    if (foundFolder) {
      this.currentFolder.set(foundFolder);
    }
  }

  private getCurrentMaterialIndex(materials: LessonMaterial[]): number {
    const materialIdToUse = this.materialIdFromRoute() ?? this.materialId();
    return materials.findIndex(m => m.id === materialIdToUse);
  }

  private navigateToMaterial(material: LessonMaterial, folderId: string) {
    this.router.navigate(['/learn', material.id], {
      queryParams: {
        classId: this.classId(),
        folderId,
      },
    });
  }

  private findNextNonEmptyFolder(
    folders: GetAllFoldersMaterialsResponse[],
    currentIndex: number
  ): number | null {
    for (let i = currentIndex + 1; i < folders.length; i++) {
      const folder = folders[i];
      if (folder.lessonMaterials && folder.lessonMaterials.length > 0) {
        return i;
      }
    }
    return null;
  }

  goToNextMaterial() {
    const folders = this.filteredFoldersAndMaterials();
    if (!folders || folders.length === 0) return;

    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    const currentFolder = folders.find(f => f.id === currentFolderId);
    const currentMaterials = currentFolder
      ? (currentFolder.lessonMaterials ?? [])
      : [];
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);

    // Check if there's a next material in the current folder
    if (currentIndex < currentMaterials.length - 1) {
      this.navigateToMaterial(
        currentMaterials[currentIndex + 1],
        currentFolderId
      );
      return;
    }

    // Look for the next non-empty folder
    const nextFolderIndex = this.findNextNonEmptyFolder(
      folders,
      currentFolderIndex
    );
    if (nextFolderIndex !== null) {
      const nextFolder = folders[nextFolderIndex];
      const nextMaterials = nextFolder.lessonMaterials ?? [];
      if (nextMaterials.length > 0) {
        this.navigateToMaterial(nextMaterials[0], nextFolder.id);
      }
    }
  }

  private findPreviousNonEmptyFolder(
    folders: GetAllFoldersMaterialsResponse[],
    currentIndex: number
  ): number | null {
    for (let i = currentIndex - 1; i >= 0; i--) {
      const folder = folders[i];
      if (folder.lessonMaterials && folder.lessonMaterials.length > 0) {
        return i;
      }
    }
    return null;
  }

  goToPreviousMaterial() {
    const folders = this.filteredFoldersAndMaterials();
    if (!folders || folders.length === 0) return;

    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    const currentFolder = folders.find(f => f.id === currentFolderId);
    const currentMaterials = currentFolder
      ? (currentFolder.lessonMaterials ?? [])
      : [];
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);
    let currentMaterial;

    // Check if there's a previous material in the current folder
    if (currentIndex > 0) {
      currentMaterial = currentMaterials[currentIndex - 1];
      this.navigateToMaterial(currentMaterial, currentFolderId);
      return;
    }

    // Look for the previous non-empty folder
    const prevFolderIndex = this.findPreviousNonEmptyFolder(
      folders,
      currentFolderIndex
    );
    if (prevFolderIndex !== null) {
      const prevFolder = folders[prevFolderIndex];
      const prevMaterials = prevFolder.lessonMaterials ?? [];
      if (prevMaterials.length > 0) {
        currentMaterial = prevMaterials[prevMaterials.length - 1];
        this.navigateToMaterial(currentMaterial, prevFolder.id);
      }
    }

    if (currentMaterial) {
      this.localLessonProgressService.setLastLesson(
        this.classId(),
        currentFolderId,
        currentMaterial.id
      );
    }
  }

  // --- Event Handlers for Footer ---
  onNextMaterial() {
    this.goToNextMaterial();
  }

  onPrevMaterial() {
    this.goToPreviousMaterial();
  }
}
