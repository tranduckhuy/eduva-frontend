import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { SidebarTrackComponent } from './sidebar-track/sidebar-track.component';
import { LessonMaterialsService } from '../../../../shared/services/api/lesson-materials/lesson-materials.service';
import { GetAllFoldersMaterialsResponse } from '../../../../shared/models/api/response/query/get-all-folders-materials-response.model';

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
  readonly filteredFoldersAndMaterials =
    input.required<GetAllFoldersMaterialsResponse[]>();

  readonly folders = this.lessonMaterialsService.foldersLessonMaterials;

  getFolderIndex = (folderId: string): number => {
    return this.folders().findIndex(folder => folder.id === folderId);
  };
}
