import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RichTextEditorComponent } from '../../../../shared/components/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'new-question',
  standalone: true,
  imports: [FormsModule, RichTextEditorComponent],
  templateUrl: './new-question.component.html',
  styleUrl: './new-question.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewQuestionComponent {
  title = signal<string>('');
  description = signal<string>('');
  isOptionsOpen = signal<boolean>(false);

  toggleOptionOpen() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  closeOptionOpen() {
    this.isOptionsOpen.set(false);
  }
}
