import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-update-bio-form',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './update-bio-form.component.html',
  styleUrl: './update-bio-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateBioFormComponent {
  bio = signal('');

  onSubmit() {}
}
