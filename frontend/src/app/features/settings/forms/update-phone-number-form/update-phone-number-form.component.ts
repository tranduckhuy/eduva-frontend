import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

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

  phoneNumber = input.required<string>();
  form = this.fb.group({ phoneNumber: [''] });

  constructor() {
    effect(() => {
      this.form.patchValue({ phoneNumber: this.phoneNumber() });
    });
  }

  onSubmit() {}
}
