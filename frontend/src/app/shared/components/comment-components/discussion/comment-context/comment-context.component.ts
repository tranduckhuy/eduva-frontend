import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SubmenuDirective } from '../../../../directives/submenu/submenu.directive';
import { SafeHtmlPipe } from '../../../../pipes/safe-html.pipe';

import { UserService } from '../../../../services/api/user/user.service';

import { UserCommentTextboxComponent } from '../../user-comment-textbox/user-comment-textbox.component';

import {
  type Comment,
  type Reply,
} from '../../../../models/entities/comment.model';

@Component({
  selector: 'comment-context',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    SubmenuDirective,
    SafeHtmlPipe,
    UserCommentTextboxComponent,
  ],
  templateUrl: './comment-context.component.html',
  styleUrl: './comment-context.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentContextComponent {
  private readonly userService = inject(UserService);

  isReplyMode = input.required<boolean>();
  isBestComment = input<boolean>(false);
  comment = input<Comment | null>(null);
  reply = input<Reply | null>(null);

  createCommentSuccess = output<string>();

  user = this.userService.currentUser;

  isReplyTextboxOpen = signal<boolean>(false);
  isOptionsOpen = signal<boolean>(false);

  readonly questionId = computed(() => this.comment()?.questionId);

  readonly parentCommentId = computed(() =>
    this.isReplyMode() ? this.reply()?.id : this.comment()?.id
  );

  canShowFooterOptions = computed(() => {
    const creatorId = !this.isReplyMode()
      ? this.comment()?.createdByUserId
      : this.reply()?.createdByUserId;
    const canUpdate = !this.isReplyMode()
      ? this.comment()?.canUpdate
      : this.reply()?.canUpdate;
    const canDelete = !this.isReplyMode()
      ? this.comment()?.canDelete
      : this.reply()?.canDelete;

    return creatorId && (canUpdate || canDelete);
  });

  mentionName = computed(() => {
    if (!this.user()) return null;

    const userId = this.user()?.id;

    if (this.isReplyMode()) {
      const reply = this.reply();
      return reply && reply.createdByUserId !== userId
        ? reply.createdByName
        : null;
    } else {
      const comment = this.comment();
      return comment && comment.createdByUserId !== userId
        ? comment.createdByName
        : null;
    }
  });

  readonly modifiedLabel = computed(() => {
    const isReply = this.isReplyMode();

    const modifiedAt = isReply
      ? this.reply()?.lastModifiedAt
      : this.comment()?.lastModifiedAt;

    return modifiedAt ? 'Đã chỉnh sửa' : '';
  });

  toggleReplyTextbox() {
    this.isReplyTextboxOpen.set(!this.isReplyTextboxOpen());
  }

  toggleFooterOptions() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  closeFooterOptions() {
    this.isOptionsOpen.set(false);
  }
}
