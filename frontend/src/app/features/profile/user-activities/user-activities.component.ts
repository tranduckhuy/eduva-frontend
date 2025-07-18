import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ClassroomCardComponent } from '../../../shared/components/classroom-card/classroom-card.component';

type Classroom = {
  title: string;
  grade: string;
  createdBy: string;
  mediaNumbers: string;
  duration: string;
  classroomImage: string;
  creatorAvatar: string;
  isRecommend?: boolean;
  progress?: number;
};

@Component({
  selector: 'profile-user-activities',
  standalone: true,
  imports: [ClassroomCardComponent],
  templateUrl: './user-activities.component.html',
  styleUrl: './user-activities.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivitiesComponent {
  classrooms = signal<Classroom[]>([
    {
      title: '12_A3_NgoaiNgu_2324',
      grade: '12',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '590',
      duration: '116h50p',
      classroomImage:
        'https://www.gstatic.com/classroom/themes/WorldStudies_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: '11_A2_LichSu_2425',
      grade: '11',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '231',
      duration: '42h32p',
      classroomImage:
        'https://gstatic.com/classroom/themes/WorldHistory_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: '10_A11_DiaLy_2526',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '27',
      duration: '6h18p',
      classroomImage:
        'https://www.gstatic.com/classroom/themes/SocialStudies_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: '11_A7_TamLy_2526',
      grade: '11',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '27',
      duration: '6h18p',
      classroomImage:
        'https://gstatic.com/classroom/themes/Psychology_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: '11_A11_VatLy_2526',
      grade: '11',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '27',
      duration: '6h18p',
      classroomImage:
        'https://www.gstatic.com/classroom/themes/Physics_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: '12_A11_NguVan_2526',
      grade: '12',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '27',
      duration: '6h18p',
      classroomImage:
        'https://www.gstatic.com/classroom/themes/English_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: '10_A5_DiaLy_2324',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '9',
      duration: '3h12p',
      classroomImage:
        'https://www.gstatic.com/classroom/themes/Geography_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
    },
    {
      title: '10_A4_TinHoc_2324',
      grade: '10',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '9',
      duration: '3h12p',
      classroomImage:
        'https://www.gstatic.com/classroom/themes/img_code_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
    },
    {
      title: '11_A6_HinhHoc_2223',
      grade: '11',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '117',
      duration: '29h5p',
      classroomImage:
        'https://www.gstatic.com/classroom/themes/Geometry_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: '12_A3_SinhHoc_2223',
      grade: '12',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '34',
      duration: '6h31p',
      classroomImage: 'https://gstatic.com/classroom/themes/Biology_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
    },
    {
      title: '11_A2_DaiSo_2122',
      grade: '11',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '112',
      duration: '24h15p',
      classroomImage: 'https://gstatic.com/classroom/themes/Math_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
    {
      title: '12_A1_HoaHoc_2223',
      grade: '12',
      createdBy: 'Sơn Đặng',
      mediaNumbers: '19',
      duration: '8h41p',
      classroomImage:
        'https://gstatic.com/classroom/themes/Chemistry_thumb.jpg',
      creatorAvatar: 'https://fullstack.edu.vn/images/founder.jpeg',
      isRecommend: true,
    },
  ]);
}
