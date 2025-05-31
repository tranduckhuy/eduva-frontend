import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { SubmenuDirective } from '../../../directives/submenu/submenu.directive';

import { ImageModule } from 'primeng/image';

@Component({
  selector: 'comment-question',
  standalone: true,
  imports: [SubmenuDirective, ImageModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent {
  isOptionsOpen = signal<boolean>(false);

  toggleFooterOptions() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  closeFooterOptions() {
    this.isOptionsOpen.set(false);
  }
}
