import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalModalService } from '../../services/global-modal/global-modal.service';

import { AuthModalHeaderComponent } from './auth-modal-header/auth-modal-header.component';
import { AuthModalFooterComponent } from './auth-modal-footer/auth-modal-footer.component';
import { AuthFormLoginComponent } from './auth-form-login/auth-form-login.component';
import { AuthFormForgotPasswordComponent } from './auth-form-forgot-password/auth-form-forgot-password.component';
import { AuthFormResetPasswordComponent } from './auth-form-reset-password/auth-form-reset-password.component';

type ScreenState = 'login' | 'forgot-password' | 'reset-password';

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
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  private readonly globalModalService = inject(GlobalModalService);
  isModalOpen = true;

  isLogin = signal<boolean>(true);
  screenState = signal<ScreenState>('login');

  closeModal() {
    this.globalModalService.close();
  }

  showLogin() {
    this.isLogin.set(true);
    this.screenState.set('login');
  }

  showForgotPasswordForm() {
    this.isLogin.set(false);
    this.screenState.set('forgot-password');
  }

  isFormScreen() {
    return this.screenState() === 'forgot-password';
  }
}
