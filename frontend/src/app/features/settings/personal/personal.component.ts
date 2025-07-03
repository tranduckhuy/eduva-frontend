import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { DialogComponent } from '../dialog/dialog.component';
import { UpdateNameFormComponent } from '../forms/update-name-form/update-name-form.component';
import { UpdateAvatarFormComponent } from '../forms/update-avatar-form/update-avatar-form.component';
import { UpdatePhoneNumberFormComponent } from '../forms/update-phone-number-form/update-phone-number-form.component';

import { UserService } from '../../../shared/services/api/user/user.service';
import { UpdateProfileRequest } from '../models/update-profile-request.model';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [
    RouterLink,
    ProfileCardComponent,
    DialogComponent,
    UpdateAvatarFormComponent,
    UpdatePhoneNumberFormComponent,
    UpdateNameFormComponent,
  ],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalComponent {
  private readonly userService = inject(UserService);

  user = this.userService.currentUser;

  openedDialog = signal<string | null>(null);

  openDialog(type: string) {
    this.openedDialog.set(type);
  }

  closeDialog() {
    this.openedDialog.set(null);
  }

  onAvatarChange(avatarUrl: string) {
    const payload: UpdateProfileRequest = {
      avatarUrl,
    };

    this.userService.updateUserProfile(payload).subscribe(user => {
      if (user) {
        this.userService.updateCurrentUserPartial({
          avatarUrl: user.avatarUrl,
        });
        this.closeDialog();
      }
    });
  }
}
