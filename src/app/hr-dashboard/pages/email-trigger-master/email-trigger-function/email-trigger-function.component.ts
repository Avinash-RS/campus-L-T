import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef, OnDestroy } from '@angular/core';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper, MatDialog } from '@angular/material';
import { SelectedCandidateComponent } from './selected-candidate/selected-candidate.component';
import { ChooseTemplateComponent } from './choose-template/choose-template.component';
import { AppConfigService } from 'src/app/config/app-config.service';
import { Subscription } from 'rxjs';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { finalize } from 'rxjs/operators';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-email-trigger-function',
  templateUrl: './email-trigger-function.component.html',
  styleUrls: ['./email-trigger-function.component.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class EmailTriggerFunctionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @ViewChild('emailTriggerConfirmation', { static: false }) emailTriggerConfirmation: TemplateRef<any>;
  @ViewChild('emailContentConfirmation', { static: false }) emailContentConfirmation: TemplateRef<any>;
  @ViewChild(SelectedCandidateComponent, {static: false}) selectedCandidatesComponent: any;
  @ViewChild(ChooseTemplateComponent, {static: false}) ChooseTemplateComponent: any;
  stageWiseDetails_: any;
  stageData: any;
  loadSelectedCandidatesTrue: boolean;
  templateName: any;
  selectedCandidates: any = [];
  editEmailContentOption = false;
  cancelEditedContent = false;
  triggerEmailtoSelectedCandidatesSubscription: Subscription;
  joblist_id: any;
  refreshSubscription: Subscription;
  constructor(
    private dialog: MatDialog,
    private appConfig: AppConfigService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService
  ) {

  }

  ngOnInit() {
    this.refreshOndriveChangeRXJS();
  }

  ngAfterViewInit() {
      // Hack: Scrolls to top of Page after page view initialized
      let top = document.getElementById('top');
      if (top !== null) {
        top.scrollIntoView();
        top = null;
      }    
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_EMAIL_TRIGGER_FUNCTION)) {
        this.gotoStepBasedOnIndex(0);
      }
    });
  }

  onStepChange() {
    this.editEmailContentOption = false;
    this.cancelEditedContent = false;
    // console.log(this.stepper);
  }

  firstStagenext() {
    this.stageWiseDetails_ = {
      selectedCandidates: this.selectedCandidatesComponent.gridApi.getSelectedNodes() ? this.selectedCandidatesComponent.gridApi.getSelectedNodes() : [],
      selectedStageValue: this.selectedCandidatesComponent.selectedValue,
      stagesList: this.selectedCandidatesComponent.stagesList
    };
    if (this.stageWiseDetails_ && this.stageWiseDetails_.selectedCandidates.length > 0 && this.stageWiseDetails_.selectedStageValue) {
      this.stepper.selected.completed = true;
      this.stepper.next();
    } else {
      this.appConfig.warning('Please select candidates to proceed further');
    }
  }

  nextStage() {
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  backtoStage1() {
    this.stepper.previous();
  }

  gotoStepBasedOnIndex(event) {
    if (event == 0) {
      let length = 4;
      this.stepper.steps['_results'].forEach((element, i) => {
        if (i <= length) {
          element.completed = false;
        }
      });
      // this.stepper.selected.completed = true;
      this.stepper.selectedIndex = 0;
      this.loadSelectedCandidatesTrue = true;
    }
  }

  emailTriggerConfirmationPopup() {
    this.templateName = this.ChooseTemplateComponent.activeTemplate.template_name;
    this.selectedCandidates = this.selectedCandidatesComponent.gridApi.getSelectedNodes() ? this.selectedCandidatesComponent.gridApi.getSelectedNodes() : [];
    this.dialog.open(this.emailTriggerConfirmation, {
      width: '600px',
      height: 'auto',
      id: '2',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'form-confirmation-pop-up'
    }).beforeClosed().subscribe((res)=> {
      if (res) {
        this.triggerEmailtoSelectedCandidates();
      }
    });
  }

  triggerEmailtoSelectedCandidates() {
    let selectedCandidates = this.selectedCandidatesComponent.gridApi.getSelectedNodes() ? this.selectedCandidatesComponent.gridApi.getSelectedNodes() : [];
    let candidateIds = selectedCandidates.map((ele: any) => {
      return ele?.data?.user_id;
    });
    let apiData = {
      "candidate_ids": candidateIds,
      "stage_id": this.selectedCandidatesComponent?.selectedValue,
      "template_id" : this.ChooseTemplateComponent?.activeTemplate?.template_id,
      "subject_line" : this.ChooseTemplateComponent?.selectedSubject?.value,
      "body_content" : this.ChooseTemplateComponent?.htmlContent
    }
    this.triggerEmailtoSelectedCandidatesSubscription = this.adminService.triggerEmailtoSelectedCandidates(apiData).subscribe((res: any)=> {
      if (res?.joblist_id) {
        this.joblist_id = {
          joblist_id: res?.joblist_id,
          batch_job_id: res?.batch_job_id
        };
        this.nextStage();
      }
    }, (err) => {

    });
  }

  emailContentConfirmationPopup() {
    if (this.ChooseTemplateComponent?.htmlContent && this.ChooseTemplateComponent?.selectedSubject?.value) {
      this.dialog.open(this.emailContentConfirmation, {
        width: '600px',
        height: 'auto',
        id: '1',
        autoFocus: false,
        closeOnNavigation: true,
        disableClose: false,
        panelClass: 'form-confirmation-pop-up'
      }).afterClosed().subscribe((res)=> {
        if (res) {
          this.nextStage();
        }
      });  
    } else {
      this.appConfig.warning('Provide a valid email subject and body content');
    }

  }

  closeBox(id: any, message) {
    // this.matDialogRefTerms.
    let customDialog = this.dialog.getDialogById(id);
    customDialog.close(message);
  }

  emailTriggerConfirmationOk() {
    this.nextStage();
  }

  editContent() {
    this.editEmailContentOption = true;
  }

  ngOnDestroy() {
    this.triggerEmailtoSelectedCandidatesSubscription ? this.triggerEmailtoSelectedCandidatesSubscription.unsubscribe() : '';
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
  }

}
