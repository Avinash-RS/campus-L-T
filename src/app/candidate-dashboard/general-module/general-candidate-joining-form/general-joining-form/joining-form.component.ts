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
export class GeneralJoiningFormComponent implements OnInit, OnDestroy {

  @ViewChild('matDialog', {static: false}) matDialogRef: TemplateRef<any>;
  openJoiningRoutePopUpSubscribe: Subscription;
  joiningFormStepperStatusSubscribe: Subscription;
  joiningFormActiveSelectorSubscribe: Subscription;
  activeStep: any = 'personal';
  showJoiningForm: boolean;
  role = this.appConfig.getLocalData('roles');
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
    this.statusOfForms();
    this.openPopupRequest();
    this.activeSelectorRxJs();
    this.stepperStatus();
    this.checkJoiningComponentNeeded();
  }

  activeSelectorRxJs() {
    this.joiningFormActiveSelectorSubscribe = this.sharedService.joiningFormActiveSelector.pipe(delay(0)).subscribe((data: any)=> {
      this.hideStepper = this.appConfig.getLocalData('isEditAllowed') == 'true' ? false : true;
      let datas = this.candidateService.getLocalsection_flags();
        this.routingSelection = null;
        this.routingSelection = data ? data : this.routingSelection;
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
    this.hideStepper = this.appConfig.getLocalData('isEditAllowed') == 'true' ? false : true;
    if (this.appConfig.getLocalData('joiningFormAccess') == 'true') {
      return this.redirectToPreview = false;
    }
    if (this.appConfig.getLocalData('joiningFormAccess') != 'true' && this.appConfig.getLocalData('isEditAllowed') == 'true') {
      return this.redirectToPreview = false;
    }
     else {
      this.redirectToPreview = false;
    }
  }

  statusOfForms(param?: any) {
    if (this.candidateService.getLocalProfileData()) {
      let data = this.candidateService.getLocalsection_flags();
      this.checkFormSubmitted();
      if ((data && data.submitted == '1') || this.redirectToPreview) {
        this.valid.tillsbmit();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW);
        return this.activeStep = 'preview';
      }

      if (data && data.previewed == '1') {
        this.valid.tillpreview();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_SUBMIT);
        return this.activeStep = 'submit';
      }
      if (data && data.personal_details == '0') {
        this.valid.tillPersonal();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL);
        return this.activeStep = 'personal';//, this.routingSelection = param ? param : 'contact';
      }
      if (data && data.contact_details == '0') {
        this.valid.tillContact();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT);
        return this.activeStep = 'contact';
      }
      if (data && data.dependent_details == '0') {
        this.valid.tilldependent();
       param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT);
       return this.activeStep = 'dependent';//, this.routingSelection = param ? param : 'education';
      }
      if (data && data.education_details == '0') {
        this.valid.tilleducation();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
        return this.activeStep = 'education';
      }
      if (data && data.experience_details == '0') {
          this.valid.tillwork();
          param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK);
          return this.activeStep = 'work';
      }
      if (data && data.document_details == '0') {
        this.valid.tillupload();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
        return this.activeStep = 'upload';
      }
      else {
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW);
        return this.activeStep = 'preview';//, this.routingSelection = param ? param : 'personal';
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
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL}
        this.sharedService.StepperNavigationCheck.next(data);
      }
    //  this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL);
    }
    if (clickedStep == 'contact') {
      if (this.routingSelection != 'contact') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT);
    }
    if (clickedStep == 'dependent') {
      if (this.routingSelection != 'dependent') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT);
    }
    if (clickedStep == 'education') {
      if (this.routingSelection != 'education') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'work') {
      if (this.routingSelection != 'work') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'upload') {
      if (this.routingSelection != 'upload') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'preview') {
      if (this.routingSelection != 'preview') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'submit') {
      if (this.routingSelection != 'submit') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_SUBMIT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
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

  // Configuration for candidate role
  checkJoiningComponentNeeded() {
  if (this.appConfig.getLocalData('joiningFormAccess') && this.appConfig.getLocalData('joiningFormAccess') === 'true') {
    this.showJoiningForm = true;
  }
  }

  isPermissionGranted() {
    let selectedDrivePermissions = this.appConfig.getSelectedDriveDetails();
    return selectedDrivePermissions && selectedDrivePermissions.candidateStatus && selectedDrivePermissions.candidateStatus.interviewSchedule == '1' ? true : false;
    return true;
  }

  ngOnDestroy() {
    this.openJoiningRoutePopUpSubscribe ? this.openJoiningRoutePopUpSubscribe.unsubscribe() : '';
    this.joiningFormStepperStatusSubscribe ? this.joiningFormStepperStatusSubscribe.unsubscribe() : '';
    this.joiningFormActiveSelectorSubscribe ? this.joiningFormActiveSelectorSubscribe.unsubscribe() : '';
  }
}
