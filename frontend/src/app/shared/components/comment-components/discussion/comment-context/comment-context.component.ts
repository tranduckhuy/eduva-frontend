import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

import { SubmenuDirective } from '../../../../directives/submenu/submenu.directive';

import { UserCommentTextboxComponent } from '../../user-comment-textbox/user-comment-textbox.component';

@Component({
  selector: 'comment-context',
  standalone: true,
  imports: [SubmenuDirective, UserCommentTextboxComponent],
  templateUrl: './comment-context.component.html',
  styleUrl: './comment-context.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentContextComponent {
  index = input<number>(0);
  isReplyMode = input<boolean>(false);
  isBestComment = input<boolean>(false);
  canMarkAsBest = input<boolean>(true);

  markAsBest = output<void>();
  unMarkAsBest = output<void>();

  replyComment = signal<string>('');
  isReplyTextboxOpen = signal<boolean>(false);
  isOptionsOpen = signal<boolean>(false);

  onMarkAsBest() {
    this.markAsBest.emit();
  }

  onUnMarkAsBest() {
    this.unMarkAsBest.emit();
  }

  toggleReplyTextbox() {
    this.isReplyTextboxOpen.set(!this.isReplyTextboxOpen());
  }

  toggleFooterOptions() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  closeFooterOptions() {
    this.isOptionsOpen.set(false);
  }

  getData(value: string) {
    this.replyComment.set(value);
    console.log(this.replyComment());
  }
}
