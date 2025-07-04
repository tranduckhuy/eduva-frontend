import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';

import { LessonItemComponent } from './lesson-item/lesson-item.component';
import { Folder } from '../../../shared/models/entities/folder.model';
import { GetLessonMaterialsRequest } from '../../../shared/models/api/request/query/get-lesson-materials-request.model';
import { UserService } from '../../../shared/services/api/user/user.service';
import { LessonMaterialsService } from '../../../shared/services/api/lesson-materials/lesson-materials.service';
import { LoadingService } from '../../../shared/services/core/loading/loading.service';
import { LessonMaterial } from '../../../shared/models/entities/lesson-material.model';
import { ToastHandlingService } from '../../../shared/services/core/toast/toast-handling.service';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [LessonItemComponent],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderComponent {
  private readonly userService = inject(UserService);
  private readonly materialService = inject(LessonMaterialsService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  currentUser = this.userService.currentUser;
  materials = signal<LessonMaterial[]>([]);
  isLoadingGetMaterials = this.loadingService.is('get-materials');

  readonly classId = input.required<string>();
  readonly folder = input.required<Folder>();

  isCollapsed = signal<boolean>(true);

  toggleCollapse() {
    if (this.isCollapsed()) {
      this.isCollapsed.set(false);
      this.getMaterials();
    } else {
      this.isCollapsed.set(true);
    }
  }

  private getMaterials() {
    const getLessonMaterialsRequest: GetLessonMaterialsRequest = {
      classId: this.classId(),
      folderId: this.folder().id,
    };

    this.materialService
      .getLessonMaterials(getLessonMaterialsRequest)
      .subscribe({
        next: res => {
          this.materials.set(res || []);
        },
        error: _ => {
          this.toastHandlingService.errorGeneral();
        },
      });
  }
}
