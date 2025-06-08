import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonType = 'primary' | 'rounded' | 'text' | 'outline';

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
  type = input.required<ButtonType | ButtonType[]>();

  get typeList(): ButtonType[] {
    const value = this.type();
    return Array.isArray(value) ? value : [value];
  }
}
