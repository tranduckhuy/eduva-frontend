import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password-form',
  standalone: true,
  imports: [],
  templateUrl: './forget-password-form.component.html',
  styleUrl: './forget-password-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPasswordFormComponent {
  private readonly router = inject(Router);
  @Output() close = new EventEmitter<void>();

  goBack(): void {
    this.close.emit();
  }
  goHome(): void {
    this.router.navigate(['/']);
  }
}
