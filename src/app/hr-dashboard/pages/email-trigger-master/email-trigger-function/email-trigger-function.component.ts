import { Component, OnInit } from '@angular/core';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-email-trigger-function',
  templateUrl: './email-trigger-function.component.html',
  styleUrls: ['./email-trigger-function.component.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class EmailTriggerFunctionComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {

  }
}
