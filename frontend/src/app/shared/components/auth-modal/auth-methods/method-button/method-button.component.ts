import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'auth-method-button',
  standalone: true,
  imports: [],
  templateUrl: './method-button.component.html',
  styleUrl: './method-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodButtonComponent {
  iconUrl = input.required<string>();
  method = input.required<string>();
}
