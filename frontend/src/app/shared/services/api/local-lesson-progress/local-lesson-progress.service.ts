import { Injectable } from '@angular/core';

interface LastLesson {
  folder: string;
  material: string;
}

@Injectable({ providedIn: 'root' })
export class LessonProgressService {
  private readonly key = 'lastLessons';

  private getData(): Record<string, LastLesson> {
    return JSON.parse(localStorage.getItem(this.key) ?? '{}');
  }

  private setData(data: Record<string, LastLesson>): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  setLastLesson(classId: string, folderId: string, materialId: string): void {
    const data = this.getData();
    data[classId] = {
      folder: folderId,
      material: materialId,
    };
    this.setData(data);
  }

  getLastLesson(classId: string): LastLesson | null {
    const data = this.getData();
    return data[classId] || null;
  }

  removeLastLesson(classId: string): void {
    const data = this.getData();
    delete data[classId];
    this.setData(data);
  }

  clearAll(): void {
    localStorage.removeItem(this.key);
  }
}
