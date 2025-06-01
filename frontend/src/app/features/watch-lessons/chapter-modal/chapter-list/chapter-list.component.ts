import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'chapter-list',
  standalone: true,
  imports: [TooltipModule],
  templateUrl: './chapter-list.component.html',
  styleUrl: './chapter-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterListComponent {}
