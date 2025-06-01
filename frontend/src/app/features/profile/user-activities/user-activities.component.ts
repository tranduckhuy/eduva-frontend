import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { SubjectCardComponent } from '../../../shared/components/subject-card/subject-card.component';

type Subject = {
  title: string;
  grade: string;
  createdBy: string;
  mediaNumbers: string;
  duration: string;
  subjectImage: string;
  creatorAvatar: string;
  isRecommend?: boolean;
};

@Component({
  selector: 'profile-user-activities',
  standalone: true,
  imports: [SubjectCardComponent],
  templateUrl: './user-activities.component.html',
  styleUrl: './user-activities.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivitiesComponent {
  subjects = signal<Subject[]>([
    {
      title: 'HTML CSS Pro',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '590',
      duration: '116h50p',
      subjectImage:
        'https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: 'JavaScript Pro',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '231',
      duration: '42h32p',
      subjectImage:
        'https://files.fullstack.edu.vn/f8-prod/courses/19/66aa28194b52b.png',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: 'Ngôn ngữ SASS',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '27',
      duration: '6h18p',
      subjectImage:
        'https://files.fullstack.edu.vn/f8-prod/courses/27/64e184ee5d7a2.png',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: 'HTML CSS Pro',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '590',
      duration: '116h50p',
      subjectImage:
        'https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: 'JavaScript Pro',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '231',
      duration: '42h32p',
      subjectImage:
        'https://files.fullstack.edu.vn/f8-prod/courses/19/66aa28194b52b.png',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: 'Ngôn ngữ SASS',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '27',
      duration: '6h18p',
      subjectImage:
        'https://files.fullstack.edu.vn/f8-prod/courses/27/64e184ee5d7a2.png',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: 'HTML CSS Pro',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '590',
      duration: '116h50p',
      subjectImage:
        'https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: 'JavaScript Pro',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '231',
      duration: '42h32p',
      subjectImage:
        'https://files.fullstack.edu.vn/f8-prod/courses/19/66aa28194b52b.png',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: 'Ngôn ngữ SASS',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '27',
      duration: '6h18p',
      subjectImage:
        'https://files.fullstack.edu.vn/f8-prod/courses/27/64e184ee5d7a2.png',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
  ]);
}
