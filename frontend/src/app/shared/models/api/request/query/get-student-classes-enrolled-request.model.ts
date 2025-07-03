import { EntityStatus } from '../../../enum/entity-status.enum';

export interface GetStudentClassesEnrolledRequest {
  studentId: string;
  className?: string;
  teacherName?: string;
  schoolName?: string;
  classCode?: string;
  classStatus: EntityStatus;
  schoolId: number;
  pageIndex?: number;
  pageSize?: number;
  sortBy: string;
  sortDirection: string;
  searchTerm?: string;
}
