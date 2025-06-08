import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputOtp } from 'primeng/inputotp';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-activate-otp-verify-form',
  standalone: true,
  imports: [FormsModule, InputOtp, FormControlComponent, ButtonComponent],
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
