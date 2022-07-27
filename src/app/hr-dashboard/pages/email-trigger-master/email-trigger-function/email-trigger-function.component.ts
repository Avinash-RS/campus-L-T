import { Component, OnInit, ViewChildren, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';
import { SelectedCandidateComponent } from './selected-candidate/selected-candidate.component';

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
  @ViewChild(SelectedCandidateComponent, {static: false}) selectedCandidatesComponent: any;
  stageWiseDetails: any;
  stageData: any;
  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    
  }

  firstStagenext() {
    this.stageWiseDetails = {
      selectedCandidates: this.selectedCandidatesComponent.gridApi.getSelectedNodes() ? this.selectedCandidatesComponent.gridApi.getSelectedNodes() : [],
      selectedStageValue: this.selectedCandidatesComponent.selectedValue,
      stagesList: this.selectedCandidatesComponent.stagesList
    };
    if (this.stageWiseDetails && this.stageWiseDetails.selectedCandidates.length > 0 && this.stageWiseDetails.selectedStageValue) {
      this.stepper.next();
    }
  }

  nextClickEmitter() {

  }
}
