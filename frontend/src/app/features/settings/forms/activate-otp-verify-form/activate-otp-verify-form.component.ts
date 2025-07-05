import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputOtp } from 'primeng/inputotp';

import { UserService } from '../../../../shared/services/api/user/user.service';
import { TwoFactorService } from '../../../../core/auth/services/two-factor.service';
import { LoadingService } from '../../../../shared/services/core/loading/loading.service';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ForgetPasswordFormComponent } from '../forget-password-form/forget-password-form.component';

import {
  type ConfirmEnableDisable2FA,
  type RequestEnableDisable2FA,
} from '../../models/toggle-2fa-request.model';
import {
  type ResendOtpRequest,
  ResendOtpPurpose,
} from '../../../../core/auth/models/request/resend-otp-request.model';

@Component({
  selector: 'app-activate-otp-verify-form',
  standalone: true,
  imports: [
    CommonModule,
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
export class ActivateOtpVerifyFormComponent implements OnInit {
  readonly formControls = viewChildren(FormControlComponent);

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  private readonly twoFactorService = inject(TwoFactorService);
  private readonly loadingService = inject(LoadingService);

  enabled = input.required<boolean>();

  twoFactorChanged = output<void>();

  form: FormGroup;

  user = this.userService.currentUser;
  isLoading = this.loadingService.isLoading;

  isPasswordValid = signal(false);
  isForgotPassword = signal<boolean>(false);
  submitted = signal<boolean>(false);
  readonly countdown = signal<number>(120);
  readonly isResendDisabled = signal<boolean>(true);

  private countdownInterval!: ReturnType<typeof setInterval>;

  constructor() {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      otpCode: [''],
    });
  }

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => this.stopCountdown());
  }

  get otpControl() {
    return this.form.get('otpCode');
  }

  get isOtpCodeInvalid() {
    const c = this.form.get('otpCode');
    return !!(c?.invalid && (c.touched || c.dirty || this.submitted()));
  }

  get resendLinkText() {
    return this.isResendDisabled()
      ? `Gửi lại mã (${this.countdown()}s)`
      : 'Gửi lại mã';
  }

  onSubmit() {
    this.submitted.set(true);

    if (this.form.invalid) return;

    const { currentPassword, otpCode } = this.form.value;

    if (!this.isPasswordValid()) {
      if (!currentPassword) return;

      const request: RequestEnableDisable2FA = {
        currentPassword,
      };
      this.twoFactorService
        .requestEnableDisable2FA(request, this.enabled())
        .subscribe({
          next: () => {
            this.isPasswordValid.set(true);
            this.submitted.set(false);

            this.otpControl?.setValidators([
              Validators.required,
              Validators.minLength(6),
            ]);
            this.otpControl?.updateValueAndValidity();

            this.startCountdown();
          },
          error: () => {
            this.submitted.set(false);
            this.formControls().forEach(fc => {
              fc.resetControl();
              fc.control.updateValueAndValidity();
            });
          },
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
          error: () => {
            this.submitted.set(false);
            this.form.reset();
          },
        });
    }
  }

  onResendCode() {
    const user = this.user();

    if (this.isResendDisabled() || !user?.email) return;

    const request: ResendOtpRequest = {
      email: user.email,
      purpose: this.enabled()
        ? ResendOtpPurpose.Disable2Fa
        : ResendOtpPurpose.Enable2FA,
    };
    this.twoFactorService
      .resendOtp(request)
      .subscribe(() => this.startCountdown());
  }

  openForgotPassword() {
    this.isForgotPassword.set(true);
  }

  closeForgotPassword() {
    this.isForgotPassword.set(false);
  }

  private startCountdown(): void {
    this.isResendDisabled.set(true);
    this.countdown.set(120);

    this.countdownInterval = setInterval(() => {
      const current = this.countdown();
      if (current <= 1) {
        this.stopCountdown();
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  private stopCountdown(): void {
    clearInterval(this.countdownInterval);
    this.isResendDisabled.set(false);
  }
}
