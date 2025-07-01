import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-update-email-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './update-email-form.component.html',
  styleUrl: './update-email-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEmailFormComponent {
  private readonly fb = inject(FormBuilder);

  email = input.required<string>();
  form = this.fb.group({ email: [''] });

  constructor() {
    effect(() => {
      this.form.patchValue({ email: this.email() });
    });
  }

  onSubmit() {}
}
