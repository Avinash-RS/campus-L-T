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
    this.statusOfForms();
    this.openPopupRequest();
    this.activeSelectorRxJs();
    this.stepperStatus();
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
     this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
    }
    if (clickedStep == 'contact') {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
    }
    if (clickedStep == 'dependent') {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
    }
    if (clickedStep == 'education') {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
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
      
      this.requestnavigationRoute = route;
      this.openMatDialog();
    });
  }

  ngOnDestroy() {
    this.openJoiningRoutePopUpSubscribe.unsubscribe();
  }
}
