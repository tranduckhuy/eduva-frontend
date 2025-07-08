import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  EventEmitter,
  Output,
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
  @Output() nextMaterial = new EventEmitter<void>();
  @Output() prevMaterial = new EventEmitter<void>();

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

  onNextMaterialClick() {
    this.nextMaterial.emit();
  }

  onPrevMaterialClick() {
    this.prevMaterial.emit();
  }
}
