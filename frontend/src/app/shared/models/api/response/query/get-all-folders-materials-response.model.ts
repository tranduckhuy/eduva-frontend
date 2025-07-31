import { LessonMaterial } from '../../../entities/lesson-material.model';

export interface GetAllFoldersMaterialsResponse {
  id: string;
  name: string;
  countLessonMaterials: number;
  lessonMaterials: LessonMaterial[];
  index?: number; // Original position in the unfiltered list
}
