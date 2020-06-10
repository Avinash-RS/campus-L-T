import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';
import { CONSTANT } from '../constants/app-constants.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private appConfig: AppConfigService
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') == 'administrator') {
      console.log('ad');

      // this.appConfig.routeNavigation(`${CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.HOME}`);
      return true;
    }
    if (!this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') == 'candidate') {
      console.log('ca');
      // this.appConfig.routeNavigation(`${CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE}`);
      return true;
    }
    if (!this.appConfig.getLocalData('csrf-login')) {
      localStorage.clear();
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
      return false;
    }

  }


}
