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

  skeletonItems = Array(5).fill(null);
}
