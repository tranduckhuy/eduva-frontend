import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormControlComponent } from '../../form-control/form-control.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'auth-form-register',
  standalone: true,
  imports: [CommonModule, FormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './auth-form-register.component.html',
  styleUrl: './auth-form-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormRegisterComponent {
  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  otp = signal<string>('');

  readonly passwordLevel = computed(() => {
    let level = 0;

    if (this.password().length >= 6) {
      level++;
    }
    if (/[a-z]/.test(this.password())) {
      level++;
    }
    if (/[A-Z]/.test(this.password())) {
      level++;
    }
    if (/\d/.test(this.password())) {
      level++;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.password())) {
      level++;
    }
    if (this.password()) {
      return level;
    } else return;
  });
}
