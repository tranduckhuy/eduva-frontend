import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  effect,
  untracked,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Button } from 'primeng/button';

import { AuthService } from '../../core/auth/services/auth.service';
import { UserService } from '../../shared/services/api/user/user.service';
import { ClassService } from '../../shared/services/api/class/class.service';
import { LoadingService } from '../../shared/services/core/loading/loading.service';

import { EntityStatus } from '../../shared/models/enum/entity-status.enum';
import { EmailAction } from '../../shared/models/enum/email-action.enum';

import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';
import { GlobalModalService } from '../../shared/services/layout/global-modal/global-modal.service';
import { HomeCarouselComponent } from '../../shared/components/home-carousel/home-carousel.component';
import { ClassroomCardComponent } from '../../shared/components/classroom-card/classroom-card.component';
import { GetStudentClassesEnrolledRequest } from '../../shared/models/api/request/query/get-student-classes-enrolled-request.model';
import { ClassCardSkeletonComponent } from '../../shared/components/skeleton/class-card-skeleton/class-card-skeleton.component';
import { EnrollClassModalComponent } from '../../core/layout/header/user-actions/enroll-class-modal/enroll-class-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeCarouselComponent,
    ClassroomCardComponent,
    ClassCardSkeletonComponent,
    RouterLink,
    Button,
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
            this.fetchClassesForUser(user.id, user.school!.id);
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
      const action = params.get('action') as EmailAction | null;

      if (!email || !token || !action) return;

      switch (action) {
        case EmailAction.ResetPassword:
          this.globalModalService.open(AuthModalComponent, {
            screenState: 'reset',
            email,
            token,
          });
          break;

        case EmailAction.ConfirmEmail:
          this.globalModalService.open(AuthModalComponent, {
            screenState: 'login',
            email,
            token,
          });
          break;

        default:
          // ? Handle unknown action
          break;
      }
    });

    if (this.currentUser() && this.isLoggedIn()) {
      const userId = this.currentUser()!.id;
      const schoolId = this.currentUser()!.school?.id;
      if (userId && schoolId) {
        this.fetchClassesForUser(userId, schoolId);
      }
    }
  }

  openEnrollClassModal() {
    this.globalModalService.open(EnrollClassModalComponent);
  }

  private fetchClassesForUser(studentId: string, schoolId: number): void {
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
