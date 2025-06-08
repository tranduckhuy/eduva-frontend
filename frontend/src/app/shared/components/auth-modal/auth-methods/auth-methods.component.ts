import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';

import { MethodButtonComponent } from './method-button/method-button.component';

@Component({
  selector: 'auth-methods',
  standalone: true,
  imports: [MethodButtonComponent],
  templateUrl: './auth-methods.component.html',
  styleUrl: './auth-methods.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthMethodsComponent {
  systemLoginSelected = output<void>();

  methods = signal<{ iconUrl: string; method: string; type: string }[]>([
    {
      iconUrl: './images/icons/system-login.svg',
      method: 'Sử dụng username / email',
      type: 'system',
    },
    {
      iconUrl: './images/icons/gg-login.svg',
      method: 'Đăng nhập với Google',
      type: 'google',
    },
    {
      iconUrl: './images/icons/fb-login.svg',
      method: 'Đăng nhập với Facebook',
      type: 'facebook',
    },
    {
      iconUrl: './images/icons/gh-login.svg',
      method: 'Đăng nhập với Github',
      type: 'github',
    },
  ]);

  handleClick(methodType: string) {
    if (methodType === 'system') {
      this.systemLoginSelected.emit();
    }
  }
}
