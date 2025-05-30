import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { DialogComponent } from '../dialog/dialog.component';
import { UpdateNameFormComponent } from '../forms/update-name-form/update-name-form.component';
import { UpdateUsernameFormComponent } from '../forms/update-username-form/update-username-form.component';
import { UpdateBioFormComponent } from '../forms/update-bio-form/update-bio-form.component';
import { UpdateAvatarFormComponent } from '../forms/update-avatar-form/update-avatar-form.component';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [
    ProfileCardComponent,
    DialogComponent,
    UpdateNameFormComponent,
    UpdateUsernameFormComponent,
    UpdateBioFormComponent,
    UpdateAvatarFormComponent,
  ],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalComponent {
  openedDialog = signal<string | null>(null);

  openDialog(type: string) {
    this.openedDialog.set(type);
  }

  closeDialog() {
    this.openedDialog.set(null);
  }
}
