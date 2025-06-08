import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthModalService } from '../../services/modal/auth-modal/auth-modal.service';

import { AuthModalHeaderComponent } from './auth-modal-header/auth-modal-header.component';
import { AuthModalFooterComponent } from './auth-modal-footer/auth-modal-footer.component';
import { AuthMethodsComponent } from './auth-methods/auth-methods.component';
import { AuthFormLoginComponent } from './auth-form-login/auth-form-login.component';
import { AuthFormRegisterComponent } from './auth-form-register/auth-form-register.component';

type ScreenState = 'methods' | 'login' | 'register';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule,
    AuthModalHeaderComponent,
    AuthModalFooterComponent,
    AuthMethodsComponent,
    AuthFormLoginComponent,
    AuthFormRegisterComponent,
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  private readonly authModalService = inject(AuthModalService);
  isModalOpen = this.authModalService.isOpen;

  isLogin = signal<boolean>(true);
  screenState = signal<ScreenState>('methods');

  closeModal() {
    this.authModalService.close();
  }

  showMethods() {
    this.screenState.set('methods');
  }

  selectSystemLogin() {
    this.screenState.set(this.isLogin() ? 'login' : 'register');
  }

  toggleLoginRegister() {
    this.isLogin.update(v => !v);
    this.showMethods();
  }

  isFormScreen() {
    return this.screenState() === 'login' || this.screenState() === 'register';
  }
}
