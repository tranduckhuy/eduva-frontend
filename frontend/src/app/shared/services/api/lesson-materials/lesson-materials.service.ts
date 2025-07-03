import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';

import { StatusCode } from '../../../constants/status-code.constant';

import { type LessonMaterial } from '../../../models/entities/lesson-material.model';
import { type GetLessonMaterialsRequest } from '../../../models/api/request/query/get-lesson-materials-request.model';
import { type GetLessonMaterialsResponse } from '../../../models/api/response/query/get-lesson-materials-response.model';

@Injectable({
  providedIn: 'root',
})
export class LessonMaterialsService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly LESSON_MATERIALS_API_URL = `${this.BASE_API_URL}/lesson-materials`;

  private readonly lessonMaterialsSignal = signal<LessonMaterial[]>([]);
  lessonMaterials = this.lessonMaterialsSignal.asReadonly();

  private readonly lessonMaterialSignal = signal<LessonMaterial | null>(null);
  lessonMaterial = this.lessonMaterialSignal.asReadonly();

  private readonly totalRecordsSignal = signal<number>(0);
  totalRecords = this.totalRecordsSignal.asReadonly();

  getLessonMaterials(
    request: GetLessonMaterialsRequest
  ): Observable<GetLessonMaterialsResponse | null> {
    return this.requestService
      .get<GetLessonMaterialsResponse>(this.LESSON_MATERIALS_API_URL, request, {
        loadingKey: 'get-materials',
      })
      .pipe(
        tap(res => this.handleGetResponse(res)),
        map(res => this.extractLessonMaterialsFromResponse(res)),
        catchError(() => this.handleGetError())
      );
  }

  fetchLessonMaterialById(id: string): Observable<LessonMaterial | null> {
    return this.requestService
      .get<LessonMaterial>(
        `${this.LESSON_MATERIALS_API_URL}/${id}`,
        {},
        {
          loadingKey: 'get-material',
        }
      )
      .pipe(
        tap(res => this.handleDetailResponse(res)),
        map(res => this.extractDetailResponse(res)),
        catchError(() => this.handleError())
      );
  }

  // ---------------------------
  //  Private Helper Functions
  // ---------------------------

  private handleGetResponse(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      const lessonMaterials = res.data;
      this.lessonMaterialsSignal.set(lessonMaterials.data ?? []);
      this.totalRecordsSignal.set(lessonMaterials.count ?? 0);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private extractLessonMaterialsFromResponse(
    res: any
  ): GetLessonMaterialsResponse | null {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      return res.data;
    }
    return null;
  }

  private handleDetailResponse(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      this.lessonMaterialSignal.set(res.data);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private extractDetailResponse(res: any): LessonMaterial | null {
    return res.statusCode === StatusCode.SUCCESS ? res.data : null;
  }

  private handleError(): Observable<null> {
    this.toastHandlingService.errorGeneral();
    return of(null);
  }

  private handleGetError(): Observable<null> {
    this.toastHandlingService.errorGeneral();
    return of(null);
  }
}
