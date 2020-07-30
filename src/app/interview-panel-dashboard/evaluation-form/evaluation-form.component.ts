import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import SampleJson from '../../../assets/files/evaluationData.json';
import { FormControl, FormGroup, FormBuilder, NgModel, Validators, FormArray } from '@angular/forms';
import * as myGlobals from '../../custom-form-validators/validation';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace.js';
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
  getCandidateData: any;
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
  ) {
    this.getEvaluationData();
  }
  get f() {
    return this.evaluationForm.controls;
  }

  ngOnInit() {
    this.nginitFunc();
  }

  nginitFunc() {
    console.log(SampleJson);
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.assessments);
    this.evaluationForm = this.formBuilder.group({
      interview_date: new FormControl(''),
      interview_place: new FormControl('', [RemoveWhitespace.whitespace(), myGlobals.req, myGlobals.alphaNum30]),
      willing_work: new FormControl('', [Validators.required]),
      physical_disability: new FormControl('', [Validators.maxLength(50)]),
      candidates_strenght: ['', [Validators.maxLength(100)]],
      candidates_weakness: new FormControl('', [Validators.maxLength(100)]),
      panel_member1: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      panel_member2: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      panel_member3: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      panel_member4: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      ps_no1: new FormControl('', [Validators.maxLength(30)]),
      ps_no2: new FormControl('', [Validators.maxLength(30)]),
      ps_no3: new FormControl('', [Validators.maxLength(30)]),
      ps_no4: new FormControl('', [Validators.maxLength(30)]),
      topic_given: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(100)]),
      thought: new FormControl('', [Validators.maxLength(100)]),
      content: new FormControl('', [Validators.maxLength(100)]),
      language: new FormControl('', [Validators.maxLength(100)]),
      idea: new FormControl('', [Validators.maxLength(100)]),
      clues: new FormControl('', [Validators.maxLength(100)]),
      time_taken: new FormControl('', [Validators.maxLength(30)]),
      remarks: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(100)]),
      ASSESSMENT: new FormControl('', [Validators.required]),
      depth_knowledge: new FormControl(''),
      uid: '1091'
    });
  }

  get interview_place() {
    return this.evaluationForm.get('interview_place');
  }
  get candidates_strenght() {
    return this.evaluationForm.get('candidates_strenght');
  }
  get candidates_weakness() {
    return this.evaluationForm.get('candidates_weakness');
  }

  setAssessmentLevel(assessment, value) {
    console.log(assessment);
    this.assessments[this.assessments.indexOf(assessment)] = {
      ...assessment,
      level: value
    };
    this.evaluationForm.value.depth_knowledge = value;
    this.evaluationForm.value.breadth_knowledge = value;
    this.evaluationForm.value.communicate_ability = value;
    this.evaluationForm.value.personal_skill = value;
    this.evaluationForm.value.personality = value;
    this.evaluationForm.value.curricular_activites = value;
    this.evaluationForm.value.thought_clarity = value;

  }
  getEvaluationData() {
    const apiData = {
      id: '2689'
    };
    this.adminService.getEvaluationData(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      console.log('data', data);
      this.getCandidateData = data[0];
    });
  }

  submitEvaluationForm() {
    if (this.evaluationForm.valid) {
      console.log(this.evaluationForm.value);
      this.adminService.postEvaluationCandidateData(this.evaluationForm.value).subscribe((res: any) => {
        this.appConfig.hideLoader();
        console.log(res);
      });
    } else {
      this.validateAllFields(this.evaluationForm);
    }
  }

  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

}
