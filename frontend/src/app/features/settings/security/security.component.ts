import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserService } from '../../../shared/services/api/user/user.service';

import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { DialogComponent } from '../dialog/dialog.component';
import { ChangePasswordFormComponent } from '../forms/change-password-form/change-password-form.component';
import { ActivateOtpVerifyFormComponent } from '../forms/activate-otp-verify-form/activate-otp-verify-form.component';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    RouterLink,
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
  private readonly userService = inject(UserService);

  user = this.userService.currentUser;

  openedDialog = signal<string | null>(null);

  openDialog(type: string) {
    this.openedDialog.set(type);
  }

  closeDialog() {
    this.openedDialog.set(null);
  }
}
