import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'auth-modal-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-modal-header.component.html',
  styleUrl: './auth-modal-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalHeaderComponent {
  isLogin = input<boolean>();
}
