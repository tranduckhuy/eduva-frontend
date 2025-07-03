import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-class-detail-folder-skeleton',
  standalone: true,
  imports: [Skeleton],
  templateUrl: './class-detail-folder-skeleton.component.html',
  styleUrl: './class-detail-folder-skeleton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassDetailFolderSkeletonComponent {}
