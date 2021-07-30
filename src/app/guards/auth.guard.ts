import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';
import { CONSTANT } from '../constants/app-constants.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // For KYC submission page
  constructor(
    private appConfig: AppConfigService
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.appConfig.getLocalData('submit') != '1') {
      return true;
    }
    return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
  }


}
