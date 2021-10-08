import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-joining-form',
  templateUrl: './joining-form.component.html',
  styleUrls: ['./joining-form.component.scss']
})
export class JoiningFormComponent implements OnInit, OnDestroy {

  @ViewChild('matDialog', {static: false}) matDialogRef: TemplateRef<any>;
  openJoiningRoutePopUpSubscribe: Subscription;
  joiningFormStepperStatusSubscribe: Subscription;
  joiningFormActiveSelectorSubscribe: Subscription;
  activeStep: any = 'personal';
  valid = {
    personal: true,
    contact: false,
    dependent: false,
    education: false,
    work: false,
    upload: false,
    preview: false,
    submit: false,
    tillPersonal() {
      this.personal = true;
      this.contact = false;
      this.dependent = false;
      this.education = false;
      this.work = false;
      this.upload = false;
      this.preview = false;
      this.submit = false;
      },
      tillContact() {
        this.personal = true;
        this.contact = false;
        this.dependent = false;
        this.education = false;
        this.work = false;
        this.upload = false;
        this.preview = false;
        this.submit = false;
        },
      tilldependent() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = false;
      this.work = false;
      this.upload = false;
      this.preview = false;
      this.submit = false;
    },
    tilleducation() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = false;
      this.upload = false;
      this.preview = false;
      this.submit = false;
    },
    tillwork() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.upload = false;
      this.preview = false;
      this.submit = false;
    },
    tillupload() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.upload = true;
      this.preview = false;
      this.submit = false;
    },
    tillpreview() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.upload = true;
      this.preview = true;
      this.submit = false;
    },
    tillsbmit() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.upload = true;
      this.preview = true;
      this.submit = true;
    }
  }

  routingSelection: any;
  requestnavigationRoute: any;
  noSave: boolean;
  hideStepper: boolean = true;
  redirectToPreview: boolean;
  constructor(
    private appConfig: AppConfigService,
    public candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private dialog: MatDialog,
  ) {
    const subWrapperMenus = null;
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }


  ngOnInit() {
    this.removeLocalStorage();
    this.statusOfForms();
    this.openPopupRequest();
    this.activeSelectorRxJs();
    this.stepperStatus();
  }

  removeLocalStorage() {
    this.appConfig.clearLocalDataOne('kycForm');
    this.appConfig.clearLocalDataOne('KYCAPI');
  }
  activeSelectorRxJs() {
    this.joiningFormActiveSelectorSubscribe = this.sharedService.joiningFormActiveSelector.pipe(delay(0)).subscribe((data: any)=> {
      let datas = this.candidateService.getLocalsection_flags();
      // if (datas && datas[data] == '1') {
        this.routingSelection = null;
        this.routingSelection = data ? data : this.routingSelection;
      // } else {
      //   this.statusOfForms();
      // }
    });
  }

  stepperStatus() {
   this.joiningFormStepperStatusSubscribe = this.sharedService.joiningFormStepperStatus.subscribe((data: any)=> {
      if (data == 'dataFromMasterDashboard') {
        this.statusOfForms();
      } else {
        this.statusOfForms('data');
      }
    });
  }

  checkFormSubmitted() {
    if (this.appConfig.getLocalData('joiningFormAccess') == 'true') {
      this.hideStepper = this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().submitted == '1' ? true : false;
     return this.redirectToPreview = false;
    }
    if (this.appConfig.getLocalData('form_submmited') == 'false' && this.appConfig.getLocalData('isKYCNotExempted') == 'false') {
      this.hideStepper = this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().submitted == '1' ? true : false;
     return this.redirectToPreview = false;
    } else {
      if (this.appConfig.getLocalData('secondShortlist') == 'true' || this.appConfig.getLocalData('firstShortlist') == 'true') {
        this.redirectToPreview = true;
        this.hideStepper = true;
    } else {
      this.redirectToPreview = false;
      this.hideStepper = false;
    }
  }
  }

  statusOfForms(param?: any) {
    if (this.candidateService.getLocalProfileData()) {
      let data = this.candidateService.getLocalsection_flags();
      this.checkFormSubmitted();
      if ((data && data.submitted == '1') || this.redirectToPreview) {
        this.valid.tillsbmit();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
        return this.activeStep = 'preview';
      }

      if (data && data.previewed == '1') {
        this.valid.tillpreview();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_SUBMIT);
        return this.activeStep = 'submit';
      }

      if (data && data.document_details == '1') {
        this.valid.tillupload();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
        return this.activeStep = 'preview';
      }

      if (data && data.experience_details == '1') {
          this.valid.tillwork();
          param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
          return this.activeStep = 'upload';
      }

      if (data && data.education_details == '1') {
        this.valid.tilleducation();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_WORK);
        return this.activeStep = 'work';
      }

      if (data && data.dependent_details == '1') {
        this.valid.tilldependent();
       param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
       return this.activeStep = 'education';//, this.routingSelection = param ? param : 'education';
      }
      if (data && data.contact_details == '1') {
        this.valid.tillContact();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
        return this.activeStep = 'dependent';
      }
      if (data && data.personal_details == '1') {
        this.valid.tillPersonal();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
        return this.activeStep = 'contact';//, this.routingSelection = param ? param : 'contact';
      }
      else {
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
        return this.activeStep = 'personal';//, this.routingSelection = param ? param : 'personal';
      }
    } else {
      let apiData = {
        form_name: 'joining',
        section_name: ''
      }
      this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
        this.candidateService.saveAllProfileToLocal(data);
        this.sharedService.joiningFormDataPassing.next();
        this.statusOfForms();
      });
    }
  }

  validCheck(clickedStep) {

    if (clickedStep == 'personal') {
      if (this.routingSelection != 'personal') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL}
        this.sharedService.StepperNavigationCheck.next(data);
      }
    //  this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
    }
    if (clickedStep == 'contact') {
      if (this.routingSelection != 'contact') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
    }
    if (clickedStep == 'dependent') {
      if (this.routingSelection != 'dependent') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
    }
    if (clickedStep == 'education') {
      if (this.routingSelection != 'education') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
    }
    if (clickedStep == 'work') {
      if (this.routingSelection != 'work') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_WORK}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
    }
    if (clickedStep == 'upload') {
      if (this.routingSelection != 'upload') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
    }
    if (clickedStep == 'preview') {
      if (this.routingSelection != 'preview') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
    }
    if (clickedStep == 'submit') {
      if (this.routingSelection != 'submit') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_SUBMIT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
    }
  }

  openMatDialog() {
    const dialogRef = this.dialog.open(this.matDialogRef, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForForms'
    });
  }

  closeDialog(e) {
    this.dialog.closeAll();
    this.sendPopUpResultTo(e);
  }

  sendPopUpResultTo(result) {
    if (result == 'save' || result == 'cancel') {
      let data = {
        result,
        route: this.requestnavigationRoute
      }

     return this.sharedService.sendPopupResult.next(data);
    } else {
      return this.appConfig.routeNavigation(this.requestnavigationRoute);
    }
  }

  openPopupRequest() {
    this.openJoiningRoutePopUpSubscribe = this.sharedService.openJoiningRoutePopUp.subscribe((route: any)=> {
      this.noSave = false;
      this.requestnavigationRoute = route;
      this.noSave = this.checkSaveOption(route) == true ? true : false;
      this.openMatDialog();
    });
  }

  checkSaveOption(route) {
    if (this.activeStep == 'personal') {
      if (route.includes('contact')) {
        return true;
      }
    }
    if (this.activeStep == 'contact') {
      if (route.includes('dependent')) {
        return true;
      }
    }
    if (this.activeStep == 'dependent') {
      if (route.includes('education')) {
        return true;
      }
    }
    if (this.activeStep == 'education') {
      if (route.includes('work')) {
        return true;
      }
    }
    if (this.activeStep == 'work') {
      if (route.includes('upload')) {
        return true;
      }
    }
    if (this.activeStep == 'upload') {
      if (route.includes('preview')) {
        return true;
      }
    }
    if (this.activeStep == 'preview') {
      if (route.includes('submit')) {
        return true;
      }
    }
  }
  ngOnDestroy() {
    this.openJoiningRoutePopUpSubscribe ? this.openJoiningRoutePopUpSubscribe.unsubscribe() : '';
    this.joiningFormStepperStatusSubscribe ? this.joiningFormStepperStatusSubscribe.unsubscribe() : '';
    this.joiningFormActiveSelectorSubscribe ? this.joiningFormActiveSelectorSubscribe.unsubscribe() : '';
  }
}
