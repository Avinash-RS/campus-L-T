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
import { map, catchError, retry, finalize, timeout } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { environment } from 'src/environments/environment';
import { CONSTANT } from '../constants/app-constants.service';
import { LoaderService } from '../services/loader-service.service';
import { MatDialog } from '@angular/material';
import { ShortlistBoxComponent } from '../shared/modal-box/shortlist-box/shortlist-box.component';

@Injectable()
export class InterceptorsService implements HttpInterceptor {

  BASE_URL = environment.API_BASE_URL;
  isLocal = environment.local;
  WEBRTC_NODE_API = environment.WEBRTC_NODE_API;
  NODE_API = environment.NODE_API_BASE_URL;
  PROCTOR_URL = environment.PROCTOR_URL;
  UNIFIEDREPORTSAPI = environment.UNIFIEDREPORTSAPI;

  private totalRequests = 0;
  constructor(
    private appConfig: AppConfigService,
    private loadingService: LoaderService,
    private matdialog: MatDialog
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
    if (request.url.includes(this.WEBRTC_NODE_API) || request.url.includes(this.PROCTOR_URL) || request.url.includes(this.NODE_API) || request.url.includes(this.UNIFIEDREPORTSAPI)) {
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
    return next.handle(clone).pipe(timeout(1800000)).pipe(
      map((event: HttpEvent<any>) => {
        lastResponse = event;
      if (event instanceof HttpResponse) {
        // Loader set to True
        // this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.setLoading(false);
        }
        }
        return event;
      }),
      retry(1),
      catchError((error: HttpErrorResponse) => {
        // this.totalRequests--;
        errResponse = error;
        // Loader set to False
        if (this.totalRequests === 0) {
          this.loadingService.setLoading(false);
        }

        if (error && error['status'] !== 200) {
          // console.log(error ? error : '');
        }

        if (error && error.name && error.name.includes('TimeoutError')) {
          this.appConfig.error(error && error.message ? error.message : 'Timeout occurs');
          return throwError(error);
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
          // this.appConfig.logoutWhenAuthorized();
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
        if (error.status === 406) {
          this.openSessionTimeoutPopUp();
          return throwError(error);
        }
        if (error.status === 404) {
          console.log('er', error);
          if (error && error.error && error.error.FailureReason && !error.error.FailureReason.message.includes('yet to submit his/her profile')) {
            this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
              ? error.error.message : '404 Not found', '');
          } else {
            this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
              ? error.error.message : '404 Not found', '');  
          }
          return throwError(error);
        }
        if (error.status === 409) {
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '409 Conflict error', '');
          return throwError(error);
        }
        if (error.status === 405) {
          this.appConfig.error(error.error.FailureReason ? error.error.FailureReason.message : error.error.message
            ? error.error.message : '405 Method Not Allowed', '');
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
        // if (lastResponse.type === HttpEventType.Sent && !errResponse) {
          // last response type was 0, and we haven't received an error
          this.totalRequests--;
          if (this.totalRequests === 0) {
            this.loadingService.setLoading(false);
          }
        // }
      })
    );
  }

  openSessionTimeoutPopUp() {
    if (this.matdialog.openDialogs && this.matdialog.openDialogs.length > 0) return;
    this.matdialog.open(ShortlistBoxComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      panelClass: 'sessionAlertPopUp',
      disableClose: true,
      data: {
        expiration: true
      }
    });
  }
}
