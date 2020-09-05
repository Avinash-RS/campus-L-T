import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { MatDialog } from '@angular/material';
import { KycSnackbarComponent } from 'src/app/shared/kyc-snackbar/kyc-snackbar.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Injectable({
  providedIn: 'root'
})
export class KycAccessGuard implements CanActivate {
  constructor(
    private appConfig: AppConfigService,
    private matDialog: MatDialog,
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: any = route['url'].toString();
    this.appConfig.showLoader();
    // Route to education
    if (url === 'personal') {
      if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
        const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
        const localData = 'clearAllTouched';
        this.openDialog(data, localData, url);
      } else {
        this.appConfig.hideLoader();
        return true;
      }
    }
    // Route to education
    if (url === 'education') {
      if (this.appConfig.getLocalData('field_isformsubmitted') === 'true') {
        if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
          const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
          this.openDialog(data, 'personalFormTouched', url);
        } else {
          this.appConfig.hideLoader();
          return true;
        }

        // Starting first time submit conditions
      } else {
        if (this.appConfig.getLocalData('personalFormSubmitted') === 'true') {
          if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
            const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
            this.openDialog(data, 'personalFormTouched', url);
          } else {
            this.appConfig.hideLoader();
            return true;
          }
        } else {
          this.appConfig.hideLoader();
          this.appConfig.nzNotification('error', 'Not Submitted', 'Please click "Continue" button to proceed further');
          return false;
        }
      }
    }

    // Route to education
    if (url === 'family') {
      if (this.appConfig.getLocalData('field_isformsubmitted') === 'true') {
        if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
          const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
          this.openDialog(data, 'educationalFormTouched', url);
        } else {
          this.appConfig.hideLoader();
          return true;
        }
        // Starting first time submit conditions
      } else {
        if (this.appConfig.getLocalData('personalFormSubmitted') === 'true' && this.appConfig.getLocalData('educationalFormSubmitted') === 'true') {
          if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
            const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
            this.openDialog(data, 'educationalFormTouched', url);
          } else {
            this.appConfig.hideLoader();
            return true;
          }
        } else {
          this.appConfig.hideLoader();
          this.appConfig.nzNotification('error', 'Not Submitted', 'Please click "Continue" button to proceed further');
          return false;
        }
      }
    }

    // Route to family
    if (url === 'general') {
      if (this.appConfig.getLocalData('field_isformsubmitted') === 'true') {
        if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
          const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
          this.openDialog(data, 'familyFormTouched', url);
        } else {
          this.appConfig.hideLoader();
          return true;
        }
        // Starting first time submit conditions
      } else {
        if (this.appConfig.getLocalData('personalFormSubmitted') === 'true' && this.appConfig.getLocalData('educationalFormSubmitted') === 'true' && this.appConfig.getLocalData('familyFormSubmitted') === 'true') {
          if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
            const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
            this.openDialog(data, 'familyFormTouched', url);
          } else {
            this.appConfig.hideLoader();
            return true;
          }
        } else {
          this.appConfig.hideLoader();
          this.appConfig.nzNotification('error', 'Not Submitted', 'Please click "Continue" button to proceed further');
          return false;
        }
      }
    }

    // Route to family
    if (url === 'view') {
      if (this.appConfig.getLocalData('field_isformsubmitted') === 'true') {
        if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
          const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
          this.openDialog(data, 'generalFormTouched', url);
        } else {

          this.appConfig.hideLoader();
          return true;
        }
        // Starting first time submit conditions
      } else {
        if (this.appConfig.getLocalData('personalFormSubmitted') === 'true' && this.appConfig.getLocalData('educationalFormSubmitted') === 'true' && this.appConfig.getLocalData('familyFormSubmitted') === 'true' && this.appConfig.getLocalData('generalFormSubmitted') === 'true') {
          if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
            const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
            this.openDialog(data, 'generalFormTouched', url);
          } else {
            this.appConfig.hideLoader();
            return true;
          }
        } else {
          this.appConfig.hideLoader();
          this.appConfig.nzNotification('error', 'Not Submitted', 'Please click "Continue" button to proceed further');
          return false;
        }
      }
    }

    // Route to family
    if (url === 'confirm') {
      if (this.appConfig.getLocalData('field_isformsubmitted') === 'true') {
        if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
          const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
          this.openDialog(data, 'generalFormTouched', url);
        } else {
          this.appConfig.hideLoader();
          return true;
        }
        // Starting first time submit conditions
      } else {
        if (this.appConfig.getLocalData('personalFormSubmitted') === 'true' && this.appConfig.getLocalData('educationalFormSubmitted') === 'true' && this.appConfig.getLocalData('familyFormSubmitted') === 'true' && this.appConfig.getLocalData('generalFormSubmitted') === 'true') {
          if (this.appConfig.getLocalData('personalFormTouched') || this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('familyFormTouched') || this.appConfig.getLocalData('generalFormTouched')) {
            const data = 'If you have made any changes, please click "Continue" or your changes will be lost.';
            this.openDialog(data, 'generalFormTouched', url);
          } else {
            this.appConfig.hideLoader();
            return true;
          }
        } else {
          this.appConfig.hideLoader();
          this.appConfig.nzNotification('error', 'Not Submitted', 'Please click "Continue" button to proceed further');
          return false;
        }
      }
    }
    this.appConfig.hideLoader();
  }



  // Open dailog
  openDialog(data, touchedForm, route) {
    let dialogDetails: any;

    dialogDetails = {
      message: data,
    };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(KycSnackbarComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // if (touchedForm !== 'clearAllTouched') {
        //   this.appConfig.clearLocalDataOne(touchedForm);
        // } else {
        this.appConfig.clearLocalDataOne('personalFormTouched');
        this.appConfig.clearLocalDataOne('educationalFormTouched');
        this.appConfig.clearLocalDataOne('familyFormTouched');
        this.appConfig.clearLocalDataOne('generalFormTouched');
        // }

        this.appConfig.routeNavigation(`${CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE}/${route}`);
        this.appConfig.hideLoader();
        return true;
      } else {
        this.appConfig.hideLoader();
        return false;
      }
    });
    return true;
  }

}
