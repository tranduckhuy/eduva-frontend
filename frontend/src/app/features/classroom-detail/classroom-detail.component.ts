import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { Skeleton } from 'primeng/skeleton';

import { FolderComponent } from './folder/folder.component';
import { WatchLessonBadgeComponent } from './watch-lesson-badge/watch-lesson-badge.component';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { ClassService } from '../../shared/services/api/class/class.service';
import { ClassDetailFolderSkeletonComponent } from '../../shared/components/skeleton/class-detail-folder-skeleton/class-detail-folder-skeleton.component';
import { UserService } from '../../shared/services/api/user/user.service';
import { WatchLessonCardSkeletonComponent } from '../../shared/components/skeleton/watch-lesson-card-skeleton/watch-lesson-card-skeleton.component';
import { ToastHandlingService } from '../../shared/services/core/toast/toast-handling.service';
import { LessonProgressService } from '../../shared/services/api/local-lesson-progress/local-lesson-progress.service';
import { LessonMaterialsService } from '../../shared/services/api/lesson-materials/lesson-materials.service';
import { GetAllFoldersMaterialsResponse } from '../../shared/models/api/response/query/get-all-folders-materials-response.model';

@Component({
  selector: 'app-classroom-detail',
  standalone: true,
  imports: [
    FolderComponent,
    WatchLessonBadgeComponent,
    ClassDetailFolderSkeletonComponent,
    Skeleton,
    WatchLessonCardSkeletonComponent,
  ],
  templateUrl: './classroom-detail.component.html',
  styleUrl: './classroom-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassroomDetailComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);
  private readonly classService = inject(ClassService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastHandlingService);
  private readonly localLessonProgressService = inject(LessonProgressService);
  private readonly materialService = inject(LessonMaterialsService);
  private readonly router = inject(Router);

  readonly classId = input.required<string>();

  isLoadingGetFolders = this.loadingService.is('get-folders');
  isLoadingGetClass = this.loadingService.is('get-class');
  isLoadingGetFoldersMaterials = this.loadingService.is(
    'all-folders-and-materials'
  );

  foldersAndLessonMaterials = this.materialService.foldersLessonMaterials;
  classDetail = this.classService.classModel;
  currentUser = this.userService.currentUser;

  totalDuration = computed(() =>
    this.getTotalDurationFormatted(this.foldersAndLessonMaterials())
  );

  ngOnInit(): void {
    this.materialService
      .getAllFoldersAndLessonMaterials(this.classId())
      .subscribe();

    this.classService.getStudentClassById(this.classId()).subscribe();
  }

  getTotalDurationFormatted(data: GetAllFoldersMaterialsResponse[]): string {
    let totalDuration = 0;

    data.forEach(group => {
      group.lessonMaterials.forEach(material => {
        totalDuration += material.duration || 0;
      });
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
  }

  redirect() {
    if (this.classDetail()!.countLessonMaterial === 0) {
      this.toastService.warn(
        'Lớp học trống',
        'Chưa có bài học nào được thêm vào lớp học này!'
      );
    } else {
      const lastLesson = this.localLessonProgressService.getLastLesson(
        this.classId()
      );

      if (lastLesson) {
        this.router.navigate(['/learn', lastLesson.material], {
          queryParams: {
            classId: this.classId(),
            folderId: lastLesson.folder,
          },
        });
      } else {
        const folderHasLesson = this.foldersAndLessonMaterials().find(
          (folder: GetAllFoldersMaterialsResponse) =>
            folder.countLessonMaterials > 0
        );
        if (!folderHasLesson) return;
        this.router.navigate(
          ['/learn', folderHasLesson.lessonMaterials[0].id],
          {
            queryParams: {
              classId: this.classId(),
              folderId: folderHasLesson?.id,
            },
          }
        );
      }
    }
  }

  skeletonItems = Array(5).fill(null);
}
