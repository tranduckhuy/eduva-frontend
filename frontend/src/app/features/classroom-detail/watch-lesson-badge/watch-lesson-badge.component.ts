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
  faPencil,
  faGaugeHigh,
  faFilm,
  faClock,
  faBatteryFull,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { ClassModel } from '../../../shared/models/entities/class.model';
import { FolderManagementService } from '../../../shared/services/api/folder/folder-management.service';
import { LessonProgressService } from '../../../shared/services/api/local-lesson-progress/local-lesson-progress.service';
import { Folder } from '../../../shared/models/entities/folder.model';
import { LessonMaterialsService } from '../../../shared/services/api/lesson-materials/lesson-materials.service';
import { GetLessonMaterialsRequest } from '../../../shared/models/api/request/query/get-lesson-materials-request.model';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';

@Component({
  selector: 'classroom-watch-lesson-badge',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './watch-lesson-badge.component.html',
  styleUrl: './watch-lesson-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchLessonBadgeComponent {
  readonly classDetail = input.required<ClassModel>();
  readonly totalDuration = input.required<string>();

  private readonly libIcon = inject(FaIconLibrary);
  private readonly folderService = inject(FolderManagementService);
  private readonly loadingService = inject(LoadingService);
  private readonly materialService = inject(LessonMaterialsService);
  private readonly toastService = inject(ToastHandlingService);
  private readonly localLessonProgressService = inject(LessonProgressService);
  private readonly router = inject(Router);

  folders = this.folderService.folderList;
  loadingGetMaterials = this.loadingService.is('get-materials');

  constructor() {
    this.libIcon.addIcons(
      faPencil,
      faGaugeHigh,
      faFilm,
      faClock,
      faBatteryFull
    );
  }

  redirect() {
    if (this.classDetail().countLessonMaterial === 0) {
      this.toastService.warn(
        'Lớp học trống',
        'Chưa có bài học nào được thêm vào lớp học này!'
      );
    } else {
      const lastLesson = this.localLessonProgressService.getLastLesson(
        this.classDetail().id
      );

      if (lastLesson) {
        this.router.navigate(['/learn', lastLesson.material], {
          queryParams: {
            classId: this.classDetail().id,
            folderId: lastLesson.folder,
          },
        });
      } else {
        const folderHasLesson = this.folders().find(
          (folder: Folder) => folder.countLessonMaterial > 0
        );

        if (!folderHasLesson) return;

        const getLessonMaterialsRequest: GetLessonMaterialsRequest = {
          classId: this.classDetail().id,
          folderId: folderHasLesson?.id,
        };
        this.materialService
          .getLessonMaterials(getLessonMaterialsRequest)
          .subscribe({
            next: res => {
              this.router.navigate(['/learn', res![0].id], {
                queryParams: {
                  classId: this.classDetail().id,
                  folderId: folderHasLesson?.id,
                },
              });
            },
          });
      }
    }
  }
}
