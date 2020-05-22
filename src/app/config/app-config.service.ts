import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

export interface modalBox {
  iconName: string;
  dataToBeShared: any;
  showCancel: any;
  showConfirm: any;
  showOk: any;
}
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  public IsWait = false;

  constructor(
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  // get Current route
  currentRoute() {
   return this.router.url;
  }
  // Navigations
  routeNavigation(path: any) {
    return this.router.navigate([path]);
  }

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: modalBox;

    dialogDetails = {
      iconName: data.iconName,
      showCancel: data.showCancel,
      showConfirm: data.showConfirm,
      showOk: data.showOk,
      dataToBeShared: data.sharedData,
    };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consoleLog('result', result);
      }
    });
  }

  // Navigations with Param
  routeNavigationWithParam(path: any, param: any) {
    return this.router.navigate([path, param]);
  }

  // Navigations with query param only
  routeNavigationWithQueryParam(path: any, queryParam: any) {
    return this.router.navigate([path], { queryParams: queryParam });
  }

  // Navigations with Param and Query param
  routeNavigationWithQueryParamAndParam(path: any, param: any, queryParam: any) {
    return this.router.navigate([path, param], { queryParams: queryParam });
  }



  // Show loading
  showLoader() {
    this.spinner.show(undefined, { color: '#fff', size: 'medium', bdColor: 'rgba(0, 0, 0, 0.7)', fullScreen: true, type: 'ball-elastic-dots' });
  }

  hideLoader() {
    this.spinner.hide();
  }

  // To show success Snack Bar Message
  success(message: any, icon: any) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 1500,
      verticalPosition: 'top',
      data: { message, icon },
      panelClass: ['success-bg-color']
    });
  }

  // To show error Snack Bar Message
  error(message: any, icon: any) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 1500,
      verticalPosition: 'top',
      data: { message, icon },
      panelClass: ['warn-bg-color']
    });
  }

  // To get a local storage value
  getLocalData(key: string): any {
    return localStorage.getItem(key);
  }

  // To get a Session storage value
  getSessionData(key: string): any {
    return sessionStorage.getItem(key);
  }

  // To set localstorage key and value
  setLocalData(key: string, value: any): any {
    return localStorage.setItem(key, value);
  }

  // To set sessionstorage key and value
  setSessionData(key: string, value: any): any {
    return sessionStorage.setItem(key, value);
  }

  // Clear local and session data
  clearLocalDataOne(key) {
    return localStorage.removeItem(key);
  }
  // Clear local and session data
  clearLocalData() {
    return localStorage.clear();
  }

  // Clear local and session data
  clearSessionData() {
    return sessionStorage.clear();
  }

  // To print logs
  consoleLog(optional?: any, printText?: any) {
    if (environment) {
      console.log(optional ? optional : null, printText ? printText : null);
    }
  }

  // To print error logs
  errorLog(optional?: any, printText?: any) {
    if (environment) {
      console.log(optional ? optional : null, printText ? printText : null);
    }
  }

  // To allow only Alphabetic Characters
  onKeypressOnlyAlphabetic(event: any) {
    const inputChar = event.target.value;
    const regExp = /[^ a-zA-Z]/g;
    if (regExp.test(inputChar)) {
      event.target.value = inputChar.replace(regExp, '');
    }
  }

  // To allow only AlphaNumeric Characters
  onKeypressOnlyAlphaNumeric(event: any) {
    const inputChar = event.target.value;
    const regExp = /[^ a-zA-Z0-9]/g;
    if (regExp.test(inputChar)) {
      event.target.value = inputChar.replace(regExp, '');
    }
  }

  // To allow only Alphabetic Characters
  onKeypressOnlyNumberic(event: any) {
    const inputChar = event.target.value;
    const regExp = /[^ 0-9]/g;
    if (regExp.test(inputChar)) {
      event.target.value = inputChar.replace(regExp, '');
    }
  }

  // To allow only Alphabetic Characters
  onKeypressOnlyDecimal(event: any) {
    const inputChar = event.target.value;
    const regExp = /[^ 0-9.]/g;
    if (regExp.test(inputChar)) {
      event.target.value = inputChar.replace(regExp, '');
    }
  }

}
