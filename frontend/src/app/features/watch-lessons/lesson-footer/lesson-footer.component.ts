import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

import { ButtonOutlineGradientComponent } from '../../../shared/components/button-outline-gradient/button-outline-gradient.component';

@Component({
  selector: 'lesson-footer',
  standalone: true,
  imports: [TooltipModule, ButtonOutlineGradientComponent],
  templateUrl: './lesson-footer.component.html',
  styleUrl: './lesson-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonFooterComponent {
  isSidebarOpen = input.required<boolean>();

  toggleSidebar = output<void>();
  openCommentModal = output<void>();

  get iconSrc(): string {
    return this.isSidebarOpen()
      ? './images/icons/arrow-right-bar.svg'
      : './images/icons/three-bars.svg';
  }

  onToggleSidebarClick() {
    this.toggleSidebar.emit();
  }

  onOpenCommentModalClick() {
    this.openCommentModal.emit();
  }
}
