import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { LoadingService } from '../../../../shared/services/core/loading/loading.service';
import { UserService } from '../../../../shared/services/api/user/user.service';
import { PasswordService } from '../../../../core/auth/services/password.service';

import { isFormFieldMismatch } from '../../../../shared/utils/util-functions';

import { ForgetPasswordFormComponent } from '../forget-password-form/forget-password-form.component';
import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ChangePasswordRequest } from '../../../../shared/models/api/request/command/change-password-request.model';

@Component({
  selector: 'app-change-password-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormControlComponent,
    ForgetPasswordFormComponent,
    ButtonComponent,
  ],
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly userService = inject(UserService);
  private readonly passwordService = inject(PasswordService);

  passwordChanged = output<void>();

  form: FormGroup;

  isLoading = this.loadingService.is('change-password-form');
  readonly user = this.userService.currentUser;

  submitted = signal<boolean>(false);
  isForgotPassword = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      logoutBehavior: 0,
    });
  }

  get passwordMisMatch() {
    return isFormFieldMismatch(this.form);
  }

  get passwordLevel(): number | undefined {
    const value = this.form.get('newPassword')?.value ?? '';
    let level = 0;

    if (value.length >= 6) level++;
    if (/[a-z]/.test(value)) level++;
    if (/[A-Z]/.test(value)) level++;
    if (/\d/.test(value)) level++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) level++;

    return level;
  }

  onSubmit() {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const request: ChangePasswordRequest = this.form.value;
    this.passwordService.changePassword(request).subscribe({
      next: () => {
        this.isForgotPassword.set(false);
        this.passwordChanged.emit();
      },
      error: () => {
        this.form.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          logoutBehavior: 0,
        });
        this.form.markAsUntouched();
        this.submitted.set(false);
      },
    });
  }

  openForgotPassword() {
    this.isForgotPassword.set(true);
  }

  closeForgotPassword() {
    this.isForgotPassword.set(false);
  }
}
