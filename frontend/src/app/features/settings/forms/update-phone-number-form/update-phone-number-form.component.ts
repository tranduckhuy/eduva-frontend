import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../../../../shared/services/api/user/user.service';
import { LoadingService } from '../../../../shared/services/core/loading/loading.service';

import { VIETNAM_PHONE_REGEX } from '../../../../shared/constants/common.constant';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

import { type UpdateProfileRequest } from '../../models/update-profile-request.model';

@Component({
  selector: 'app-update-phone-number-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './update-phone-number-form.component.html',
  styleUrl: './update-phone-number-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePhoneNumberFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);

  phoneNumber = input.required<string>();

  phoneNumberChanged = output<void>();

  form = this.fb.group({
    phoneNumber: ['', Validators.pattern(VIETNAM_PHONE_REGEX)],
  });

  isLoading = this.loadingService.isLoading;

  submitted = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.form.patchValue({ phoneNumber: this.phoneNumber() });
    });
  }

  onSubmit() {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const payload: UpdateProfileRequest = {
      phoneNumber: this.form.get('phoneNumber')?.value ?? '',
    };
    this.userService.updateUserProfile(payload).subscribe(user => {
      if (user) {
        this.userService.updateCurrentUserPartial({
          phoneNumber: user.phoneNumber,
        });
        this.phoneNumberChanged.emit();
      }
    });
  }
}
