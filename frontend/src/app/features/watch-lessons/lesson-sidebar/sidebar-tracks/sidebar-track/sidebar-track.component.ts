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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

import { Folder } from '../../../../../shared/models/entities/folder.model';
import { LessonMaterialsService } from '../../../../../shared/services/api/lesson-materials/lesson-materials.service';
import { LessonMaterial } from '../../../../../shared/models/entities/lesson-material.model';
import { LoadingService } from '../../../../../shared/services/core/loading/loading.service';
import { GetLessonMaterialsRequest } from '../../../../../shared/models/api/request/query/get-lesson-materials-request.model';
import { LessonMaterialStatus } from '../../../../../shared/models/enum/lesson-material.enum';
import { ToastHandlingService } from '../../../../../shared/services/core/toast/toast-handling.service';
import { SecondsToMinutesPipe } from '../../../../../shared/pipes/seconds-to-minutes.pipe';
import { LessonProgressService } from '../../../../../shared/services/api/local-lesson-progress/local-lesson-progress.service';

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
export class SidebarTrackComponent implements OnInit, AfterViewInit, OnChanges {
  private readonly materialService = inject(LessonMaterialsService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastHandlingService = inject(ToastHandlingService);
  private readonly localLessonProgressService = inject(LessonProgressService);
  private readonly router = inject(Router);
  private readonly libIcon = inject(FaIconLibrary);

  isLoadingGetMaterials = this.loadingService.is('get-materials');

  readonly folder = input.required<Folder>();
  readonly index = input.required<number>();
  readonly materialId = input.required<string>();
  readonly currentFolderId = input.required<string>();

  materials = signal<LessonMaterial[]>([]);
  isExpanded = signal<boolean>(false);

  @ViewChildren('materialItem') materialItems!: QueryList<ElementRef>;

  constructor() {
    this.libIcon.addIcons(faCircleCheck, faFileLines, faCirclePlay, faFilePdf);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.scrollToActiveMaterial();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['currentFolderId'] &&
      this.currentFolderId() === this.folder().id
    ) {
      this.isExpanded.set(true);
      this.getMaterials();
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
      this.getMaterials();
    }
  }

  chooseLessonMaterial(materialId: string) {
    this.localLessonProgressService.setLastLesson(
      this.folder().classId!,
      this.folder().id,
      materialId
    );
    this.router.navigate(['/learn', materialId], {
      queryParams: {
        classId: this.folder().classId,
        folderId: this.folder().id,
      },
    });
  }

  private getMaterials() {
    const getLessonMaterialsRequest: GetLessonMaterialsRequest = {
      classId: this.folder().classId,
      folderId: this.folder().id,
      lessonStatus: LessonMaterialStatus.Approved,
      sortBy: 'lastmodifiedat',
      sortDirection: 'asc',
    };

    this.materialService
      .getLessonMaterialsInFolder(getLessonMaterialsRequest)
      .subscribe({
        next: res => {
          this.materials.set(res ?? []);
        },
        error: _ => {
          this.toastHandlingService.errorGeneral();
        },
      });
  }

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
