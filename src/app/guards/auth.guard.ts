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
    if (this.appConfig.getLocalData('csrf-login')) {
      // this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.ADMIN_DASHBOARD.HOME}`);
      return true;
    }
    localStorage.clear();
    this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.HOME}`);
    return false;

  }


}
