import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalModalService } from '../../services/layout/global-modal/global-modal.service';

import { MODAL_DATA } from '../../tokens/injection/modal-data.token';

import { AuthModalHeaderComponent } from './auth-modal-header/auth-modal-header.component';
import { AuthModalFooterComponent } from './auth-modal-footer/auth-modal-footer.component';
import { AuthFormLoginComponent } from './auth-form-login/auth-form-login.component';
import { AuthFormForgotPasswordComponent } from './auth-form-forgot-password/auth-form-forgot-password.component';
import { AuthFormResetPasswordComponent } from './auth-form-reset-password/auth-form-reset-password.component';
import { AuthFormOtpVerificationComponent } from './auth-form-otp-verification/auth-form-otp-verification.component';

type ScreenState =
  | 'login'
  | 'forgot-password'
  | 'reset-password'
  | 'otp-verification';

interface AuthModalData {
  screenState: 'reset' | 'otp';
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
  private readonly globalModalService = inject(GlobalModalService);
  readonly modalData = inject(MODAL_DATA, {
    optional: true,
  }) as AuthModalData | null;

  screenState = signal<ScreenState>('login');

  isModalOpen = true;

  constructor() {}

  ngOnInit(): void {
    if (
      this.modalData?.email &&
      this.modalData?.token &&
      this.modalData?.screenState === 'reset'
    ) {
      this.screenState.set('reset-password');
    }

    if (this.modalData?.screenState === 'otp' && this.modalData?.email) {
      this.screenState.set('otp-verification');
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
}
