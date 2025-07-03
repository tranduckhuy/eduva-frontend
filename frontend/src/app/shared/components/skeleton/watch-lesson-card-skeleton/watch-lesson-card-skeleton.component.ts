import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-watch-lesson-card-skeleton',
  standalone: true,
  imports: [Skeleton],
  templateUrl: './watch-lesson-card-skeleton.component.html',
  styleUrl: './watch-lesson-card-skeleton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchLessonCardSkeletonComponent {}
