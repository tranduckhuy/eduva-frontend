import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormControlComponent } from '../../../../components/form-control/form-control.component';
import { FormsModule } from '@angular/forms';
import { InputOtp } from 'primeng/inputotp';

@Component({
  selector: 'app-activate-otp-verify-form',
  standalone: true,
  imports: [FormControlComponent, FormsModule, InputOtp],
  templateUrl: './activate-otp-verify-form.component.html',
  styleUrl: './activate-otp-verify-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateOtpVerifyFormComponent {
  email = signal('');
  isEmailValid = signal(false);
  otp = signal<number | null>(null);

  onSubmit() {
    this.isEmailValid.set(true);
    if (this.isEmailValid()) {
      // Handle form submission logic here
      console.log('Form submitted with email:', this.email());
    } else {
      console.error('Invalid email address');
    }
  }
}
