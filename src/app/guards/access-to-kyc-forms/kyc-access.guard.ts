import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class KycAccessGuard implements CanActivate {
  constructor(
    private appConfig: AppConfigService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: any = route['url'].toString();
    console.log('Url:' + url);

    // Route to education
    if (url === 'education') {
      if (this.appConfig.getLocalData('submitted')) {
        return true;
      } else {
        if (this.appConfig.getLocalData('personalFormSubmitted') === 'true') {
          if (this.appConfig.getLocalData('personalFormTouched')) {
            this.appConfig.nzNotification('error', 'Not Submitted', 'touched');
            return false;
          }
          return true;
        } else {

          this.appConfig.nzNotification('error', 'Not Submitted', 'Please click save and continue button to proceed further');
          return false;
        }
      }
    }

    // Route to education
    if (url === 'family') {
      if (this.appConfig.getLocalData('submitted')) {
        return true;
      } else {
        if (this.appConfig.getLocalData('personalFormSubmitted') === 'true' && this.appConfig.getLocalData('educationalFormSubmitted') === 'true') {
          if (this.appConfig.getLocalData('educationalFormTouched') || this.appConfig.getLocalData('personalFormTouched')) {
            this.appConfig.nzNotification('error', 'Not Submitted', 'touched');
            return false;
          }
          return true;
        } else {
          this.appConfig.nzNotification('error', 'Not Submitted', 'Please click save and continue button to proceed further');
          return false;
        }
      }
    }

    // Route to family
    if (url === 'general') {
      if (this.appConfig.getLocalData('submitted')) {
        return true;
      } else {
        if (this.appConfig.getLocalData('personalFormSubmitted') === 'true' && this.appConfig.getLocalData('educationalFormSubmitted') === 'true' && this.appConfig.getLocalData('familyFormSubmitted') === 'true') {
          return true;
        } else {
          this.appConfig.nzNotification('error', 'Not Submitted', 'Please click save and continue button to proceed further');
          return false;
        }
      }
    }

    // Route to family
    if (url === 'view') {
      if (this.appConfig.getLocalData('submitted')) {
        return true;
      } else {
        if (this.appConfig.getLocalData('personalFormSubmitted') === 'true' && this.appConfig.getLocalData('educationalFormSubmitted') === 'true' && this.appConfig.getLocalData('familyFormSubmitted') === 'true' && this.appConfig.getLocalData('generalFormSubmitted') === 'true') {
          return true;
        } else {
          this.appConfig.nzNotification('error', 'Not Submitted', 'Please click save and continue button to proceed further');
          return false;
        }
      }
    }

    // return false;
  }

}
