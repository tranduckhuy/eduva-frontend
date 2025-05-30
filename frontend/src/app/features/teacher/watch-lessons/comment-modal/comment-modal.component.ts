import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { CommentListComponent } from './comment-list/comment-list.component';

@Component({
  selector: 'comment-modal',
  standalone: true,
  imports: [CommonModule, CommentListComponent],
  templateUrl: './comment-modal.component.html',
  styleUrl: './comment-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentModalComponent {
  isOpen = input.required<boolean>();

  closeCommentModal = output();

  closeModal() {
    this.closeCommentModal.emit();
  }
}
