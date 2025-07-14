import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-view-lesson-skeleton',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './view-lesson-skeleton.component.html',
  styleUrl: './view-lesson-skeleton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewLessonSkeletonComponent {}
