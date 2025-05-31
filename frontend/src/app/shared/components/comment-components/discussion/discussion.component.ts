import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { UserCommentTextboxComponent } from '../user-comment-textbox/user-comment-textbox.component';
import { CommentContextComponent } from './comment-context/comment-context.component';

@Component({
  selector: 'comment-discussion',
  standalone: true,
  imports: [UserCommentTextboxComponent, CommentContextComponent],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscussionComponent {
  comment = signal<string>('');
  bestCommentIndex = signal<number | null>(null);

  getData(value: string) {
    this.comment.set(value);
    console.log(this.comment());
  }

  setBestComment(index: number) {
    this.bestCommentIndex.set(index);
  }

  clearBestComment() {
    this.bestCommentIndex.set(null);
  }

  isBestComment(index: number) {
    return this.bestCommentIndex() === index;
  }

  canMarkBestComment(index: number) {
    const currentBest = this.bestCommentIndex();
    return currentBest === null || currentBest === index;
  }
}
