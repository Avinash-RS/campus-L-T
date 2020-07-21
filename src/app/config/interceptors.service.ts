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
import { environment } from 'src/environments/environment';

@Injectable()
export class InterceptorsService implements HttpInterceptor {

  BASE_URL = environment.API_BASE_URL;

  constructor(
    private appConfig: AppConfigService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url !== `${this.BASE_URL}/rest/session/token`) {
      this.appConfig.showLoader();
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (!request.headers.has('Content-Type')) {
          // request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });
          request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
      }

        if (event instanceof HttpResponse) {
          // this.appConfig.hideLoader();
          return event;
        }
        // this.appConfig.hideLoader();
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        // let data = {};
        // data = {
        //   reason: error && error.error.reason ? error.error.reason : '',
        //   status: error.status
        // };
        if (error && error['status'] !== 200) {
          console.log(error ? error : '');
        }

        if (error.status === 0) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.statusText + ': HTTP failure response', '');
          return throwError(error);
        }
        if (error.status === 400) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '400 Bad Request', '');
          return throwError(error);
        }
        if (error.status === 401) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '401 UnAuthorized', '');
          return throwError(error);
        }
        if (error.status === 422) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.errors
            ? error.error.errors[0].message : error.error.message
              ? error.error.message : '422 Unprocessable Entity', '');
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
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '500 Internal Server Error', '');
          return throwError(error);
        }
        if (error.status === 403) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '403 Forbidden', '');
          return throwError(error);
        }
        if (error.status === 404) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '404 Not Found', '');
          return throwError(error);
        }
        if (error.status === 409) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '409 Conflict Error', '');
          return throwError(error);
        }
        if (error.status === 200) {
        } else {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error && error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : `${error.status} Error`, '');
          return throwError(error);
        }
        return throwError(error);

      })
    );
  }
}
