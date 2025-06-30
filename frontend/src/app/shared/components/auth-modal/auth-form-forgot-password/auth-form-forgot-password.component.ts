import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';

import { FormControlComponent } from '../../form-control/form-control.component';
import { ButtonComponent } from '../../button/button.component';
import { CommonModule } from '@angular/common';
import { customEmailValidator } from '../../../utils/form-validators';

@Component({
  selector: 'auth-form-forgot-password',
  standalone: true,
  imports: [
    FormControlComponent,
    ButtonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: './auth-form-forgot-password.component.html',
  styleUrl: './auth-form-forgot-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;

  readonly openResetPassword = output();

  submitted = signal<boolean>(false);
  isSentCode = signal<boolean>(false);
  isResentCode = signal<boolean>(false);
  readonly countdown = signal<number>(120);

  private countdownInterval!: ReturnType<typeof setInterval>;

  constructor() {
    this.form = this.fb.group({
      email: ['', [customEmailValidator]],
      code: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });
  }

  onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 6);
    this.form.get('code')?.setValue(input.value, { emitEvent: false });
  }

  sendCode() {
    this.startCountdown();
  }

  private startCountdown(): void {
    this.isSentCode.set(true);
    this.isResentCode.set(true);
    this.countdown.set(10);

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
    this.isResentCode.set(false);
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.openResetPassword.emit();
  }
}
