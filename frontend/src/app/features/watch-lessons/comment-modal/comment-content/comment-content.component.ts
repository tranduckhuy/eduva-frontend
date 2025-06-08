import { ChangeDetectionStrategy, Component } from '@angular/core';

import { QuestionComponent } from '../../../../shared/components/comment-components/question/question.component';
import { DiscussionComponent } from '../../../../shared/components/comment-components/discussion/discussion.component';

@Component({
  selector: 'comment-content',
  standalone: true,
  imports: [QuestionComponent, DiscussionComponent],
  templateUrl: './comment-content.component.html',
  styleUrl: './comment-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentContentComponent {}
