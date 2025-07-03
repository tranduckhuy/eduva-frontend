import { inject, Injectable, signal } from '@angular/core';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { environment } from '../../../../../environments/environment';
import { ClassModel } from '../../../models/entities/class.model';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';
import { GetStudentClassesEnrolledRequest } from '../../../models/api/request/query/get-student-classes-enrolled-request.model';
import { EntityListResponse } from '../../../models/api/response/query/entity-list-response.model';
import { StatusCode } from '../../../constants/status-code.constant';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly BASE_CLASS_API_URL = `${this.BASE_API_URL}/classes`;
  private readonly GET_STUDENT_CLASSES_API_URL = `${this.BASE_CLASS_API_URL}/enrollment`;

  private readonly classesSignal = signal<ClassModel[]>([]);
  classes = this.classesSignal.asReadonly();

  private readonly classModelSignal = signal<ClassModel | null>(null);
  classModel = this.classModelSignal.asReadonly();

  private readonly totalClassSignal = signal<number>(0);
  totalClass = this.totalClassSignal.asReadonly();

  getStudentClassesEnrolled(
    request: GetStudentClassesEnrolledRequest
  ): Observable<EntityListResponse<ClassModel> | null> {
    return this.requestService
      .get<
        EntityListResponse<ClassModel>
      >(this.GET_STUDENT_CLASSES_API_URL, request, { loadingKey: 'get-classes' })
      .pipe(
        tap(res => this.handleGetStudentClassesEnrolledResponse(res)),
        map(res => this.extractStudentClassesEnrolledFromResponse(res)),
        catchError(() => EMPTY)
      );
  }

  getStudentClassById(classId: string): Observable<ClassModel | null> {
    return this.requestService
      .get<ClassModel>(
        `${this.BASE_CLASS_API_URL}/${classId}`,
        {},
        { loadingKey: 'get-class' }
      )
      .pipe(
        tap(res => this.handleGetClassResponse(res)),
        map(res => this.extractClassFromResponse(res)),
        catchError(() => {
          this.toastHandlingService.errorGeneral();
          return of(null);
        })
      );
  }

  private handleGetStudentClassesEnrolledResponse(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      const { data } = res.data;
      this.classesSignal.set(data);
      this.totalClassSignal.set(res.data.count);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  clearClasses(): void {
    this.classesSignal.set([]);
    this.totalClassSignal.set(0);
  }

  private extractStudentClassesEnrolledFromResponse(
    res: any
  ): EntityListResponse<ClassModel> | null {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      return res.data;
    }
    return null;
  }

  private handleGetClassResponse(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      this.classModelSignal.set(res.data);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private extractClassFromResponse(res: any): ClassModel | null {
    if (
      (res.statusCode === StatusCode.CREATED && res.data) ||
      (res.statusCode === StatusCode.SUCCESS && res.data)
    ) {
      return res.data;
    }
    return null;
  }
}
