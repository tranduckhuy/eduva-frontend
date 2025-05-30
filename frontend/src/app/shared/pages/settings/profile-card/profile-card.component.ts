import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  title = input<string>('');
  subtitle = input<string | undefined>('');
  avatarUrl = input<string | undefined>('');
  readonly = input<boolean>(false);
}
