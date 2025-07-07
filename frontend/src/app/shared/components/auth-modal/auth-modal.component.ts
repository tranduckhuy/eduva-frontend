import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailVerificationService } from '../../../core/auth/services/email-verification.service';
import { GlobalModalService } from '../../services/layout/global-modal/global-modal.service';

import { MODAL_DATA } from '../../tokens/injection/modal-data.token';

import { AuthModalHeaderComponent } from './auth-modal-header/auth-modal-header.component';
import { AuthModalFooterComponent } from './auth-modal-footer/auth-modal-footer.component';
import { AuthFormLoginComponent } from './auth-form-login/auth-form-login.component';
import { AuthFormForgotPasswordComponent } from './auth-form-forgot-password/auth-form-forgot-password.component';
import { AuthFormResetPasswordComponent } from './auth-form-reset-password/auth-form-reset-password.component';
import { AuthFormOtpVerificationComponent } from './auth-form-otp-verification/auth-form-otp-verification.component';
import { ConfirmEmailRequest } from '../../../core/auth/models/request/confirm-email-request.model';

type ScreenState =
  | 'login'
  | 'forgot-password'
  | 'reset-password'
  | 'otp-verification';

interface AuthModalData {
  screenState: 'login' | 'reset' | 'otp';
  email: string;
  token: string;
}

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule,
    AuthModalHeaderComponent,
    AuthModalFooterComponent,
    AuthFormLoginComponent,
    AuthFormForgotPasswordComponent,
    AuthFormResetPasswordComponent,
    AuthFormOtpVerificationComponent,
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent implements OnInit {
  private readonly emailService = inject(EmailVerificationService);
  private readonly globalModalService = inject(GlobalModalService);
  readonly modalData = inject(MODAL_DATA, {
    optional: true,
  }) as AuthModalData | null;

  screenState = signal<ScreenState>('login');

  isModalOpen = true;

  constructor() {}

  ngOnInit(): void {
    const { email, token, screenState } = this.modalData || {};

    const hasEmail = !!email;
    const hasToken = !!token;

    switch (screenState) {
      case 'login':
        if (hasEmail && hasToken) {
          this.handleConfirmEmail(email, token);
        }
        break;

      case 'reset':
        if (hasEmail && hasToken) {
          this.screenState.set('reset-password');
        }
        break;

      case 'otp':
        if (hasEmail) {
          this.screenState.set('otp-verification');
        }
        break;

      default:
        break;
    }
  }

  closeModal() {
    this.globalModalService.close();
  }

  showLogin() {
    this.screenState.set('login');
  }

  showForgotPasswordForm() {
    this.screenState.set('forgot-password');
  }

  showResetPasswordForm() {
    this.screenState.set('reset-password');
  }

  isFormScreen() {
    return (
      this.screenState() === 'forgot-password' ||
      this.screenState() === 'reset-password' ||
      this.screenState() === 'otp-verification'
    );
  }

  private handleConfirmEmail(email: string, token: string) {
    this.screenState.set('login');

    const request: ConfirmEmailRequest = {
      email,
      token,
    };
    this.emailService.confirmEmail(request).subscribe();
  }
}
