import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, catchError, map, tap, throwError } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';

import { StatusCode } from '../../../constants/status-code.constant';
import { EntityStatus } from '../../../models/enum/entity-status.enum';
import { LessonMaterialStatus } from '../../../models/enum/lesson-material.enum';

import { type LessonMaterial } from '../../../models/entities/lesson-material.model';
import { type GetLessonMaterialsRequest } from '../../../models/api/request/query/get-lesson-materials-request.model';
import { type GetAllFoldersMaterialsResponse } from '../../../models/api/response/query/get-all-folders-materials-response.model';

@Injectable({
  providedIn: 'root',
})
export class LessonMaterialsService {
  private readonly router = inject(Router);
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
        catchError((err: HttpErrorResponse) => this.handleGetError(err))
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
        catchError((err: HttpErrorResponse) => this.handleGetError(err))
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
        catchError((err: HttpErrorResponse) => this.handleError(err))
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
        catchError((err: HttpErrorResponse) => this.handleGetError(err))
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

  private handleError(err: HttpErrorResponse): Observable<null> {
    switch (err.error?.statusCode) {
      case StatusCode.LESSON_MATERIAL_NOT_ACTIVE:
        // ? Redirect to home page
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);

        // ? Close Submenus
        window.dispatchEvent(new Event('close-all-submenus'));

        // ? Show toast
        this.toastHandlingService.warn(
          'Bài giảng đã bị xóa',
          'Bài giảng đã bị giáo viên sở hữu chuyển vào thùng rác hoặc xóa.'
        );
        break;
      case StatusCode.STUDENT_NOT_ENROLLED_IN_CLASS_WITH_MATERIAL:
        // ? Redirect to home page
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);

        // ? Close Submenus
        window.dispatchEvent(new Event('close-all-submenus'));

        // ? Show toast
        this.toastHandlingService.warn(
          'Chưa tham gia lớp học',
          'Bạn chưa tham gia lớp học có chứa tài liệu này.'
        );
        break;
      case StatusCode.SCHOOL_SUBSCRIPTION_NOT_FOUND:
        this.toastHandlingService.warn(
          'Thiếu gói đăng ký',
          'Trường học của bạn hiện chưa đăng ký gói sử dụng hệ thống.'
        );
        break;
      default:
        this.toastHandlingService.errorGeneral();
    }

    return throwError(() => err);
  }

  private handleGetError(err: HttpErrorResponse): Observable<null> {
    this.toastHandlingService.errorGeneral();
    return throwError(() => err);
  }
}
