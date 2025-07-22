import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SidebarTracksComponent } from './sidebar-tracks/sidebar-tracks.component';
import { FormsModule } from '@angular/forms';
import { debounceSignal } from '../../../shared/utils/util-functions';
import { GetAllFoldersMaterialsResponse } from '../../../shared/models/api/response/query/get-all-folders-materials-response.model';

@Component({
  selector: 'lesson-sidebar',
  standalone: true,
  imports: [SidebarTracksComponent, FormsModule],
  templateUrl: './lesson-sidebar.component.html',
  styleUrl: './lesson-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonSidebarComponent {
  filteredFoldersAndMaterials =
    input.required<GetAllFoldersMaterialsResponse[]>();
  isOpen = input.required<boolean>();
  materialId = input.required<string>();
  folderId = input.required<string>();

  openChapterModal = output<void>();
  search = output<string>();

  private readonly destroyRef = inject(DestroyRef);

  private readonly destroyDebounce: () => void;

  searchTerm = signal<string>('');

  constructor() {
    this.destroyDebounce = debounceSignal(
      this.searchTerm,
      value => {
        this.search.emit(value);
      },
      300
    );

    this.destroyRef.onDestroy(() => this.destroyDebounce());
  }

  onOpenChapterModalClick() {
    this.openChapterModal.emit();
  }
}
