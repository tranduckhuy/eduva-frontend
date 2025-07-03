import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  effect,
  untracked,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';
import { UserService } from '../../shared/services/api/user/user.service';
import { EntityStatus } from '../../shared/models/enum/entity-status.enum';
import { ClassService } from '../../shared/services/api/class/class.service';
import { LoadingService } from '../../shared/services/core/loading/loading.service';
import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';
import { HomeCarouselComponent } from '../../shared/components/home-carousel/home-carousel.component';
import { ClassroomCardComponent } from '../../shared/components/classroom-card/classroom-card.component';
import { GetStudentClassesEnrolledRequest } from '../../shared/models/api/request/query/get-student-classes-enrolled-request.model';
import { ClassCardSkeletonComponent } from '../../shared/components/skeleton/class-card-skeleton/class-card-skeleton.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeCarouselComponent,
    ClassroomCardComponent,
    ClassCardSkeletonComponent,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly globalModalService = inject(GlobalModalService);
  private readonly classService = inject(ClassService);
  private readonly loadingService = inject(LoadingService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  // Signals from service
  isLoadingGetClasses = this.loadingService.is('get-classes');
  currentUser = this.userService.currentUser;
  classes = this.classService.classes;
  isLoggedIn = this.authService.isLoggedIn;

  skeletonItems = Array(7).fill(null);

  constructor() {
    // React to authentication state changes
    effect(
      () => {
        const isLoggedIn = this.isLoggedIn();
        const user = untracked(() => this.currentUser());

        if (isLoggedIn && user) {
          untracked(() => {
            this.fetchClassesForUser(user.id, user.school!.id.toString());
          });
        } else {
          untracked(() => this.classService.clearClasses());
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      const email = params.get('email');
      const token = params.get('token');

      if (email && token) {
        this.globalModalService.open(AuthModalComponent, {
          screenState: 'reset',
          email,
          token,
        });
      }
    });

    // Initial fetch if user is already logged in
    if (this.currentUser()) {
      this.fetchClassesForUser(
        this.currentUser()!.id,
        this.currentUser()!.school!.id.toString()
      );
    }
  }

  private fetchClassesForUser(studentId: string, schoolId: string): void {
    const getStudentClassesEnrolledRequest: GetStudentClassesEnrolledRequest = {
      classStatus: EntityStatus.Active,
      studentId,
      schoolId: +schoolId,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    };

    this.classService
      .getStudentClassesEnrolled(getStudentClassesEnrolledRequest)
      .subscribe();
  }
}
