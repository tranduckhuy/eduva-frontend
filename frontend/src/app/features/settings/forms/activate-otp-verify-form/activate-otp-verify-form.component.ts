import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { InputOtp } from 'primeng/inputotp';

import { TwoFactorService } from '../../../../core/auth/services/two-factor.service';
import { LoadingService } from '../../../../shared/services/core/loading/loading.service';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ForgetPasswordFormComponent } from '../forget-password-form/forget-password-form.component';
import {
  ConfirmEnableDisable2FA,
  RequestEnableDisable2FA,
} from '../../models/toggle-2fa-request.model';

@Component({
  selector: 'app-activate-otp-verify-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputOtp,
    FormControlComponent,
    ButtonComponent,
    ForgetPasswordFormComponent,
  ],
  templateUrl: './activate-otp-verify-form.component.html',
  styleUrl: './activate-otp-verify-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateOtpVerifyFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly twoFactorService = inject(TwoFactorService);
  private readonly loadingService = inject(LoadingService);

  enabled = input.required<boolean>();

  twoFactorChanged = output<void>();

  form: FormGroup;

  isLoading = this.loadingService.isLoading;

  isPasswordValid = signal(false);
  isForgotPassword = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      otpCode: '',
    });
  }

  onSubmit() {
    const { currentPassword, otpCode } = this.form.value;

    if (!this.isPasswordValid()) {
      if (!currentPassword) return;

      const request: RequestEnableDisable2FA = {
        currentPassword,
      };
      this.twoFactorService
        .requestEnableDisable2FA(request, this.enabled())
        .subscribe({
          next: () => this.isPasswordValid.set(true),
          error: () => this.form.reset(),
        });
    } else {
      if (!otpCode) return;

      const request: ConfirmEnableDisable2FA = {
        otpCode,
      };
      this.twoFactorService
        .confirmEnableDisable2FA(request, this.enabled())
        .subscribe({
          next: () => this.twoFactorChanged.emit(),
          error: () => this.form.reset(),
        });
    }
  }

  openForgotPassword() {
    this.isForgotPassword.set(true);
  }

  closeForgotPassword() {
    this.isForgotPassword.set(false);
  }
}
