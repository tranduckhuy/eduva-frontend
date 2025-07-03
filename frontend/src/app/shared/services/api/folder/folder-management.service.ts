import { Injectable, inject, signal } from '@angular/core';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';

import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';

import { StatusCode } from '../../../constants/status-code.constant';

import { type Folder } from '../../../models/entities/folder.model';
import { type GetFoldersRequest } from '../../../models/api/request/query/get-folders-request.model';

@Injectable({
  providedIn: 'root',
})
export class FolderManagementService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly BASE_FOLDERS_API_URL = `${this.BASE_API_URL}/folders`;

  private readonly folderListSignal = signal<Folder[]>([]);
  folderList = this.folderListSignal.asReadonly();

  private readonly totalRecordsSignal = signal<number>(0);
  totalRecords = this.totalRecordsSignal.asReadonly();

  private readonly folderSignal = signal<Folder | null>(null);
  folder = this.folderSignal.asReadonly();

  getClassFolders(
    request: GetFoldersRequest,
    classId: string
  ): Observable<Folder[] | null> {
    return this.fetchFolders(
      `${this.BASE_FOLDERS_API_URL}/class/${classId}`,
      request
    );
  }

  getFolderById(id: string): Observable<Folder | null> {
    return this.requestService
      .get<Folder>(
        `${this.BASE_FOLDERS_API_URL}/${id}`,
        {},
        {
          loadingKey: 'get-folder',
        }
      )
      .pipe(
        tap(res => this.handleDetailResponse(res)),
        map(res => this.extractDetailResponse(res)),
        catchError(() => this.handleGetError())
      );
  }

  // ---------------------------
  //  Private Helper Functions
  // ---------------------------

  private fetchFolders(
    api: string,
    request: GetFoldersRequest
  ): Observable<Folder[] | null> {
    return this.requestService
      .get<Folder[]>(api, request, {
        loadingKey: 'get-folders',
      })
      .pipe(
        tap(res => {
          if (res.statusCode === StatusCode.SUCCESS && res.data) {
            this.folderListSignal.set(res.data ?? []);
          } else {
            this.toastHandlingService.error(
              'Lấy danh sách bài giảng thất bại',
              'Không thể lấy được danh sách bài giảng. Vui lòng thử lại sau.'
            );
          }
        }),
        map(res => this.extractData<Folder[]>(res)),
        catchError(() => this.handleGetError())
      );
  }

  private extractData<T>(res: any): T | null {
    return res.statusCode === StatusCode.SUCCESS && res.data ? res.data : null;
  }

  private handleGetError(): Observable<null> {
    this.toastHandlingService.errorGeneral();
    return of(null);
  }

  private handleDetailResponse(res: any): void {
    if (res.statusCode === StatusCode.SUCCESS && res.data) {
      this.folderSignal.set(res.data);
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private extractDetailResponse(res: any): Folder | null {
    return res.statusCode === StatusCode.SUCCESS ? res.data : null;
  }
}
