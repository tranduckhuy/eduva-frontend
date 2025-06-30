import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlComponent } from '../../form-control/form-control.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'auth-form-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './auth-form-login.component.html',
  styleUrl: './auth-form-login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormLoginComponent {
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;

  submitted = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
