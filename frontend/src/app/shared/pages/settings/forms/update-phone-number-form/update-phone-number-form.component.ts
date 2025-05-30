import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControlComponent } from '../../../../components/form-control/form-control.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-phone-number-form',
  standalone: true,
  imports: [FormControlComponent, FormsModule],
  templateUrl: './update-phone-number-form.component.html',
  styleUrl: './update-phone-number-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePhoneNumberFormComponent {
  phone = signal<string>('');

  onSubmit() {}
}
