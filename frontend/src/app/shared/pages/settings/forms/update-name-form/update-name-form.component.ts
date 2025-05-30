import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormControlComponent } from '../../../../components/form-control/form-control.component';

@Component({
  selector: 'app-update-name-form',
  standalone: true,
  imports: [FormsModule, FormControlComponent],
  templateUrl: './update-name-form.component.html',
  styleUrl: './update-name-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateNameFormComponent {
  fullname = signal('');

  onSubmit() {}
}
