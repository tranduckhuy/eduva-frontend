import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-update-phone-number-form',
  standalone: true,
  imports: [FormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './update-phone-number-form.component.html',
  styleUrl: './update-phone-number-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePhoneNumberFormComponent {
  phone = signal<string>('');

  onSubmit() {}
}
