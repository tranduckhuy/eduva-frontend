import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-class-card-skeleton',
  standalone: true,
  imports: [Skeleton],
  templateUrl: './class-card-skeleton.component.html',
  styleUrl: './class-card-skeleton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassCardSkeletonComponent {}
