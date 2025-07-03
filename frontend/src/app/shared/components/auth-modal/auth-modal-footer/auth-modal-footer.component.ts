import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'auth-modal-footer',
  standalone: true,
  imports: [],
  templateUrl: './auth-modal-footer.component.html',
  styleUrl: './auth-modal-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalFooterComponent {
  screenState = input.required<
    'login' | 'forgot-password' | 'reset-password' | 'otp-verification'
  >();
  switchState = output<void>();
}
