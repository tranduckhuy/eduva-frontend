import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { DialogComponent } from '../dialog/dialog.component';
import { ChangePasswordFormComponent } from '../forms/change-password-form/change-password-form.component';
import { ActivateOtpVerifyFormComponent } from '../forms/activate-otp-verify-form/activate-otp-verify-form.component';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    ProfileCardComponent,
    DialogComponent,
    ChangePasswordFormComponent,
    ActivateOtpVerifyFormComponent,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityComponent {
  openedDialog = signal<string | null>(null);

  openDialog(type: string) {
    this.openedDialog.set(type);
  }

  closeDialog() {
    this.openedDialog.set(null);
  }
}
