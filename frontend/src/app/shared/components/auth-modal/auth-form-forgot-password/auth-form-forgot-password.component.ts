import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { customEmailValidator } from '../../../utils/form-validators';

import { PasswordService } from '../../../../core/auth/services/password.service';

import { FormControlComponent } from '../../form-control/form-control.component';
import { ButtonComponent } from '../../button/button.component';

import { type EmailLinkRequest } from '../../../../core/auth/models/request/email-link-request.model';

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
  private readonly passwordService = inject(PasswordService);

  form!: FormGroup;

  readonly openResetPassword = output();

  submitted = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      email: ['', [customEmailValidator]],
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const request: EmailLinkRequest = this.form.value;

    this.passwordService.forgotPassword(request).subscribe();
  }
}
