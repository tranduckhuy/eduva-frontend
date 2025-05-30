import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormControlComponent } from '../../../../components/form-control/form-control.component';

@Component({
  selector: 'app-update-username-form',
  standalone: true,
  imports: [FormsModule, FormControlComponent],
  templateUrl: './update-username-form.component.html',
  styleUrl: './update-username-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUsernameFormComponent {
  username = signal('');

  onSubmit() {}
}
