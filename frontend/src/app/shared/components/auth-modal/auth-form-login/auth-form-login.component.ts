import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FormControlComponent } from '../../form-control/form-control.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'auth-form-login',
  standalone: true,
  imports: [FormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './auth-form-login.component.html',
  styleUrl: './auth-form-login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormLoginComponent {
  username = signal<string>('');
  password = signal<string>('');
}
