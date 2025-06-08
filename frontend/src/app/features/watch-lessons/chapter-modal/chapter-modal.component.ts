import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChapterListComponent } from './chapter-list/chapter-list.component';

@Component({
  selector: 'chapter-modal',
  standalone: true,
  imports: [CommonModule, ChapterListComponent],
  templateUrl: './chapter-modal.component.html',
  styleUrl: './chapter-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterModalComponent {
  isOpen = input.required<boolean>();

  closeChapterModal = output<void>();

  closeModal() {
    this.closeChapterModal.emit();
  }
}
