import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';
import { CONSTANT } from '../constants/app-constants.service';
import { CandidateMappersService } from '../services/candidate-mappers.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // For KYC submission page
  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.appConfig.getLocalData('joiningFormAccess') == 'true' && this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().submitted != '1') {
      return true;
    }
    if ((this.appConfig.getLocalData('secondShortlist') == 'false' && this.appConfig.getLocalData('firstShortlist') == 'false')) {
      return true;
    }
    if ((this.appConfig.getLocalData('form_submmited') == 'false' && this.appConfig.getLocalData('isKYCNotExempted') == 'false')) {
      return true;
    }
    return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
  }


}
