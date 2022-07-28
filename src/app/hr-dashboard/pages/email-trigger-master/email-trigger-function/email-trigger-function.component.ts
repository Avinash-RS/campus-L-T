import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper, MatDialog } from '@angular/material';
import { SelectedCandidateComponent } from './selected-candidate/selected-candidate.component';
import { ChooseTemplateComponent } from './choose-template/choose-template.component';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: 'app-email-trigger-function',
  templateUrl: './email-trigger-function.component.html',
  styleUrls: ['./email-trigger-function.component.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class EmailTriggerFunctionComponent implements OnInit, AfterViewInit {
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
  constructor(
    private dialog: MatDialog,
    private appConfig: AppConfigService
  ) {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    
  }

  onStepChange() {
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
        this.nextStage();
      }
    });

  }

  emailContentConfirmationPopup() {
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

  }

  closeBox(id: any, message) {
    // this.matDialogRefTerms.
    let customDialog = this.dialog.getDialogById(id);
    customDialog.close(message);
  }

  emailTriggerConfirmationOk() {
    this.nextStage();
  }

}
