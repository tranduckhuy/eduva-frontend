import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'rounded' | 'text' | 'outline';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  text = input.required<string>();
  variant = input.required<ButtonVariant | ButtonVariant[]>();
  buttonType = input<string>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  get variantList(): ButtonVariant[] {
    const value = this.variant();
    return Array.isArray(value) ? value : [value];
  }
}
