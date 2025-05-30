import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chapter-list',
  standalone: true,
  imports: [],
  templateUrl: './chapter-list.component.html',
  styleUrl: './chapter-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterListComponent {}
