import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'auth-modal-footer',
  standalone: true,
  imports: [],
  templateUrl: './auth-modal-footer.component.html',
  styleUrl: './auth-modal-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalFooterComponent {
  isLogin = input.required<boolean>();
  switchState = output<void>();
}
