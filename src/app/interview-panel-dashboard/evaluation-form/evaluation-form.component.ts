import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import SampleJson from '../../../assets/files/evaluationData.json';
import { FormControl, FormGroup, FormBuilder, NgModel, Validators, FormArray } from '@angular/forms';
import * as myGlobals from '../../custom-form-validators/validation';
export interface PeriodicElement {
  id: number;
  name: string;
  level: number;
  veryGood: string;
  good: string;
  acceptable: string;
  notSuitable: string;
}

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss']
})

export class EvaluationFormComponent implements OnInit {
  displayedColumns: string[] = ['name', 'veryGood', 'good', 'acceptable', 'notSuitable'];
  assessments: PeriodicElement[] = SampleJson;
  dataSource: MatTableDataSource<PeriodicElement>;
  evaluationForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }
  get f() {
    return this.evaluationForm.controls;
  }

  ngOnInit() {
    console.log(SampleJson);
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.assessments);
    this.evaluationForm = this.formBuilder.group({
      dateofInterview: new FormControl(''),
      placeofInterview: new FormControl(''),
      willingToWorkAtSite: new FormControl('') ,
      physicalDisability: new FormControl(''),
      candidateStrengths: ['', myGlobals.textVal],
      candidateWeaknesses: new FormControl(''),
      panelMember1: new FormControl(''),
      panelMember2: new FormControl(''),
      panelMember3: new FormControl(''),
      panelMember4: new FormControl(''),
      PS_NO_OF_panelmember1: new FormControl(''),
      PS_NO_OF_panelmember2: new FormControl(''),
      PS_NO_OF_panelmember3: new FormControl(''),
      PS_NO_OF_panelmember4: new FormControl(''),
      topicGiven: new FormControl(''),
      clarityOfThought: new FormControl(''),
      logicalOrganisation: new FormControl(''),
      commandOverLanguage: new FormControl(''),
      ideaGeneration: new FormControl(''),
      non_verbal_cues: new FormControl(''),
      timeTaken: new FormControl(''),
      overallRemarks: new FormControl(''),

       });
  }

  setAssessmentLevel(assessment, value) {
    console.log(assessment, value);
    this.assessments[this.assessments.indexOf(assessment)] = {
      ...assessment,
      level: value
    };
  }
  panelOverall(value) {
    console.log(value);
  }
  evaluation() {
    console.log(this.evaluationForm);
  }
}
