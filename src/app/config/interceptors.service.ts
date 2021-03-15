import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { environment } from 'src/environments/environment';
import { CONSTANT } from '../constants/app-constants.service';

@Injectable()
export class InterceptorsService implements HttpInterceptor {

  BASE_URL = environment.API_BASE_URL;
  isLocal = environment.local;

  constructor(
    private appConfig: AppConfigService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url !== `${this.BASE_URL}/rest/session/token`) {
      if (!request?.url?.includes('/version.json')) {
        this.appConfig.showLoader();
      }
    }
    
    // created on 28-Nov
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    const clone = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
      withCredentials: this.isLocal ? false : true
    });
    return next.handle(clone).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      retry(3),
      // Hidden on 28-Nov
      // return next.handle(request).pipe(
      //   map((event: HttpEvent<any>) => {
      //     if (!request.headers.has('Content-Type')) {
      //       // request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });
      //       request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
      //     }

      //     if (event instanceof HttpResponse) {
      //       // this.appConfig.hideLoader();
      //       return event;
      //     }
      //     // this.appConfig.hideLoader();
      //     return event;
      //   }),
      //   retry(3),
      catchError((error: HttpErrorResponse) => {
        // let data = {};
        // data = {
        //   reason: error && error.error.reason ? error.error.reason : '',
        //   status: error.status
        // };
          if (error && error['status'] !== 200) {
          // console.log(error ? error : '');
        }

        if (error.status === 0) {
          this.appConfig.hideLoader();
          // this.appConfig.error(error.statusText + ': HTTP failure response', '');
          this.appConfig.errorWithTitle('Your network connection is down or Request is getting timed out.', 'Please try again later..');
          return throwError(error);
        }
        if (error.status === 400) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '400 Bad request', '');
          return throwError(error);
        }
        if (error.status === 401) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '401 UnAuthorized', '');
          return throwError(error);
        }

        if (error.status === 403) {
          if (error?.error && error?.error?.FailureReason?.message.includes('URL query argument is invalid')) {
            this.appConfig.hideLoader();
            this.appConfig.clearLocalData();
            this.appConfig.error('Session expired. Please log in again', '');
            this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
          } else {
            this.appConfig.hideLoader();
            this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
              ? error.error.message : '403 Forbidden', '');
            return throwError(error);
          }
          // this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
          //   ? error.error.message : '401 UnAuthorized', '');
          // return throwError(error);
        }

        if (error.status === 422) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.errors
            ? error.error.errors[0].message : error.error.message
              ? error.error.message : '422 Unprocessable entity', '');
          // if (error.error) {
          //   if (error.error.errors) {
          //     this.appConfig.error(error.error.errors[0].message, '');
          //   }
          //   if (error.error.message) {
          //     this.appConfig.error(error.error.message, '');
          //   }
          // } else {
          //   this.appConfig.error('422 Unprocessable entity', '');
          // }
          return throwError(error);
        }
        if (error.status === 500) {
          this.appConfig.hideLoader();
          this.appConfig.errorWithTitle(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : 'Please try again later', 'Something went wrong');
          return throwError(error);
        }
        // if (error.status === 403) {
        //   this.appConfig.hideLoader();
        //   this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
        //     ? error.error.message : '403 Forbidden', '');
        //   return throwError(error);
        // }
        if (error.status === 404) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '404 Not found', '');
          return throwError(error);
        }
        if (error.status === 409) {
          this.appConfig.hideLoader();
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '409 Conflict error', '');
          return throwError(error);
        }
        if (error.status === 200) {
        } else {
          this.appConfig.hideLoader();
          if (error.status != 403) {
          this.appConfig.error(error.error && error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : `${error.status} Error`, '');
          }
          return throwError(error);
        }
        return throwError(error);

      })
    );
  }
}
