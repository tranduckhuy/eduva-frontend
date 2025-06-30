import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  strongPasswordValidator,
  matchPasswordValidator,
} from '../../../../shared/utils/form-validators';

import { PasswordService } from '../../../../core/auth/services/password.service';

import { FormControlComponent } from '../../form-control/form-control.component';
import { ButtonComponent } from '../../button/button.component';

import { type ResetPasswordRequest } from '../../../../core/auth/models/request/reset-password-request.model';

@Component({
  selector: 'auth-form-reset-password',
  standalone: true,
  imports: [
    FormControlComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './auth-form-reset-password.component.html',
  styleUrl: './auth-form-reset-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly passwordService = inject(PasswordService);

  email = input.required<string>();
  token = input.required<string>();

  passwordChanged = output<void>();

  form!: FormGroup;

  submitted = signal<boolean>(false);
  passwordLevel = signal<number | undefined>(undefined);

  constructor() {
    this.form = this.fb.group({
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: [
        '',
        [
          Validators.required,
          (control: any) =>
            matchPasswordValidator(control, this.form?.get('password')?.value),
        ],
      ],
    });

    this.form.get('password')!.valueChanges.subscribe((password: string) => {
      this.passwordLevel.set(this.calcPasswordLevel(password));
    });
  }

  get newPassword(): string {
    return this.form.get('password')?.value ?? '';
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

  onSubmit() {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const request: ResetPasswordRequest = {
      email: this.email(),
      token: this.token(),
      ...this.form.value,
    };
    this.passwordService
      .resetPassword(request)
      .subscribe(() => this.passwordChanged.emit());
  }
}
