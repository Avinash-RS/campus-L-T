import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders,
  HttpEventType
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, finalize } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { environment } from 'src/environments/environment';
import { CONSTANT } from '../constants/app-constants.service';
import { LoaderService } from '../services/loader-service.service';

@Injectable()
export class InterceptorsService implements HttpInterceptor {

  BASE_URL = environment.API_BASE_URL;
  isLocal = environment.local;
  private totalRequests = 0;
  constructor(
    private appConfig: AppConfigService,
    private loadingService: LoaderService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let lastResponse: HttpEvent<any>;
    let errResponse: HttpErrorResponse;
    this.totalRequests++;
    if (request.reportProgress) {
    } else {
      this.loadingService.setLoading(true);
    }
    // created on 28-Nov
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    let clone: any;
    // For node service, we are setting false to withCredentials
    if (request.url.includes('/getunifiedReport') || request.url.includes('/scheduleinterview') || request.url.includes('/getscheduleList')) {
      clone = request.clone({
        headers: request.headers.set('Accept', 'application/json'),
        withCredentials: this.isLocal ? false : false
      });
    } else {
      clone = request.clone({
        headers: request.headers.set('Accept', 'application/json'),
        withCredentials: this.isLocal ? false : true
      });
    }

    // Request Handling
    return next.handle(clone).pipe(
      map((event: HttpEvent<any>) => {
        lastResponse = event;
      if (event instanceof HttpResponse) {
        // Loader set to True
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.setLoading(false);
        }
        }
        return event;
      }),
      retry(2),
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
        errResponse = error;
        // Loader set to False
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.setLoading(false);
        }

        if (error && error['status'] !== 200) {
          // console.log(error ? error : '');
        }

        if (error.status === 0) {
          this.appConfig.errorWithTitle('Your network connection is down or Request is getting timed out.', 'Please try again later..');
          return throwError(error);
        }
        if (error.status === 400) {
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '400 Bad request', '');
          return throwError(error);
        }
        if (error.status === 401) {
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '401 UnAuthorized', '');
          this.appConfig.logoutWhenAuthorized();
          return throwError(error);
        }

        if (error.status === 403) {
          if (error?.error && error?.error?.FailureReason?.message.includes('URL query argument is invalid')) {
            this.appConfig.clearLocalData();
            this.appConfig.error('Session expired. Please log in again', '');
            this.appConfig.logoutWhenAuthorized();
          } else {
            this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
              ? error.error.message : '403 Forbidden', '');
            return throwError(error);
          }
          // this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
          //   ? error.error.message : '401 UnAuthorized', '');
          // return throwError(error);
        }

        if (error.status === 422) {
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
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '404 Not found', '');
          return throwError(error);
        }
        if (error.status === 409) {
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '409 Conflict error', '');
          return throwError(error);
        }
        if (error.status === 200) {
        } else {
          if (error.status != 403) {
          this.appConfig.error(error.error && error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : `${error.status} Error`, '');
          }
          return throwError(error);
        }
        return throwError(error);

      }),
      finalize(() => {
        if (lastResponse.type === HttpEventType.Sent && !errResponse) {
          // last response type was 0, and we haven't received an error
          this.totalRequests--;
        }
      })
    );
  }
}
