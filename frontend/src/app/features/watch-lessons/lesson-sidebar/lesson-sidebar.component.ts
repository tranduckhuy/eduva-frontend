import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { SidebarTracksComponent } from './sidebar-tracks/sidebar-tracks.component';

@Component({
  selector: 'lesson-sidebar',
  standalone: true,
  imports: [SidebarTracksComponent],
  templateUrl: './lesson-sidebar.component.html',
  styleUrl: './lesson-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonSidebarComponent {
  isOpen = input.required<boolean>();
  materialId = input.required<string>();

  openChapterModal = output<void>();

  onOpenChapterModalClick() {
    this.openChapterModal.emit();
  }
}
