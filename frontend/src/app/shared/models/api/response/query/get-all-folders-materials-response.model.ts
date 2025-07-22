import { LessonMaterial } from '../../../entities/lesson-material.model';

export interface GetAllFoldersMaterialsResponse {
  id: string;
  name: string;
  countLessonMaterials: number;
  lessonMaterials: LessonMaterial[];
}
