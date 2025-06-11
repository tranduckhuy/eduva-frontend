import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { LessonItemComponent } from './lesson-item/lesson-item.component';

type Lesson = {
  title: string;
  duration: string;
  type: 'video' | 'audio' | 'pdf' | 'docx';
};

type Curriculum = {
  title: string;
  lessonCount: number;
  lessons: Lesson[];
};

@Component({
  selector: 'curriculum-item',
  standalone: true,
  imports: [LessonItemComponent],
  templateUrl: './curriculum-item.component.html',
  styleUrl: './curriculum-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurriculumItemComponent {
  curriculum = input.required<Curriculum>();
  isCollapsed = input<boolean>(true);

  toggleCollapsed = output<void>();
}
