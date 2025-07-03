import { EntityStatus } from '../enum/entity-status.enum';

export interface ClassModel {
  id: string;
  schoolId: number;
  className: string;
  name?: string;
  classCode: string;
  classId: string;
  studentId: string;
  teacherName: string;
  studentName: string;
  schoolName: string;
  backgroundImageUrl: string;
  teacherAvatarUrl: string;
  studentAvatarUrl: string;
  enrolledAt: string;
  classStatus: EntityStatus;
  countLessonMaterial: number;
}
