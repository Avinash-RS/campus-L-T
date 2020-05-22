import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';

@Injectable()
export class InterceptorsService implements HttpInterceptor {

  constructor(
    private appConfig: AppConfigService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event;
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason: error && error.error.reason ? error.error.reason : '',
          status: error.status
        };
        this.appConfig.errorLog('err', error);

        if (error.status === 0) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.statusText + ': HTTP failure response', '');
          return throwError(error);
        }
        if (error.status === 400) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error ? error.error.FailureReason.message : '400 Bad Request', '');
          return throwError(error);
        }
        if (error.status === 401) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error ? error.error.FailureReason.message : '401 UnAuthorized', '');
          return throwError(error);
        }
        if (error.status === 422) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error ? error.error.FailureReason.message : '422 Unprocessable Entity', '');
          // if (error.error) {
          //   if (error.error.errors) {
          //     this.appConfig.error(error.error.errors[0].message, '');
          //   }
          //   if (error.error.message) {
          //     this.appConfig.error(error.error.message, '');
          //   }
          // } else {
          //   this.appConfig.error('422 Unprocessable Entity', '');
          // }
          return throwError(error);
        }
        if (error.status === 500) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error ? error.error.FailureReason.message : '500 Internal Server Error', '');
          return throwError(error);
        }
        if (error.status === 403) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error ? error.error.FailureReason.message : '403 Forbidden', '');
          return throwError(error);
        }
        if (error.status === 404) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error ? error.error.FailureReason.message : '404 Not Found', '');
          return throwError(error);
        }
        if (error.status === 409) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error ? error.error.FailureReason.message : '409 Conflict Error', '');
          return throwError(error);
        }
        if (error.status === 200) {
          this.appConfig.hideLoader();
        } else {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error ? error.error.FailureReason.message : `${error.status} Error`, '');
          return throwError(error);
        }
        return throwError(error);

      })
    );
  }
}
