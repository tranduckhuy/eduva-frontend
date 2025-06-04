import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormControlComponent } from '../form-control/form-control.component';
import { AuthModalService } from '../../services/modal/auth-modal/auth-modal.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FormControlComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  private readonly authModalService = inject(AuthModalService);
  isModalOpen = this.authModalService.isOpen;

  username: string = '';
  password: string = '';

  closeModal() {
    this.authModalService.close();
  }
}
