import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-joining-submit',
  templateUrl: './joining-submit.component.html',
  styleUrls: ['./joining-submit.component.scss']
})
export class JoiningSubmitComponent implements OnInit, AfterViewInit, OnDestroy {

  checkFormValidRequest: Subscription;
  userName: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService
  ) {
  }

  ngOnInit() {
    if (this.appConfig.getLocalData('joiningFormAccess') == 'true' && this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().submitted == '1') {
      this.appConfig.setLocalData('form_submmited', 'true');
      this.appConfig.setLocalData('secondShortlist', 'true');
      this.appConfig.setLocalData('firstShortlist', 'true');
    }
    this.checkFormValidRequestFromRxjs();
    this.getUserName();
  }

  getUserName() {
    this.userName = this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : 'Guest';
  }

  upperCase(e) {
    return e.replace(e[0], e[0].toUpperCase());
  }

  ngAfterViewInit() {
    this.showStepper();
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('submit');
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any)=> {
      if(data.current == 'submit') {
        return this.appConfig.routeNavigation(data.goto);
      }
    });
  }

ngOnDestroy() {
  this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
}
}
