import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';

import { UserService } from '../../../services/api/user/user.service';
import { LoadingService } from '../../../services/core/loading/loading.service';
import { CommentService } from '../../../../features/watch-lessons/comment-modal/services/comment.service';

import { RichTextEditorComponent } from '../../rich-text-editor/rich-text-editor.component';
import { CreateCommentRequest } from '../../../../features/watch-lessons/comment-modal/model/request/command/create-comment-request.model';

@Component({
  selector: 'app-user-comment-textbox',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, RichTextEditorComponent],
  templateUrl: './user-comment-textbox.component.html',
  styleUrl: './user-comment-textbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCommentTextboxComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly commentService = inject(CommentService);
  private readonly loadingService = inject(LoadingService);

  questionId = input<string>();
  parentCommentId = input<string>();
  mention = input<string | null>(null);
  isReply = input<boolean>(false);

  createCommentSuccess = output<string>();
  cancelReply = output<void>();

  form: FormGroup;

  user = this.userService.currentUser;
  isLoading = this.loadingService.is('create-comment');

  commentValue = signal<string>('');
  invalid = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      content: [this.mentionValue, Validators.required],
    });
  }

  ngOnInit(): void {
    this.commentValue.set(this.mentionValue);
  }

  get content() {
    return this.form.get('content');
  }

  get mentionValue() {
    return this.isReply() && this.mention()
      ? `<p><span class="mention" id="mention" data-mention="@${this.mention()}">@${this.mention()}</span>&nbsp;</p>`
      : '';
  }

  onSubmit() {
    this.form.markAllAsTouched();

    const questionId = this.questionId();
    const content = this.content?.value;

    if (!questionId) return;

    if (this.form.invalid || !content) {
      this.invalid.set(true);
      return;
    }

    let request: CreateCommentRequest = {
      questionId,
      content,
    };

    if (this.isReply())
      request = { ...request, parentCommentId: this.parentCommentId() };

    this.commentService.createComment(request).subscribe({
      next: () => {
        this.resetForm();
        this.createCommentSuccess.emit(questionId);
        this.cancelReply.emit();
      },
    });
  }

  getContent(content: string) {
    this.form.get('content')?.patchValue(content);
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) return 'Trường này không được để trống';
    return '';
  }

  resetForm() {
    this.commentValue.set('');
    this.form.reset();
    this.form.updateValueAndValidity();
  }
}
