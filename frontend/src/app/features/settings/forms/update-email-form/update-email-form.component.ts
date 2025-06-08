import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-update-email-form',
  standalone: true,
  imports: [FormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './update-email-form.component.html',
  styleUrl: './update-email-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEmailFormComponent {
  email = signal('');

  onSubmit() {}
}
