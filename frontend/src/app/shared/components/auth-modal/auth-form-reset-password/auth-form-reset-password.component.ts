import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'auth-form-reset-password',
  standalone: true,
  imports: [],
  templateUrl: './auth-form-reset-password.component.html',
  styleUrl: './auth-form-reset-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormResetPasswordComponent {}
