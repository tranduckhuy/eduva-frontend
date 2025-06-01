import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentContentComponent } from './comment-content/comment-content.component';
import { NewQuestionComponent } from './new-question/new-question.component';

@Component({
  selector: 'comment-modal',
  standalone: true,
  imports: [
    CommonModule,
    CommentListComponent,
    CommentContentComponent,
    NewQuestionComponent,
  ],
  templateUrl: './comment-modal.component.html',
  styleUrl: './comment-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentModalComponent {
  isOpen = input.required<boolean>();

  closeCommentModal = output();

  currentState = signal<'list' | 'loading' | 'content' | 'question'>('list');

  handleViewComment(id: number | string) {
    this.currentState.set('loading');
    setTimeout(() => this.currentState.set('content'), 600);
  }

  handleAddNewQuestion() {
    this.currentState.set('loading');
    setTimeout(() => this.currentState.set('question'), 600);
  }

  handleGoBack() {
    this.currentState.set('loading');
    setTimeout(() => this.currentState.set('list'), 600);
  }

  closeModal() {
    this.closeCommentModal.emit();
  }
}
