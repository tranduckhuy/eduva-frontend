import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { UserService } from '../../../../shared/services/api/user/user.service';
import { LoadingService } from '../../../../shared/services/core/loading/loading.service';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

import { type UpdateProfileRequest } from '../../models/update-profile-request.model';

@Component({
  selector: 'app-update-name-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './update-name-form.component.html',
  styleUrl: './update-name-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateNameFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);

  fullName = input.required<string>();

  nameChanged = output<void>();

  form = this.fb.group({ fullName: [''] });

  isLoading = this.loadingService.isLoading;

  submitted = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.form.patchValue({ fullName: this.fullName() });
    });
  }

  onSubmit() {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const payload: UpdateProfileRequest = {
      fullName: this.form.get('fullName')?.value ?? '',
    };
    this.userService.updateUserProfile(payload).subscribe(user => {
      if (user) {
        this.userService.updateCurrentUserPartial({ fullName: user.fullName });
        this.nameChanged.emit();
      }
    });
  }
}
