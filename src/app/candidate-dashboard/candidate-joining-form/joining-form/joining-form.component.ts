import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-joining-form',
  templateUrl: './joining-form.component.html',
  styleUrls: ['./joining-form.component.scss']
})
export class JoiningFormComponent implements OnInit, OnDestroy {

  @ViewChild('matDialog', {static: false}) matDialogRef: TemplateRef<any>;
  openJoiningRoutePopUpSubscribe: Subscription;
  activeStep: any = 'personal';
  valid = {
    personal: true,
    contact: false,
    dependent: false,
    education: false,
    upload: false,
    preview: false,
    submit: false,
    tillPersonal() {
      this.personal = true;
      this.contact = false;
      this.dependent = false;
      this.education = false;
      this.upload = false;
      this.preview = false;
      this.submit = false;
      },
      tillContact() {
        this.personal = true;
        this.contact = false;
        this.dependent = false;
        this.education = false;
        this.upload = false;
        this.preview = false;
        this.submit = false;
        },
      tilldependent() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = false;
      this.upload = false;
      this.preview = false;
      this.submit = false;
    }
  }

  routingSelection: any;
  requestnavigationRoute: any;
  noSave: boolean;
  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
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
    this.appConfig.clearLocalDataOne('educationalFormSubmitted');
    this.appConfig.clearLocalDataOne('personalFormSubmitted');
    this.appConfig.clearLocalDataOne('confirmClick');
    this.appConfig.clearLocalDataOne('field_isformsubmitted');
    this.appConfig.clearLocalDataOne('familyFormSubmitted');
    this.appConfig.clearLocalDataOne('confirmFormSubmitted');
    this.appConfig.clearLocalDataOne('KYCAPI');
    this.appConfig.clearLocalDataOne('generalFormSubmitted');
  }
  activeSelectorRxJs() {
    this.sharedService.joiningFormActiveSelector.subscribe((data: any)=> {
      this.routingSelection = data ? data : this.routingSelection;
    });
  }

  stepperStatus() {
    this.sharedService.joiningFormStepperStatus.subscribe((data: any)=> {
      this.statusOfForms('noRouting');
    });
  }

  statusOfForms(param?: any) {
    this.candidateService.FormStatus().subscribe((data: any)=> {
      data?.personal_details == '1' ? this.appConfig.setLocalData('personal', '1') : this.appConfig.setLocalData('personal', '0');
      data?.contact_details == '1' ? this.appConfig.setLocalData('contact', '1') : this.appConfig.setLocalData('contact', '0');
      data?.dependent_details == '1' ? this.appConfig.setLocalData('dependent', '1') : this.appConfig.setLocalData('dependent', '0');
      data?.education_details == '1' ? this.appConfig.setLocalData('education', '1') : this.appConfig.setLocalData('education', '0');
      data?.upload_details == '1' ? this.appConfig.setLocalData('upload', '1') : this.appConfig.setLocalData('upload', '0');
      data?.preview_details == '1' ? this.appConfig.setLocalData('preview', '1') : this.appConfig.setLocalData('preview', '0');
      if (data.dependent_details == '1') {
        this.valid.tilldependent();
       param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
       return this.activeStep = 'education', this.routingSelection = 'education';
      }
      if (data.contact_details == '1') {
        this.valid.tillContact();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
        return this.activeStep = 'dependent', this.routingSelection = 'dependent';
      }
      if (data.personal_details == '1') {
        this.valid.tillPersonal();        
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
        return this.activeStep = 'contact', this.routingSelection = 'contact';
      }
      else {
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
        return this.activeStep = 'personal', this.routingSelection = 'personal';
      }
    });
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
    
    // array.forEach(element => {
      
    // });
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
      
    // }
    for (const property in this.valid) {

      // console.log(`${property}: ${this.valid[property]}`);
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
    this.openJoiningRoutePopUpSubscribe.unsubscribe();
  }
}
