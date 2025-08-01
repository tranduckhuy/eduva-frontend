import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

import { ButtonOutlineGradientComponent } from '../../../shared/components/button-outline-gradient/button-outline-gradient.component';

@Component({
  selector: 'lesson-footer',
  standalone: true,
  imports: [TooltipModule, ButtonOutlineGradientComponent, TooltipModule],
  templateUrl: './lesson-footer.component.html',
  styleUrl: './lesson-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonFooterComponent {
  isSidebarOpen = input.required<boolean>();
  currentFolderName = input.required<string | undefined>();
  currentFolderIndex = input.required<number | undefined>();
  isFirstMaterial = input<boolean>(false);
  isLastMaterial = input<boolean>(false);

  toggleSidebar = output<void>();
  openCommentModal = output<void>();
  nextMaterial = output<void>();
  prevMaterial = output<void>();

  get iconSrc(): string {
    return this.isSidebarOpen()
      ? './images/icons/arrow-right-bar.svg'
      : './images/icons/three-bars.svg';
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      this.onNextMaterialClick();
    }
  }

  onToggleSidebarClick() {
    this.toggleSidebar.emit();
  }

  onOpenCommentModalClick() {
    this.openCommentModal.emit();
  }

  onNextMaterialClick() {
    this.nextMaterial.emit();
  }

  onPrevMaterialClick() {
    this.prevMaterial.emit();
  }
}
