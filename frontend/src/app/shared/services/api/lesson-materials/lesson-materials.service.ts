import { inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';

import { StatusCode } from '../../../constants/status-code.constant';

import { type LessonMaterial } from '../../../models/entities/lesson-material.model';
import { type GetLessonMaterialsRequest } from '../../../models/api/request/query/get-lesson-materials-request.model';
import { LessonMaterialStatus } from '../../../models/enum/lesson-material.enum';
import { EntityStatus } from '../../../models/enum/entity-status.enum';
import { GetAllFoldersMaterialsResponse } from '../../../models/api/response/query/get-all-folders-materials-response.model';

@Injectable({
  providedIn: 'root',
})
export class LessonMaterialsService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly LESSON_MATERIALS_API_URL = `${this.BASE_API_URL}/lesson-materials`;
  private readonly ALL_FOLDERS_AND_LESSON_MATERIALS_API_URL = `${this.BASE_API_URL}/classes`;

  private readonly lessonMaterialsSignal = signal<LessonMaterial[]>([]);
  lessonMaterials = this.lessonMaterialsSignal.asReadonly();

  private readonly foldersLessonMaterialsSignal = signal<
    GetAllFoldersMaterialsResponse[]
  >([]);
  foldersLessonMaterials = this.foldersLessonMaterialsSignal.asReadonly();

  private readonly lessonMaterialSignal = signal<LessonMaterial | null>(null);
  lessonMaterial = this.lessonMaterialSignal.asReadonly();

  getLessonMaterials(
    request: GetLessonMaterialsRequest
  ): Observable<LessonMaterial[] | null> {
    return this.requestService
      .get<Observable<LessonMaterial[] | null>>(
        `${this.LESSON_MATERIALS_API_URL}/all`,
        request,
        {
          loadingKey: 'get-materials',
        }
      )
      .pipe(
        tap(res => this.handleGetResponse(res)),
        map(res => this.extractLessonMaterialsFromResponse(res)),
        catchError(() => this.handleGetError())
      );
  }

  getLessonMaterialsInFolder(
    request: GetLessonMaterialsRequest
  ): Observable<LessonMaterial[] | null> {
    return this.requestService
      .get<Observable<LessonMaterial[] | null>>(
        `${this.BASE_API_URL}/folders/${request.folderId}/lesson-materials`,
        request,
        {
          loadingKey: 'get-materials',
        }
      )
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

  getAllFoldersAndLessonMaterials(
    classId: string
  ): Observable<GetAllFoldersMaterialsResponse[] | null> {
    return this.requestService
      .get<GetAllFoldersMaterialsResponse[]>(
        `${this.ALL_FOLDERS_AND_LESSON_MATERIALS_API_URL}/${classId}/lesson-materials
`,
        {
          lessonStatus: LessonMaterialStatus.Approved,
          status: EntityStatus.Active,
        },
        {
          loadingKey: 'all-folders-and-materials',
        }
      )
      .pipe(
        tap(res => this.handleFoldersAndLessonMaterialsResponse(res)),
        map(res => this.extractFoldersAndLessonMaterialsResponse(res)),
        catchError(() => this.handleGetError())
      );
  }

  // ---------------------------
  //  Private Helper Functions
  // ---------------------------

  private handleGetResponse(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      const lessonMaterials = res.data;
      this.lessonMaterialsSignal.set(lessonMaterials.data ?? []);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private extractLessonMaterialsFromResponse(
    res: any
  ): LessonMaterial[] | null {
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

  private handleFoldersAndLessonMaterialsResponse(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      this.foldersLessonMaterialsSignal.set(res.data);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private extractFoldersAndLessonMaterialsResponse(
    res: any
  ): GetAllFoldersMaterialsResponse[] | null {
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
