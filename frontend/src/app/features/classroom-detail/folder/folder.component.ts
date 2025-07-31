import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';

import { LessonItemComponent } from './lesson-item/lesson-item.component';
import { UserService } from '../../../shared/services/api/user/user.service';
import { GetAllFoldersMaterialsResponse } from '../../../shared/models/api/response/query/get-all-folders-materials-response.model';

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

  currentUser = this.userService.currentUser;

  readonly classId = input.required<string>();
  readonly folder = input.required<GetAllFoldersMaterialsResponse>();
  readonly index = input.required<number>();

  isCollapsed = signal<boolean>(true);

  toggleCollapse() {
    if (this.isCollapsed()) {
      this.isCollapsed.set(false);
    } else {
      this.isCollapsed.set(true);
    }
  }
}
