import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'comment-list',
  standalone: true,
  imports: [],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent {}
