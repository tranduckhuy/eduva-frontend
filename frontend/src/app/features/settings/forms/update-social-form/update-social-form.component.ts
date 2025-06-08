import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FormControlComponent } from '../../../../shared/components/form-control/form-control.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-update-social-form',
  standalone: true,
  imports: [FormsModule, FormControlComponent, ButtonComponent],
  templateUrl: './update-social-form.component.html',
  styleUrl: './update-social-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateSocialFormComponent {
  label = input<string>('');
  placeholder = input<string>('');
  name = input<string>('');
  initialValue = input<string>('');

  socialValue = signal('');

  ngOnInit() {
    this.socialValue.set(this.initialValue());
  }

  onSubmit() {}
}
