import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, map, tap, catchError, throwError } from 'rxjs';

import { environment } from '../../../../../environments/environment';

import { RequestService } from '../../../../shared/services/core/request/request.service';
import { ToastHandlingService } from '../../../../shared/services/core/toast/toast-handling.service';
import { CreateCommentRequest } from '../model/request/command/create-comment-request.model';
import { StatusCode } from '../../../../shared/constants/status-code.constant';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly requestService = inject(RequestService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly BASE_COMMENT_API_URL = `${this.BASE_API_URL}/questions/comments`;

  createComment(request: CreateCommentRequest): Observable<Comment | null> {
    return this.requestService.post(this.BASE_COMMENT_API_URL, request).pipe(
      tap(res => this.handleCreateCommentResponse(res)),
      map(res => this.extractDataResponse(res)),
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  // ---------------------------
  //  Private Helper Functions
  // ---------------------------

  private handleCreateCommentResponse(res: any): void {
    if (res.statusCode === StatusCode.CREATED && res.data) {
      this.toastHandlingService.success(
        'Thành công',
        'Đã tạo bình luận thành công.'
      );
    } else {
      this.toastHandlingService.errorGeneral();
    }
  }

  private extractDataResponse(res: any): Comment | null {
    if (res.statusCode === StatusCode.CREATED && res.data) {
      return res.data as Comment;
    }
    return null;
  }

  private handleError(err: HttpErrorResponse) {
    this.toastHandlingService.errorGeneral();
    return throwError(() => err);
  }
}
