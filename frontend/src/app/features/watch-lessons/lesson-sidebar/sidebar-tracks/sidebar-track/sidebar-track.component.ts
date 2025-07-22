import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  input,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TooltipModule } from 'primeng/tooltip';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import {
  faFileLines,
  faCirclePlay,
  faFilePdf,
} from '@fortawesome/free-regular-svg-icons';

import { LessonMaterial } from '../../../../../shared/models/entities/lesson-material.model';
import { LoadingService } from '../../../../../shared/services/core/loading/loading.service';
import { SecondsToMinutesPipe } from '../../../../../shared/pipes/seconds-to-minutes.pipe';
import { LessonProgressService } from '../../../../../shared/services/api/local-lesson-progress/local-lesson-progress.service';
import { GetAllFoldersMaterialsResponse } from '../../../../../shared/models/api/response/query/get-all-folders-materials-response.model';

@Component({
  selector: 'sidebar-track',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    FontAwesomeModule,
    SecondsToMinutesPipe,
  ],
  templateUrl: './sidebar-track.component.html',
  styleUrl: './sidebar-track.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarTrackComponent implements AfterViewInit, OnChanges {
  private readonly loadingService = inject(LoadingService);
  private readonly localLessonProgressService = inject(LessonProgressService);
  private readonly router = inject(Router);
  private readonly libIcon = inject(FaIconLibrary);

  isLoadingGetMaterials = this.loadingService.is('get-materials');

  readonly folder = input.required<GetAllFoldersMaterialsResponse>();
  readonly index = input.required<number>();
  readonly materialId = input.required<string>();
  readonly currentFolderId = input.required<string>();

  materials = signal<LessonMaterial[]>([]);
  isExpanded = signal<boolean>(false);
  private classId = signal<string>('');

  constructor() {
    this.libIcon.addIcons(faCircleCheck, faFileLines, faCirclePlay, faFilePdf);

    // Get classId from query params
    const queryParams = new URLSearchParams(window.location.search);
    this.classId.set(queryParams.get('classId') || '');
    this.libIcon.addIcons(faCircleCheck, faFileLines, faCirclePlay, faFilePdf);
  }

  @ViewChildren('materialItem') materialItems!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.scrollToActiveMaterial();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['currentFolderId'] &&
      this.currentFolderId() === this.folder().id
    ) {
      this.isExpanded.set(true);
    }
    if (changes['materialId']) {
      this.scrollToActiveMaterial();
    }
  }

  toggleExpand() {
    if (this.isExpanded()) {
      this.isExpanded.set(false);
    } else {
      this.isExpanded.set(true);
    }
  }

  chooseLessonMaterial(materialId: string) {
    this.localLessonProgressService.setLastLesson(
      this.classId(),
      this.folder().id,
      materialId
    );
    this.router.navigate(['/learn', materialId], {
      queryParams: {
        classId: this.classId(),
        folderId: this.folder().id,
      },
    });
  }

  getFolderDurationFormatted = (materials: LessonMaterial[]) => {
    let totalDuration = 0;

    materials.forEach(material => {
      totalDuration += material.duration || 0;
    });

    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);

    if (hours >= 1) {
      const paddedHours = String(hours).padStart(2, '0');
      const paddedMinutes = String(minutes).padStart(2, '0');
      return `${paddedHours} giờ ${paddedMinutes} phút`;
    } else if (minutes > 0) {
      return `${minutes} phút`;
    } else {
      return `0 phút`;
    }
  };

  private scrollToActiveMaterial() {
    setTimeout(() => {
      if (!this.materialItems) return;
      const index = this.materials().findIndex(m => m.id === this.materialId());
      if (index !== -1) {
        const el = this.materialItems.toArray()[index]?.nativeElement;
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}
