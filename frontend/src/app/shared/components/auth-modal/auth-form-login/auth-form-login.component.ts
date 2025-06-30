import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/auth/services/auth.service';

import { FormControlComponent } from '../../form-control/form-control.component';
import { ButtonComponent } from '../../button/button.component';

import { type LoginRequest } from '../../../../core/auth/models/request/login-request.model';

@Component({
  selector: 'auth-form-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './auth-form-login.component.html',
  styleUrl: './auth-form-login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  form!: FormGroup;

  submitted = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const request: LoginRequest = this.form.value;

    this.authService.login(request).subscribe();
  }
}
