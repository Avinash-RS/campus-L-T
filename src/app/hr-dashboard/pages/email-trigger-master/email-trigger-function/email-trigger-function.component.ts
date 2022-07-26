import { Component, OnInit, ViewChildren, ViewChild, TemplateRef } from '@angular/core';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-email-trigger-function',
  templateUrl: './email-trigger-function.component.html',
  styleUrls: ['./email-trigger-function.component.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class EmailTriggerFunctionComponent implements OnInit {
  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  stageClick: any;
  stageData: any;
  constructor() {

  }

  ngOnInit() {

  }

  next(stage) {
    if (stage == 'first') {
      this.stageClick = 1;
    }
    if (stage == 'second') {
      this.stageClick = 1;
    }
  }

  nextClickEmitter(event) {
    console.log('event', event);
    setTimeout(() => {
      if (event.stage == 'first') {
        this.stageClick = this.stageClick ? null : this.stageClick;
        this.stageData = event.data;
        this.firststage(this.stageData);
      }
    }, 0);
    console.log('event', event);
  }

  firststage(data) {
    console.log('stage', data);
    if (data.length > 0) {
      this.stepper.next();
    }
  }
}
