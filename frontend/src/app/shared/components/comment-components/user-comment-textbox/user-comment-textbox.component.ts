import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RichTextEditorComponent } from '../../rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-user-comment-textbox',
  standalone: true,
  imports: [FormsModule, RichTextEditorComponent],
  templateUrl: './user-comment-textbox.component.html',
  styleUrl: './user-comment-textbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCommentTextboxComponent implements OnInit {
  comment = input.required<string>();
  isReply = input<boolean>(false);
  mention = input<string>('');
  changeData = output<string>();

  commentValue: string = '';

  ngOnInit(): void {
    this.commentValue = this.isReply()
      ? `<p><span class="mention" id="mention" data-mention="@${this.mention()}">@${this.mention()}</span>&nbsp;</p>`
      : this.comment();
  }
}
