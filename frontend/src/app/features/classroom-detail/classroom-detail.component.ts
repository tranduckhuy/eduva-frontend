import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CurriculumItemComponent } from './curriculum-item/curriculum-item.component';
import { WatchLessonBadgeComponent } from './watch-lesson-badge/watch-lesson-badge.component';

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
  selector: 'app-classroom-detail',
  standalone: true,
  imports: [CurriculumItemComponent, WatchLessonBadgeComponent],
  templateUrl: './classroom-detail.component.html',
  styleUrl: './classroom-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassroomDetailComponent {
  curriculums = signal<Curriculum[]>([
    {
      title: '1. Giới thiệu',
      lessonCount: 2,
      lessons: [
        {
          title: '1. Giới thiệu',
          duration: '03:58',
          type: 'audio',
        },
        {
          title: '2. Demo AI hoạt động',
          duration: '00:22',
          type: 'video',
        },
      ],
    },
    {
      title: '2. Xây dựng',
      lessonCount: 6,
      lessons: [
        {
          title: '3. Install NodeJS',
          duration: '03:11',
          type: 'video',
        },
        {
          title: '4. Create React App',
          duration: '06:07',
          type: 'video',
        },
        {
          title: '5. Install Dependencies',
          duration: '09:36',
          type: 'video',
        },
        {
          title: '6. Build UI Frame',
          duration: '04:42',
          type: 'video',
        },
        {
          title: '7. Import Dependencies',
          duration: '06:25',
          type: 'video',
        },
        {
          title: '8. Setup Camera',
          duration: '09:28',
          type: 'video',
        },
      ],
    },
    {
      title: '3. Training Functions',
      lessonCount: 5,
      lessons: [
        {
          title: '9. Train Function',
          duration: '01:00',
          type: 'docx',
        },
        {
          title: '10. Training Function',
          duration: '07:57',
          type: 'video',
        },
        {
          title: '11. Running Function',
          duration: '14:56',
          type: 'video',
        },
        {
          title: '12. Implement audio and notification',
          duration: '14:45',
          type: 'video',
        },
        {
          title: '13. Training Guide',
          duration: '01:00',
          type: 'pdf',
        },
      ],
    },
  ]);

  collapsedStateList = signal<boolean[]>([]);

  constructor() {
    const count = this.curriculums().length;
    this.collapsedStateList.set(Array(count).fill(true));
  }

  toggleCollapse(index: number) {
    this.collapsedStateList.update(list =>
      list.map((val, i) => (i === index ? !val : val))
    );
  }

  toggleAllCurriculums() {
    const expand = !this.areAllExpanded();
    this.collapsedStateList.update(list => list.map(() => !expand));
  }

  areAllExpanded() {
    return this.collapsedStateList().every(state => !state);
  }
}
