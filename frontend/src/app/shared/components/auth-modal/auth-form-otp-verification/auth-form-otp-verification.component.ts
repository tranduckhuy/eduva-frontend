import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';

import { LoadingService } from '../../../services/core/loading/loading.service';
import { TwoFactorService } from '../../../../core/auth/services/two-factor.service';

import { FormControlComponent } from '../../form-control/form-control.component';
import { ButtonComponent } from '../../button/button.component';

import { type VerifyOtpRequest } from '../../../../core/auth/models/request/verify-otp-request.model';
import {
  ResendOtpPurpose,
  ResendOtpRequest,
} from '../../../../core/auth/models/request/resend-otp-request.model';

@Component({
  selector: 'auth-form-otp-verification',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FormControlComponent,
    ButtonComponent,
  ],
  templateUrl: './auth-form-otp-verification.component.html',
  styleUrl: './auth-form-otp-verification.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormOtpVerificationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loadingService = inject(LoadingService);
  private readonly twoFactorService = inject(TwoFactorService);

  email = input.required<string>();

  form = this.fb.group({
    otpCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
  });

  isLoadingVerify = this.loadingService.is('otp-verification');
  isLoadingResend = this.loadingService.is('resend-otp');

  submitted = signal<boolean>(false);
  isSentCode = signal<boolean>(false);
  readonly countdown = signal<number>(120);

  private countdownInterval!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.isSentCode.set(true);

    this.startCountdown();

    this.destroyRef.onDestroy(() => {
      clearInterval(this.countdownInterval);
    });
  }

  onSubmit() {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    const otpCode = this.form.get('otpCode')?.value;

    if (this.form.invalid || !otpCode) return;

    const request: VerifyOtpRequest = {
      otpCode: otpCode,
      email: this.email(),
    };
    this.twoFactorService.verifyTwoFactor(request).subscribe();
  }

  onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 6);
    this.form.get('otpCode')?.setValue(input.value, { emitEvent: false });
  }

  onResendCode() {
    const request: ResendOtpRequest = {
      email: this.email(),
      purpose: ResendOtpPurpose.Login,
    };
    this.twoFactorService.resendOtp(request).subscribe(() => {
      this.isSentCode.set(true);

      this.startCountdown();
    });
  }

  private startCountdown(): void {
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
    this.isSentCode.set(false);
  }
}
