import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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
import {
  LessonMaterialStatus,
  LessonMaterialVisibility,
} from '../../../../../shared/models/enum/lesson-material.enum';
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
export class SidebarTrackComponent implements OnInit {
  private readonly materialService = inject(LessonMaterialsService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastHandlingService = inject(ToastHandlingService);
  private readonly localLessonProgressService = inject(LessonProgressService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly libIcon = inject(FaIconLibrary);

  isLoadingGetMaterials = this.loadingService.is('get-materials');

  readonly folder = input.required<Folder>();
  readonly index = input.required<number>();
  readonly materialId = input.required<string>();

  materials = signal<LessonMaterial[]>([]);
  isExpanded = signal<boolean>(false);

  constructor() {
    this.libIcon.addIcons(faCircleCheck, faFileLines, faCirclePlay, faFilePdf);
  }

  ngOnInit(): void {
    let folderId;
    this.activatedRoute.queryParams.subscribe(params => {
      folderId = params['folderId'];
    });
    if (this.folder().id === folderId) {
      this.isExpanded.set(true);
      this.getMaterials();
    } else {
      this.isExpanded.set(false);
    }
  }

  toggleExpand() {
    if (this.isExpanded()) {
      this.isExpanded.set(false);
    } else {
      this.getMaterials();
      this.isExpanded.set(true);
    }
  }

  chooseLessonMaterial(materialId: string) {
    this.localLessonProgressService.setLastLesson(
      this.folder().classId!,
      this.folder().id,
      this.materialId()
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
      visibility: LessonMaterialVisibility.School,
    };

    this.materialService
      .getLessonMaterials(getLessonMaterialsRequest)
      .subscribe({
        next: res => {
          this.materials.set(res ?? []);
        },
        error: _ => {
          this.toastHandlingService.errorGeneral();
        },
      });
  }
}
