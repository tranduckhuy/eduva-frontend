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

import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { LessonMaterialsService } from '../../shared/services/api/lesson-materials/lesson-materials.service';
import { LessonProgressService } from '../../shared/services/api/local-lesson-progress/local-lesson-progress.service';

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
import { PreviewLessonSkeletonComponent } from '../../shared/components/skeleton/view-lesson-skeleton/view-lesson-skeleton.component';

import { type LessonMaterial } from '../../shared/models/entities/lesson-material.model';
import { GetAllFoldersMaterialsResponse } from '../../shared/models/api/response/query/get-all-folders-materials-response.model';

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

  // Track if we are in search mode
  private readonly isSearching = computed(() => {
    const term = this.searchTerm();
    return term !== null && term !== undefined && term.trim().length > 0;
  });

  // Computed signal for filtered materials
  filteredFoldersAndMaterials = computed(() => {
    const folders = this.foldersAndLessonMaterials();
    const searchTerm = this.searchTerm().trim().toLowerCase();

    // Return original list if no folders or no search
    if (!folders || folders.length === 0 || !this.isSearching()) {
      return folders || [];
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
        ) || [];

      // Only include folder if it has matching materials
      if (filteredMaterials.length > 0) {
        newFolder.lessonMaterials = filteredMaterials;
        newFolder.countLessonMaterials = filteredMaterials.length;
        acc.push(newFolder);
      }

      return acc;
    }, []);
  });

  isLoadingGetMaterial = this.loadingService.is('get-material');
  isLoadingGetAllFoldersAndMaterials = this.loadingService.is(
    'all-folders-and-materials'
  );

  // Component inputs
  readonly materialId = input.required<string>();

  classId = signal<string>('');
  folderId = signal<string>('');
  materialIdFromRoute = signal<string>('');
  currentFolderIndex = signal<number>(0);
  currentFolder = signal<GetAllFoldersMaterialsResponse | undefined>(undefined);
  searchTerm = signal<string>('');

  // UI state
  isSidebarOpen = signal<boolean>(false);
  isChapterModalOpen = signal<boolean>(false);
  isCommentModalOpen = signal<boolean>(false);

  // Track loading state to prevent loops
  private readonly isInitialLoad = signal<boolean>(true);
  private readonly lastLoadedMaterialId = signal<string | null>(null);
  private readonly lastLoadedFolderId = signal<string | null>(null);

  // --- Computed signals for disabling buttons ---
  isFirstMaterial = computed(() => {
    const folders = this.filteredFoldersAndMaterials();
    if (!folders || folders.length === 0) return true;

    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    if (currentFolderIndex === -1) return true;

    const currentFolder = folders[currentFolderIndex];
    const currentMaterials = currentFolder.lessonMaterials || [];
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
    const currentMaterials = currentFolder.lessonMaterials || [];
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);

    // Last material in last folder
    return (
      currentFolderIndex === folders.length - 1 &&
      currentIndex === currentMaterials.length - 1
    );
  });

  // Cache for folder materials

  constructor() {
    // Watch for material ID and folder ID changes
    effect(() => {
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
    });
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

  onSearchTriggered(term: string): void {
    console.log('Search triggered with term:', term);

    this.searchTerm.set(term);
  }

  // Private methods
  private loadData(): void {
    const currentMaterialId = this.materialIdFromRoute() || this.materialId();
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
    const materialIdToUse = this.materialIdFromRoute() || this.materialId();

    if (!materialIdToUse) {
      console.warn('Cannot fetch material: materialId is empty');
      return;
    }

    if (this.isLoadingGetMaterial()) {
      return;
    }

    this.lessonMaterialService
      .fetchLessonMaterialById(materialIdToUse)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Material state is managed by the service
          // After getting material, ensure folders are loaded
          if (!this.foldersAndLessonMaterials().length) {
            this.getFoldersAndMaterials();
          }
        },
        error: error => {
          console.error('Error fetching material:', error);
        },
      });
  }
  private getFoldersAndMaterials(): void {
    if (!this.classId()) {
      return;
    }

    // Prevent multiple simultaneous calls
    if (this.isLoadingGetAllFoldersAndMaterials()) {
      return;
    }

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
    const materialIdToUse = this.materialIdFromRoute() || this.materialId();
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

  goToNextMaterial() {
    const folders = this.filteredFoldersAndMaterials();
    if (!folders || folders.length === 0) return;

    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    const currentFolder = folders.find(f => f.id === currentFolderId);
    const currentMaterials = currentFolder ? currentFolder.lessonMaterials : [];
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);

    if (currentIndex < currentMaterials.length - 1) {
      // Next material in current folder
      this.navigateToMaterial(
        currentMaterials[currentIndex + 1],
        currentFolderId
      );
    } else if (currentFolderIndex < folders.length - 1) {
      // First material in next folder
      const nextFolder = folders[currentFolderIndex + 1];
      const nextMaterials = nextFolder.lessonMaterials || [];
      if (nextMaterials.length > 0) {
        this.navigateToMaterial(nextMaterials[0], nextFolder.id);
      }
    }
  }

  goToPreviousMaterial() {
    const folders = this.filteredFoldersAndMaterials();
    if (!folders || folders.length === 0) return;

    const currentFolderId = this.folderId();
    const currentFolderIndex = folders.findIndex(f => f.id === currentFolderId);
    const currentFolder = folders.find(f => f.id === currentFolderId);
    const currentMaterials = currentFolder ? currentFolder.lessonMaterials : [];
    const currentIndex = this.getCurrentMaterialIndex(currentMaterials);
    let currentMaterial;

    if (currentIndex > 0) {
      // Previous material in current folder
      this.navigateToMaterial(
        currentMaterials[currentIndex - 1],
        currentFolderId
      );
      currentMaterial = currentMaterials[currentIndex - 1];
    } else if (currentFolderIndex > 0) {
      // Last material in previous folder
      const prevFolder = folders[currentFolderIndex - 1];
      const prevMaterials = prevFolder.lessonMaterials || [];
      if (prevMaterials.length > 0) {
        this.navigateToMaterial(
          prevMaterials[prevMaterials.length - 1],
          prevFolder.id
        );
        currentMaterial = prevMaterials[prevMaterials.length - 1];
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
