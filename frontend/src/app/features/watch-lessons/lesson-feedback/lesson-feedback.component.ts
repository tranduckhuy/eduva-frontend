import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

import { ButtonOutlineGradientComponent } from '../../../shared/components/button-outline-gradient/button-outline-gradient.component';

@Component({
  selector: 'lesson-feedback',
  standalone: true,
  imports: [TooltipModule, ButtonOutlineGradientComponent],
  templateUrl: './lesson-feedback.component.html',
  styleUrl: './lesson-feedback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonFeedbackComponent {}
