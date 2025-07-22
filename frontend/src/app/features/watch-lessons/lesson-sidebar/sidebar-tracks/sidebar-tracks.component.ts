import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { SidebarTrackComponent } from './sidebar-track/sidebar-track.component';
import { FolderManagementService } from '../../../../shared/services/api/folder/folder-management.service';
import { LessonMaterialsService } from '../../../../shared/services/api/lesson-materials/lesson-materials.service';

@Component({
  selector: 'sidebar-tracks',
  standalone: true,
  imports: [SidebarTrackComponent],
  templateUrl: './sidebar-tracks.component.html',
  styleUrl: './sidebar-tracks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarTracksComponent {
  private lessonMaterialsService = inject(LessonMaterialsService);

  readonly materialId = input.required<string>();
  readonly currentFolderId = input.required<string>();

  readonly folders = this.lessonMaterialsService.foldersLessonMaterials;
}
