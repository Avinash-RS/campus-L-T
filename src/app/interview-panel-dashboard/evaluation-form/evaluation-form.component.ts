import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import SampleJson from '../../../assets/files/evaluationData.json';
import { FormControl, FormGroup, FormBuilder, NgModel, Validators, FormArray } from '@angular/forms';
import * as myGlobals from '../../custom-form-validators/validation';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
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
    console.log(SampleJson);
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.assessments);
    this.evaluationForm = this.formBuilder.group({
      interview_date: new FormControl(''),
      interview_place: new FormControl(''),
      willing_work: new FormControl(''),
      physical_disability: new FormControl(''),
      candidates_strenght: ['', myGlobals.textVal],
      candidates_weakness: new FormControl(''),
      panel_member1: new FormControl(''),
      panel_member2: new FormControl(''),
      panel_member3: new FormControl(''),
      panel_member4: new FormControl(''),
      ps_no1: new FormControl(''),
      ps_no2: new FormControl(''),
      ps_no3: new FormControl(''),
      ps_no4: new FormControl(''),
      topic_given: new FormControl(''),
      thought: new FormControl(''),
      content: new FormControl(''),
      language: new FormControl(''),
      idea: new FormControl(''),
      clues: new FormControl(''),
      time_taken: new FormControl(''),
      remarks: new FormControl(''),
      ASSESSMENT: new FormControl(''),
      depth_knowledge: new FormControl(''),
      uid: '1091'
    });
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
    console.log(this.evaluationForm.value);
    this.adminService.postEvaluationCandidateData(this.evaluationForm.value).subscribe((res: any) => {
      this.appConfig.hideLoader();
      console.log(res);
    });
  }

}
