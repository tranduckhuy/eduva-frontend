import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { GlobalModalService } from '../../../../../shared/services/layout/global-modal/global-modal.service';
import { LoadingService } from '../../../../../shared/services/core/loading/loading.service';
import { UserService } from '../../../../../shared/services/api/user/user.service';
import { FormControlComponent } from '../../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ClassService } from '../../../../../shared/services/api/class/class.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enroll-class-modal',
  standalone: true,
  imports: [FormControlComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './enroll-class-modal.component.html',
  styleUrl: './enroll-class-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollClassModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly globalModalService = inject(GlobalModalService);
  private readonly loadingService = inject(LoadingService);
  private readonly userService = inject(UserService);
  private readonly classService = inject(ClassService);
  private readonly router = inject(Router);

  readonly isLoading = this.loadingService.isLoading;
  readonly currentUser = this.userService.currentUser;

  submitted = signal<boolean>(false);

  form!: FormGroup;

  constructor() {
    this.form = this.fb.group({
      classCode: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.classService.enrollClass(this.form.value).subscribe({
      next: res => {
        this.router.navigate(['/classes', res?.classId]);
        this.closeModal();
      },
    });
  }

  closeModal() {
    this.globalModalService.close();
  }
}
