import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { ButtonOutlineGradientComponent } from '../../../../shared/components/button-outline-gradient/button-outline-gradient.component';

@Component({
  selector: 'comment-list',
  standalone: true,
  imports: [ButtonOutlineGradientComponent],
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
