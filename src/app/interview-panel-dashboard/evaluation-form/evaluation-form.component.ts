import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import SampleJson from '../../../assets/files/evaluationData1.json';
import { FormControl, FormGroup, FormBuilder, NgModel, Validators, FormArray } from '@angular/forms';
import * as myGlobals from '../../custom-form-validators/validation';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace.js';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component.js';
import { ApiServiceService } from 'src/app/services/api-service.service.js';
import { SharedServiceService } from 'src/app/services/shared-service.service.js';
import { ActivatedRoute } from '@angular/router';
export interface PeriodicElement {
  id: number;
  name: string;
  level: number;
  veryGood: string;
  good: string;
  average: string;
  notSuitable: string;
}

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss']
})

export class EvaluationFormComponent implements OnInit {
  displayedColumns: string[] = ['name', 'excellent', 'veryGood', 'good', 'average', 'notSuitable', 'comments'];
  assessments: PeriodicElement[] = SampleJson['tab'];
  dataSource: MatTableDataSource<PeriodicElement>;
  dataSource1: MatTableDataSource<PeriodicElement>;
  dataSource2: MatTableDataSource<PeriodicElement>;
  dataSource3: MatTableDataSource<PeriodicElement>;
  dataSource4: MatTableDataSource<PeriodicElement>;
  evaluationForm: FormGroup;
  getCandidateData: any;
  candidateId: any;
  constructor(
    private formBuilder: FormBuilder,
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
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
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.assessments);
    this.dataSource1 = new MatTableDataSource<PeriodicElement>(SampleJson['tab1']);
    this.dataSource2 = new MatTableDataSource<PeriodicElement>(SampleJson['tab2']);
    this.dataSource3 = new MatTableDataSource<PeriodicElement>(SampleJson['tab3']);
    this.dataSource4 = new MatTableDataSource<PeriodicElement>(SampleJson['tab4']);
    this.evaluationForm = this.formBuilder.group({
      interview_date: new FormControl('', [Validators.required]),
      interview_place: new FormControl('', [RemoveWhitespace.whitespace(), myGlobals.req, myGlobals.alphaNum30]),
      willing_work: new FormControl('', [Validators.required]),
      physical_disability: new FormControl('', [Validators.maxLength(50)]),
      candidates_strenght: ['', [Validators.maxLength(100)]],
      candidates_weakness: new FormControl('', [Validators.maxLength(100)]),
      panel_member1: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, myGlobals.alphaWithDots, Validators.maxLength(50)]),
      panel_member2: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      panel_member3: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      panel_member4: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      ps_no1: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(30)]),
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
      depth_knowledge: new FormControl('', [Validators.required]),
      breadth_knowledge: new FormControl('', [Validators.required]),
      communicate_ability: new FormControl('', [Validators.required]),
      personal_skill: new FormControl('', [Validators.required]),
      personality: new FormControl('', [Validators.required]),
      curricular_activites: new FormControl('', [Validators.required]),
      thought_clarity: new FormControl('', [Validators.required]),
    });
  }

  get interview_date() {
    return this.evaluationForm.get('interview_date');
  }

  get depth_knowledge() {
    return this.evaluationForm.get('depth_knowledge');
  }
  get breadth_knowledge() {
    return this.evaluationForm.get('breadth_knowledge');
  }
  get communicate_ability() {
    return this.evaluationForm.get('communicate_ability');
  }
  get personal_skill() {
    return this.evaluationForm.get('personal_skill');
  }
  get personality() {
    return this.evaluationForm.get('personality');
  }
  get curricular_activites() {
    return this.evaluationForm.get('curricular_activites');
  }
  get thought_clarity() {
    return this.evaluationForm.get('thought_clarity');
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
    this.assessments[this.assessments.indexOf(assessment)] = {
      ...assessment,
      level: value
    };
    if (assessment['id'] == 7) {
      this.evaluationForm.patchValue({
        curricular_activites: value
      });
      this.evaluationForm.value.curricular_activites = value;
    }
    if (assessment['id'] == 6) {
      this.evaluationForm.patchValue({
        personality: value
      });
      this.evaluationForm.value.personality = value;
    }
    if (assessment['id'] == 5) {
      this.evaluationForm.patchValue({
        personal_skill: value
      });
      this.evaluationForm.value.personal_skill = value;
    }
    if (assessment['id'] == 4) {
      this.evaluationForm.patchValue({
        communicate_ability: value
      });
      this.evaluationForm.value.communicate_ability = value;
    }
    if (assessment['id'] == 3) {
      this.evaluationForm.patchValue({
        thought_clarity: value
      });
      this.evaluationForm.value.thought_clarity = value;
    }
    if (assessment['id'] == 2) {
      this.evaluationForm.patchValue({
        breadth_knowledge: value
      });
      this.evaluationForm.value.breadth_knowledge = value;
    }
    if (assessment['id'] == 1) {
      this.evaluationForm.patchValue({
        depth_knowledge: value
      });
      this.evaluationForm.value.depth_knowledge = value;
    }
  }
  getEvaluationData() {
    const apiData = {
      id: '2689'
    };
    this.adminService.getEvaluationData(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.getCandidateData = data[0];
    });
  }

  submitEvaluationForm() {
    if (this.evaluationForm.valid) {
      const data = {
        evaluation: 'submit'
      };
      this.openDialog(ShortlistBoxComponent, data);
    } else {
      this.validateAllFields(this.evaluationForm);
    }
  }

  submitEvaluationFormAPI() {
    const apiData =
      [
        {
          uid: this.candidateId ? '2689' : '2689',
          interview_date: this.evaluationForm.value.interview_date,
          interview_place: this.evaluationForm.value.interview_place,
          depth_knowledge: this.evaluationForm.value.depth_knowledge,
          breadth_knowledge: this.evaluationForm.value.breadth_knowledge,
          thought_clarity: this.evaluationForm.value.thought_clarity,
          communicate_ability: this.evaluationForm.value.communicate_ability,
          personal_skill: this.evaluationForm.value.personal_skill,
          personality: this.evaluationForm.value.personality,
          curricular_activites: this.evaluationForm.value.curricular_activites,
          candidate_assesment: this.evaluationForm.value.ASSESSMENT,
          physical_disability: this.evaluationForm.value.physical_disability,
          willing_work: this.evaluationForm.value.willing_work,
          candidates_strenght: this.evaluationForm.value.candidates_strenght,
          candidates_weakness: this.evaluationForm.value.candidates_weakness,
          panel_member1: this.evaluationForm.value.panel_member1,
          panel_member2: this.evaluationForm.value.panel_member2,
          panel_member3: this.evaluationForm.value.panel_member3,
          panel_member4: this.evaluationForm.value.panel_member4,
          ps_no1: this.evaluationForm.value.ps_no1,
          ps_no2: this.evaluationForm.value.ps_no2,
          ps_no3: this.evaluationForm.value.ps_no3,
          ps_no4: this.evaluationForm.value.ps_no4,
          topic_given: this.evaluationForm.value.topic_given,
          thought: this.evaluationForm.value.thought,
          content: this.evaluationForm.value.content,
          language: this.evaluationForm.value.language,
          idea: this.evaluationForm.value.idea,
          clues: this.evaluationForm.value.clues,
          time_taken: this.evaluationForm.value.time_taken,
          remarks: this.evaluationForm.value.remarks
        }
      ];
    this.adminService.postEvaluationCandidateData(this.evaluationForm.value).subscribe((res: any) => {
      this.appConfig.hideLoader();

    }, (err) => {

    });

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

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitEvaluationFormAPI();
      }
    });
  }


}
