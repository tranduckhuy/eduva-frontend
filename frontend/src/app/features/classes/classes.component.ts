import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { ClassService } from '../../shared/services/api/class/class.service';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { EntityStatus } from '../../shared/models/enum/entity-status.enum';
import { GetStudentClassesEnrolledRequest } from '../../shared/models/api/request/query/get-student-classes-enrolled-request.model';
import { UserService } from '../../shared/services/api/user/user.service';
import { ClassCardSkeletonComponent } from '../../shared/components/skeleton/class-card-skeleton/class-card-skeleton.component';
import { ClassroomCardComponent } from '../../shared/components/classroom-card/classroom-card.component';
import { PAGE_SIZE } from '../../shared/constants/common.constant';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    ClassCardSkeletonComponent,
    ClassroomCardComponent,
    PaginatorModule,
  ],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesComponent {
  private readonly classService = inject(ClassService);
  private readonly loadingService = inject(LoadingService);
  private readonly userService = inject(UserService);

  isLoadingGetClasses = this.loadingService.is('get-classes');
  classes = this.classService.classes;
  totalClasses = this.classService.totalClass;
  currentUser = this.userService.currentUser;

  skeletonItems = Array(15).fill(null);

  ngOnInit(): void {
    // Initial fetch if user is already logged in
    if (this.currentUser()) {
      this.fetchClassesForUser(
        this.currentUser()!.id,
        this.currentUser()!.school!.id.toString()
      );
    }
  }

  first = signal<number>(0);

  rows = signal<number>(PAGE_SIZE);

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? PAGE_SIZE);

    this.fetchClassesForUser(
      this.currentUser()!.id,
      this.currentUser()!.school!.id.toString()
    );
  }

  private fetchClassesForUser(studentId: string, schoolId: string): void {
    const getStudentClassesEnrolledRequest: GetStudentClassesEnrolledRequest = {
      classStatus: EntityStatus.Active,
      studentId,
      schoolId: +schoolId,
      sortBy: 'enrolledAt',
      sortDirection: 'desc',
      pageSize: this.rows(),
      pageIndex: Math.floor(this.first() / this.rows()) + 1,
    };

    this.classService
      .getStudentClassesEnrolled(getStudentClassesEnrolledRequest)
      .subscribe();
  }
}
