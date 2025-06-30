import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormControlComponent } from '../../form-control/form-control.component';
import { ButtonComponent } from '../../button/button.component';
import { CommonModule } from '@angular/common';
import {
  strongPasswordValidator,
  matchPasswordValidator,
} from '../../../../shared/utils/form-validators';

@Component({
  selector: 'auth-form-reset-password',
  standalone: true,
  imports: [
    FormControlComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './auth-form-reset-password.component.html',
  styleUrl: './auth-form-reset-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class nAuthFormResetPasswordComponent {
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;

  submitted = signal<boolean>(false);

  passwordLevel = signal<number | undefined>(undefined);

  constructor() {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: [
        '',
        [
          Validators.required,
          (control: any) =>
            matchPasswordValidator(
              control,
              this.form?.get('newPassword')?.value
            ),
        ],
      ],
    });

    this.form.get('newPassword')!.valueChanges.subscribe((password: string) => {
      this.passwordLevel.set(this.calcPasswordLevel(password));
    });
  }

  get newPassword(): string {
    return this.form.get('newPassword')?.value ?? '';
  }

  private calcPasswordLevel(password: string): number | undefined {
    if (!password) return undefined;
    let level = 0;
    if (password.length >= 6) level++;
    if (/[a-z]/.test(password)) level++;
    if (/[A-Z]/.test(password)) level++;
    if (/\d/.test(password)) level++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) level++;
    return level;
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // handle successful reset here
  }
}
