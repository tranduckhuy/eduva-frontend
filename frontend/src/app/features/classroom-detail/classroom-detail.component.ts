import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';

import { FolderComponent } from './folder/folder.component';
import { WatchLessonBadgeComponent } from './watch-lesson-badge/watch-lesson-badge.component';
import { FolderManagementService } from '../../shared/services/api/folder/folder-management.service';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { GetFoldersRequest } from '../../shared/models/api/request/query/get-folders-request.model';
import { FolderOwnerType } from '../../shared/models/enum/folder-owner-type.enum';
import { ClassService } from '../../shared/services/api/class/class.service';
import { ClassDetailFolderSkeletonComponent } from '../../shared/components/skeleton/class-detail-folder-skeleton/class-detail-folder-skeleton.component';
import { UserService } from '../../shared/services/api/user/user.service';
import { Skeleton } from 'primeng/skeleton';
import { WatchLessonCardSkeletonComponent } from '../../shared/components/skeleton/watch-lesson-card-skeleton/watch-lesson-card-skeleton.component';
import { ToastHandlingService } from '../../shared/services/core/toast/toast-handling.service';
import { LessonProgressService } from '../../shared/services/api/local-lesson-progress/local-lesson-progress.service';
import { Router } from '@angular/router';
import { GetLessonMaterialsRequest } from '../../shared/models/api/request/query/get-lesson-materials-request.model';
import { LessonMaterialsService } from '../../shared/services/api/lesson-materials/lesson-materials.service';
import { Folder } from '../../shared/models/entities/folder.model';
import { LessonMaterialStatus } from '../../shared/models/enum/lesson-material.enum';

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
  private readonly folderService = inject(FolderManagementService);
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

  folders = this.folderService.folderList;
  classDetail = this.classService.classModel;
  currentUser = this.userService.currentUser;

  ngOnInit(): void {
    const getFoldersRequest: GetFoldersRequest = {
      ownerType: FolderOwnerType.Class,
    };
    this.folderService
      .getClassFolders(getFoldersRequest, this.classId())
      .subscribe();

    this.classService.getStudentClassById(this.classId()).subscribe();
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
        const folderHasLesson = this.folders().find(
          (folder: Folder) => folder.countLessonMaterial > 0
        );

        if (!folderHasLesson) return;

        const getLessonMaterialsRequest: GetLessonMaterialsRequest = {
          classId: this.classId(),
          folderId: folderHasLesson?.id,
          lessonStatus: LessonMaterialStatus.Approved,
          sortBy: 'lastmodifiedat',
          sortDirection: 'asc',
        };
        this.materialService
          .getLessonMaterialsInFolder(getLessonMaterialsRequest)
          .subscribe({
            next: res => {
              this.router.navigate(['/learn', res![0].id], {
                queryParams: {
                  classId: this.classId(),
                  folderId: folderHasLesson?.id,
                },
              });
            },
          });
      }
    }
  }

  skeletonItems = Array(5).fill(null);
}
