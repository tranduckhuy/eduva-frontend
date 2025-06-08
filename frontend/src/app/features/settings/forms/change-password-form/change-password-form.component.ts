import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ForgetPasswordFormComponent } from '../forget-password-form/forget-password-form.component';
import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-change-password-form',
  standalone: true,
  imports: [
    FormsModule,
    FormControlComponent,
    CommonModule,
    ForgetPasswordFormComponent,
    ButtonComponent,
  ],
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordFormComponent {
  currentPassword = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  isChangingPassword = signal<boolean>(false);

  readonly passwordLevel = computed(() => {
    let level = 0;

    if (this.newPassword().length >= 6) {
      level++;
    }
    if (/[a-z]/.test(this.newPassword())) {
      level++;
    }
    if (/[A-Z]/.test(this.newPassword())) {
      level++;
    }
    if (/\d/.test(this.newPassword())) {
      level++;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword())) {
      level++;
    }
    if (this.newPassword()) {
      return level;
    } else return;
  });

  onSubmit() {}

  openForgotPassword() {
    this.isChangingPassword.set(true);
  }

  closeForgotPassword() {
    this.isChangingPassword.set(false);
  }
}
