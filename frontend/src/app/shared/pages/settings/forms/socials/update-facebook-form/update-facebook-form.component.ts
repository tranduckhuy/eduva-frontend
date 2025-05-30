import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControlComponent } from '../../../../../components/form-control/form-control.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-facebook-form',
  standalone: true,
  imports: [FormControlComponent, FormsModule],
  templateUrl: './update-facebook-form.component.html',
  styleUrl: './update-facebook-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateFacebookFormComponent {
  facebook = signal('');

  onSubmit() {}
}
