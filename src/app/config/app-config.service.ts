import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NzMessageService, NzNotificationService, NzConfigService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';

// tslint:disable-next-line: class-name
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
    private ManualSpinner: NgxSpinnerService,
    private router: Router,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    private notification: NzNotificationService,
    public toast: ToastrService
  ) {
  }

  isWebrtc() {
    return localStorage.getItem('webrtc') && localStorage.getItem('webrtc') == 'true' ? true : false;
  }

  scrollToTop() {
    let pos = window.pageYOffset;
   return window.scrollTo(0, pos - 20); // how far to scroll on each step
   // return window.scrollTo(0,0);
  }

  success(val, title?: any) {
    this.toast.success(val);
  }

  error(val, title?: any) {
    this.toast.warning(val);
  }
  errorWithTitle(val, title?: any) {
    this.toast.warning(val, title);
  }

  warning(val) {
    this.toast.warning(val);
  }

  warningWithTitle(val, title) {
    this.toast.warning(val, title);
  }

   nzNotification(type: string, title: any, text: any): any {
     if (type == 'error') {
     return this.toast.warning(text, title);
     }
     if (type == 'success') {
     return this.toast.success(text, title);
     } else {
           this.notification.create(
      type,
      title,
      text,
      { nzDuration: 3000 }
    );
     }
}

  errorToast(val) {
    this.toast.error(val);
  }

  // get Current route
  currentRoute() {
    return this.router.url;
  }
  // Navigations
  routeNavigation(path: any) {
    return this.router.navigate([path]);
  }

  // Navigations with Param
  routeNavigationWithParam(path: any, param: any) {
    return this.router.navigate([path, param]);
  }

  // Navigations with query param only
  routeNavigationWithQueryParam(path: any, queryParam: any) {
    // console.log(queryParam);

    return this.router.navigate([path], { queryParams: queryParam });
  }

  // Navigations with Param and Query param
  routeNavigationWithQueryParamAndParam(path: any, param: any, queryParam: any) {
    return this.router.navigate([path, param], { queryParams: queryParam });
  }

  // Image Basu url
  imageBaseUrl() {
    return environment.Image_Base_Url;
  }


  // Show loading
  showLoader() {
    this.spinner.show(undefined, { color: '#fff', size: 'medium', bdColor: 'rgba(0, 0, 0, 0.3)', fullScreen: false, type: 'ball-elastic-dots' });
  }

  hideLoader() {
    this.spinner.hide();
  }

  // Show loading
  showLoaderManual() {
    // this.hideLoader();
    this.ManualSpinner.show(undefined, { color: '#fff', size: 'medium', bdColor: 'rgba(0, 0, 0, 0.3)', fullScreen: false, type: 'ball-elastic-dots' });
  }

  hideLoaderManual() {
    this.ManualSpinner.hide();
  }


  // NZ Zorro message
  nzsuccess(message: any, icon: any): void {
    this.message.success(message, {
      nzDuration: 3000
    });
  }
  // nzerror(message: any, icon: any): void {
  //   this.message.error(message, {
  //     nzDuration: 100000000
  //   });
  // }
  // FormError message
  nzformerror(message: any, icon: any): void {
    this.message.error('Please fill all the red highlighted fields to proceed further', {
      nzDuration: 3000
    });
  }

  // nzNotification(type: string, title: any, text: any): void {
  //   this.notification.create(
  //     type,
  //     title,
  //     text,
  //     { nzDuration: 3000 }
  //   );
  // }

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

  // To allow only numbers
  onKeypressOnlyNumberic(event: any) {
    const inputChar = event.target.value;
    const regExp = /[^ 0-9]/g;
    if (regExp.test(inputChar)) {
      event.target.value = inputChar.replace(regExp, '');
    }
  }

  // To allow only decimal Characters
  onKeypressOnlyDecimal(event: any) {
    const inputChar = event.target.value;
    const regExp = /[^ 0-9.]/g;
    if (regExp.test(inputChar)) {
      event.target.value = inputChar.replace(regExp, '');
    }
  }

  excelToJson(selectedTarget) {
    /* wire up file reader */
    const target: DataTransfer = (selectedTarget) as DataTransfer;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    let SavedData;
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      SavedData = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      // console.log('excel to json', SavedData);
    };
    reader.readAsBinaryString(target.files[0]);
    return SavedData;
  }

  helperVideo(comp, data) {
    this.openDialog(comp, data);
  }

  terms(comp, data) {
    this.openDialog(comp, data);
  }

  // AG grid common functions
  agGridWithAllFunc(){
  return {
    flex: 1,
    minWidth: 40,
    resizable: true,
    floatingFilter: true,
    filter:true,
    suppressSizeToFit: true,
    filterParams: {
      buttons: ['reset'],
    },
    };
   }

   agGridWithServerSideAllFunc(){
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
      floatingFilter: true,
      filter:true,
      suppressSizeToFit: true,
      filterParams: {
      suppressAndOrCondition: true,
      debounceMs: 1200,
      buttons: ['reset'],
      },
      };
     }

     agGridWithServerSideAllFuncWithRowGrouping(){
      return {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        resizable: true,
        filter: true,
        columnGroupShow: 'closed',
        flex: 1,
        minWidth: 200,
        floatingFilter: false,
        suppressSizeToFit: true,
        filterParams: {
        suppressAndOrCondition: true,
        debounceMs: 1200,
        buttons: ['reset'],
        },
      };
    }

   agGridwithoutfloatingFilter(){
    return {
      flex: 1,
      minWidth: 40,
      resizable: true,
      floatingFilter: false,
      filter:true,
      suppressSizeToFit: true,
      filterParams: {
        buttons: ['reset'],
      },
    };
     }



     // Ag-grid commom functions end


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
      // this.hideLoader();
      if (result) {
        // this.consoleLog('result', result);
      }
    });
  }

  logoutWhenAuthorized() {
    this.clearLocalData();
    this.clearSessionData();
    this.routeNavigation('/login');
  }

  getDriveName() {
    let driveList = this.getLocalData('driveList') ? JSON.parse(this.getLocalData('driveList')) : [];
    let driveId = this.getLocalData('driveId');
    let selectedDrive = driveList.find(drive => drive.drive_id == driveId);
    return selectedDrive ? selectedDrive.drive_name : '';
  }

  getSelectedDriveFormDetails() {
    let driveList = this.getLocalData('driveList') ? JSON.parse(this.getLocalData('driveList')) : [];
    let driveId = this.getLocalData('driveId');
    let selectedDrive = driveList.find(drive => drive.drive_id == driveId);
    let evaluationFormDetails = selectedDrive.config && selectedDrive.config.evaluation_form ? selectedDrive.config.evaluation_form : '';
    return evaluationFormDetails ? evaluationFormDetails : '';
  }

  getSelectedDrivePermissions() {
    let driveList = this.getLocalData('driveList') ? JSON.parse(this.getLocalData('driveList')) : [];
    let driveId = this.getLocalData('driveId');
    let selectedDrive = driveList.find(drive => drive.drive_id == driveId);
    let selectedDrivePermissions = selectedDrive.config && selectedDrive.config.drive_permissions ? selectedDrive.config.drive_permissions : '';
    return selectedDrivePermissions ? selectedDrivePermissions : '';
  }

  minImageSizeValidation(fileSize) {
    if(fileSize >= 10000) {
      return true;
    } else {
      this.nzNotification('error', 'Not Uploaded', 'Minimum file size is 10 KB');
      return false;
    }
  }

  downloadFile(path: any) {
    if (path) {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = path;
    link.download = path;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  } else {
    this.warning('URL not Found');
  }

  }
}

