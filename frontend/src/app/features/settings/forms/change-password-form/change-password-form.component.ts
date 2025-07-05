import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
  viewChildren,
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
  private readonly formControls = viewChildren(FormControlComponent);

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
  readonly passwordValue = signal<string>('');
  readonly passwordLevel = signal<number | undefined>(undefined);
  readonly passwordStrengthLabel = signal<string>('');

  constructor() {
    this.form = this.fb.group({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      logoutBehavior: 0,
    });

    this.form.get('newPassword')!.valueChanges.subscribe(value => {
      this.passwordValue.set(value ?? '');

      const level = this.calcPasswordLevel(value ?? '');
      this.passwordLevel.set(level);

      if (!level || level < 1) {
        this.passwordStrengthLabel.set('');
      } else if (level === 5) {
        this.passwordStrengthLabel.set('Mật khẩu mạnh');
      } else if (level === 4) {
        this.passwordStrengthLabel.set('Mật khẩu trung bình');
      } else {
        this.passwordStrengthLabel.set('Mật khẩu yếu');
      }
    });
  }

  get passwordMisMatch() {
    return isFormFieldMismatch(this.form);
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
        this.submitted.set(false);
        this.formControls().forEach(fc => fc.resetControl());

        this.passwordValue.set('');
        this.passwordLevel.set(undefined);
        this.passwordStrengthLabel.set('');
      },
    });
  }

  openForgotPassword() {
    this.isForgotPassword.set(true);
  }

  closeForgotPassword() {
    this.isForgotPassword.set(false);
  }

  private calcPasswordLevel(password: string): number | undefined {
    if (!password) return undefined;

    let level = 0;
    if (password.length >= 6) level++;
    if (/[a-z]/.test(password)) level++;
    if (/[A-Z]/.test(password)) level++;
    if (/\d/.test(password)) level++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) level++;
    return level;
  }
}
