import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [ButtonModule, InputTextModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  @Output() close = new EventEmitter<void>();
  width = input(420);
  title = input('');
  desc = input('');

  onClose() {
    this.close.emit();
  }
}
