import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'comment-list',
  standalone: true,
  imports: [],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent {
  viewComment = output<number | string>();
  newQuestion = output<void>();

  onSelectComment(id: number | string) {
    this.viewComment.emit(id);
  }

  onClickNewQuestion() {
    this.newQuestion.emit();
  }
}
