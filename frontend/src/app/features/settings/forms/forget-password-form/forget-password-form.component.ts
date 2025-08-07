import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LoadingService } from '../../../../shared/services/core/loading/loading.service';
import { PasswordService } from '../../../../core/auth/services/password.service';
import { UserService } from '../../../../shared/services/api/user/user.service';

@Component({
  selector: 'app-forget-password-form',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './forget-password-form.component.html',
  styleUrl: './forget-password-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPasswordFormComponent {
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);
  private readonly passwordService = inject(PasswordService);
  private readonly userService = inject(UserService);

  readonly isLoading = this.loadingService.isLoading;
  readonly currentUser = this.userService.currentUser;

  @Output() close = new EventEmitter<void>();

  goBack(): void {
    this.close.emit();
  }
  goHome(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    this.passwordService
      .forgotPassword({ email: this.currentUser()!.email })
      .subscribe();

    this.close.emit();
  }
}
