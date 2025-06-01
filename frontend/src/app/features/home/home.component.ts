import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { HomeCarouselComponent } from '../../shared/components/home-carousel/home-carousel.component';
import { SubjectCardComponent } from '../../shared/components/subject-card/subject-card.component';

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

type SubjectSection = {
  title: string;
  subjects: Subject[];
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeCarouselComponent, SubjectCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  subjectSections = signal<SubjectSection[]>([
    {
      title: 'Môn đã học',
      subjects: [
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
      ],
    },
    {
      title: 'Môn đã học',
      subjects: [
        {
          title: 'Kiến Thức Nhập Môn IT',
          grade: '10',
          createdBy: 'Sơn Đặng',
          mediaNumbers: '9',
          duration: '3h12p',
          subjectImage: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
          creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
        },
        {
          title: 'HTML CSS Từ Zero Đến Hero',
          grade: '10',
          createdBy: 'Sơn Đặng',
          mediaNumbers: '117',
          duration: '29h5p',
          subjectImage: 'https://files.fullstack.edu.vn/f8-prod/courses/2.png',
          creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
          isRecommend: true,
        },
        {
          title: 'Responsive Với Grid System',
          grade: '10',
          createdBy: 'Sơn Đặng',
          mediaNumbers: '34',
          duration: '6h31p',
          subjectImage: 'https://files.fullstack.edu.vn/f8-prod/courses/3.png',
          creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
        },
        {
          title: 'Lập Trình JavaScript Cơ Bản',
          grade: '10',
          createdBy: 'Sơn Đặng',
          mediaNumbers: '112',
          duration: '24h15p',
          subjectImage: 'https://files.fullstack.edu.vn/f8-prod/courses/1.png',
          creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
          isRecommend: true,
        },
        {
          title: 'Lập Trình JavaScript Nâng Cao',
          grade: '10',
          createdBy: 'Sơn Đặng',
          mediaNumbers: '19',
          duration: '8h41p',
          subjectImage: 'https://files.fullstack.edu.vn/f8-prod/courses/12.png',
          creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
          isRecommend: true,
        },
      ],
    },
  ]);
}
