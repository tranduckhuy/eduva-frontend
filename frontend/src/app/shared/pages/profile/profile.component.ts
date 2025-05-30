import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TextExpanderDirective } from '../../directives/text-expander/text-expander.directive';
import { SubjectCardComponent } from '../../components/subject-card/subject-card.component';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faHouse,
  faSquarePlus,
  faComments,
  faShareFromSquare,
  faFileCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../../../core/layout/header/header.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';

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
  selector: 'app-profile',
  standalone: true,
  imports: [
    TextExpanderDirective,
    SubjectCardComponent,
    FontAwesomeModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  libIcon = inject(FaIconLibrary);

  constructor() {
    this.libIcon.addIcons(
      faHouse,
      faSquarePlus,
      faComments,
      faShareFromSquare,
      faFileCircleCheck
    );
  }
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
