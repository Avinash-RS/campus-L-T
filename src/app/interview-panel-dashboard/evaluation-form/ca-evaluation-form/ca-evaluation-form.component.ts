
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import SampleJson from '../../../../assets/files/ca_evaluation_form.json';
import { FormControl, FormGroup, FormBuilder, NgModel, Validators, FormArray } from '@angular/forms';
import * as myGlobals from '../../../custom-form-validators/validation';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace.js';
import { ApiServiceService } from 'src/app/services/api-service.service.js';
import { SharedServiceService } from 'src/app/services/shared-service.service.js';
import { ActivatedRoute } from '@angular/router';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

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
  selector: 'app-ca-evaluation-form',
  templateUrl: './ca-evaluation-form.component.html',
  styleUrls: ['./ca-evaluation-form.component.scss'],
  providers: [
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: { useUtc: true }
    },
  ],
})

export class CaEvaluationFormComponent implements OnInit {
@Input() candidateId;
@Input() nameOfAssessment;
@Input() uid;
@Input() status;
@Input() shortlist_name;
  intervieweeAttendance:any;
  Notattended: any;
  attendedStatusList: any;
  displayedColumns: string[] = ['name', 'veryGood', 'good', 'average', 'notSuitable'];
  assessments: PeriodicElement[] = SampleJson;
  dataSource: MatTableDataSource<PeriodicElement>;
  evaluationForm: FormGroup;
  getCandidateData: any;
  mastersList: any;
  expValidation = "^[a-zA-Z0-9 ]*";
  selectedPost: any;

  caform_isattendedorNot = 'attended';
  caform_NotattendedReason = 'notAttendedStatus';
  caform_selectedStatus = 'attendedStatus';
  caform_interview_date = 'interview_date';
  caform_interview_place = 'interview_place';
  caform_willing_work = 'willing_work';
  caform_physical_disability = 'physical_disability';
  caform_candidates_strenght = 'candidates_strenght';
  caform_candidates_weakness = 'candidates_weakness';
  caform_panel_member1 = 'panel_member1';
  caform_panel_member2 = 'panel_member2';
  caform_panel_member3 = 'panel_member3';
  caform_panel_member4 = 'panel_member4';
  caform_ps_no1 = 'ps_no1';
  caform_ps_no2 = 'ps_no2';
  caform_ps_no3 = 'ps_no3';
  caform_ps_no4 = 'ps_no4';
  caform_remarks = 'remarks';
  caform_overallAssessmentStatus = 'candidate_assesment';
  caform_appearance = 'appearance';
  caform_knowledgeExperience = 'knowledgeExperience';
  caform_communicationskillOrExpression = 'communicationskillOrExpression';
  caform_taskEffectiveness = 'taskEffectiveness';
  caform_applicationOfKnowledge = 'applicationOfKnowledge';
  caform_valuesIntegrity = 'valuesIntegrity';

  constructor(
    private formBuilder: FormBuilder,
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
  }

  get f() {
    return this.evaluationForm.controls;
  }

  ngOnInit() {
    this.getMasters();
    if (this.candidateId) {
      // this.getWorkExp();
      this.getEvaluationData(this.uid);
      this.nginitFunc();
      this.getCandidateDetails();
    }
  }

  getWorkExp() {
    const apiData = {
      user_id: this.candidateId
    };
    this.adminService.workExperienceList(apiData).subscribe((data: any)=> {
      //
      this.selectedPost = data?.selected_post && (data?.selected_post == 'get' || data?.selected_post == 'pget') ? true : false;
    });
  }

  getMasters() {
    // this.adminService.keyMastersList().subscribe((data: any)=> {
      this.mastersList = localStorage.getItem('masters') ? JSON.parse(localStorage.getItem('masters')) : '';
      this.intervieweeAttendance = this.mastersList?.intervieweeAttendance;
      this.attendedStatusList = this.mastersList?.AttendedStatus;
      this.Notattended = this.mastersList?.notAttendedStatus;
    // }, (err)=> {

    // });
  }
  getCandidateDetails() {
    const apiData = {
      uid: this.candidateId ? this.candidateId : '',
      shortlist_name: this.shortlist_name
    }
    this.adminService.getEvaluationDetails(apiData).subscribe((success: any) => {

      const data = success ? success : null;
      if (data) {
        this.evaluationForm.patchValue({
          [this.caform_isattendedorNot]: data && data[this.caform_isattendedorNot] ? data[this.caform_isattendedorNot] : null,
          [this.caform_NotattendedReason]: data && data[this.caform_NotattendedReason] ? data[this.caform_NotattendedReason] : null,
          [this.caform_selectedStatus]: data && data[this.caform_selectedStatus] ? data[this.caform_selectedStatus] : null,
          [this.caform_interview_date]: data && data[this.caform_interview_date] ? data[this.caform_interview_date] : null,
          [this.caform_interview_place]: data && data[this.caform_interview_place] ? data[this.caform_interview_place] : null,
          [this.caform_willing_work]: data && data[this.caform_willing_work] ? data[this.caform_willing_work] : null,
          [this.caform_physical_disability]: data && data[this.caform_physical_disability] ? data[this.caform_physical_disability] : null,
          [this.caform_candidates_strenght]: data && data[this.caform_candidates_strenght] ? data[this.caform_candidates_strenght] : null,
          [this.caform_candidates_weakness]: data && data[this.caform_candidates_weakness] ? data[this.caform_candidates_weakness] : null,
          [this.caform_panel_member1]: data && data[this.caform_panel_member1] ? data[this.caform_panel_member1] : null,
          [this.caform_panel_member2]: data && data[this.caform_panel_member2] ? data[this.caform_panel_member2] : null,
          [this.caform_panel_member3]: data && data[this.caform_panel_member3] ? data[this.caform_panel_member3] : null,
          [this.caform_panel_member4]: data && data[this.caform_panel_member4] ? data[this.caform_panel_member4] : null,
          [this.caform_ps_no1]: data && data[this.caform_ps_no1] ? data[this.caform_ps_no1] : null,
          [this.caform_ps_no2]: data && data[this.caform_ps_no2] ? data[this.caform_ps_no2] : null,
          [this.caform_ps_no3]: data && data[this.caform_ps_no3] ? data[this.caform_ps_no3] : null,
          [this.caform_ps_no4]: data && data[this.caform_ps_no4] ? data[this.caform_ps_no4] : null,
          [this.caform_remarks]: data && data[this.caform_remarks] ? data[this.caform_remarks] : null,
          [this.caform_overallAssessmentStatus]: data && data[this.caform_overallAssessmentStatus] ? data[this.caform_overallAssessmentStatus] : null,
          [this.caform_appearance]: data && data[this.caform_appearance] ? data[this.caform_appearance] : null,
          [this.caform_knowledgeExperience]: data && data[this.caform_knowledgeExperience] ? data[this.caform_knowledgeExperience] : null,
          [this.caform_communicationskillOrExpression]: data && data[this.caform_communicationskillOrExpression] ? data[this.caform_communicationskillOrExpression] : null,
          [this.caform_taskEffectiveness]: data && data[this.caform_taskEffectiveness] ? data[this.caform_taskEffectiveness] : null,
          [this.caform_applicationOfKnowledge]: data && data[this.caform_applicationOfKnowledge] ? data[this.caform_applicationOfKnowledge] : null,
          [this.caform_valuesIntegrity]: data && data[this.caform_valuesIntegrity] ? data[this.caform_valuesIntegrity] : null
        });
        this.assessments.forEach(element => {
          if (element['id'] === 1) {
            element['isChecked'] = data[this.caform_appearance] ? data[this.caform_appearance] : null
          }
          if (element['id'] === 2) {
            element['isChecked'] = data[this.caform_knowledgeExperience] ? data[this.caform_knowledgeExperience] : null
          }
          if (element['id'] === 3) {
            element['isChecked'] = data[this.caform_communicationskillOrExpression] ? data[this.caform_communicationskillOrExpression] : null
          }
          if (element['id'] === 4) {
            element['isChecked'] = data[this.caform_taskEffectiveness] ? data[this.caform_taskEffectiveness] : null
          }
          if (element['id'] === 5) {
            element['isChecked'] = data[this.caform_applicationOfKnowledge] ? data[this.caform_applicationOfKnowledge] : null
          }
          if (element['id'] === 6) {
            element['isChecked'] = data[this.caform_valuesIntegrity] ? data[this.caform_valuesIntegrity] : null
          }
        });
        this.statusChange({value: data[this.caform_isattendedorNot]});
        this.status != '2' ?  '' : this.evaluationForm.disable();
      } else {
        this.assessments.forEach((element: any) => {
          element.isChecked = 'false';
        });
        this.status != '2' ?  '' : this.evaluationForm.disable();
      }
    }, (err) => {

    })
  }

  getEvaluationData(cid) {
    const apiData = {
      id: cid
    };
    this.adminService.getEvaluationData(apiData).subscribe((data: any) => {

      this.getCandidateData = data[0];
    });
  }

  nginitFunc() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.assessments);
    this.evaluationForm = this.formBuilder.group({
      [this.caform_isattendedorNot]: new FormControl('', [Validators.required]),
      [this.caform_NotattendedReason]: new FormControl('', [Validators.required]),
      [this.caform_selectedStatus]: new FormControl('', [Validators.required]),
      [this.caform_interview_date]: new FormControl('', [Validators.required]),
      [this.caform_interview_place]: new FormControl('', [RemoveWhitespace.whitespace(), myGlobals.req, myGlobals.alphaNum30]),
      [this.caform_willing_work]: new FormControl('', [Validators.required]),
      [this.caform_physical_disability]: new FormControl('', [Validators.maxLength(50), myGlobals.alphaNum]),
      [this.caform_candidates_strenght]: ['', [Validators.maxLength(100), myGlobals.alphaNum]],
      [this.caform_candidates_weakness]: new FormControl('', [Validators.maxLength(100), myGlobals.alphaNum]),
      [this.caform_panel_member1]: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, myGlobals.alphaWithDots, Validators.maxLength(50)]),
      [this.caform_panel_member2]: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      [this.caform_panel_member3]: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      [this.caform_panel_member4]: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      [this.caform_ps_no1]: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(30), myGlobals.alphaNum]),
      [this.caform_ps_no2]: new FormControl('', [Validators.maxLength(30), myGlobals.alphaNum]),
      [this.caform_ps_no3]: new FormControl('', [Validators.maxLength(30), myGlobals.alphaNum]),
      [this.caform_ps_no4]: new FormControl('', [Validators.maxLength(30), myGlobals.alphaNum]),
      [this.caform_remarks]: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(100), myGlobals.alphaNum]),
      [this.caform_overallAssessmentStatus]: new FormControl('', [Validators.required]),
      [this.caform_appearance]: new FormControl(null, [Validators.required]),
      [this.caform_knowledgeExperience]: new FormControl(null, [Validators.required]),
      [this.caform_communicationskillOrExpression]: new FormControl(null, [Validators.required]),
      [this.caform_taskEffectiveness]: new FormControl(null, [Validators.required]),
      [this.caform_applicationOfKnowledge]: new FormControl(null, [Validators.required]),
      [this.caform_valuesIntegrity]: new FormControl(null, [Validators.required])
    });
    this.status != '2' ?  '' : this.evaluationForm.disable();
  }

  statusChange(status: any) {
    setTimeout(() => {
      if (status['value'] == '0') {
        this.evaluationForm['controls'][this.caform_NotattendedReason].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_NotattendedReason].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_panel_member1].setValidators([RemoveWhitespace.whitespace(), myGlobals.alphaWithDots, Validators.maxLength(50)]);
        this.evaluationForm['controls'][this.caform_panel_member1].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_ps_no1].setValidators([RemoveWhitespace.whitespace(), Validators.maxLength(30), myGlobals.alphaNum]);
        this.evaluationForm['controls'][this.caform_ps_no1].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_remarks].setValidators([RemoveWhitespace.whitespace(), Validators.maxLength(100), myGlobals.alphaNum]);
        this.evaluationForm['controls'][this.caform_remarks].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_selectedStatus].clearValidators();
        this.evaluationForm['controls'][this.caform_selectedStatus].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_interview_date].clearValidators();
        this.evaluationForm['controls'][this.caform_interview_date].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_willing_work].clearValidators();
        this.evaluationForm['controls'][this.caform_willing_work].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_overallAssessmentStatus].clearValidators();
        this.evaluationForm['controls'][this.caform_overallAssessmentStatus].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_appearance].clearValidators();
        this.evaluationForm['controls'][this.caform_appearance].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_knowledgeExperience].clearValidators();
        this.evaluationForm['controls'][this.caform_knowledgeExperience].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_communicationskillOrExpression].clearValidators();
        this.evaluationForm['controls'][this.caform_communicationskillOrExpression].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_taskEffectiveness].clearValidators();
        this.evaluationForm['controls'][this.caform_taskEffectiveness].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_applicationOfKnowledge].clearValidators();
        this.evaluationForm['controls'][this.caform_applicationOfKnowledge].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_valuesIntegrity].clearValidators();
        this.evaluationForm['controls'][this.caform_valuesIntegrity].updateValueAndValidity();
      } else {
        this.evaluationForm['controls'][this.caform_NotattendedReason].clearValidators();
        this.evaluationForm['controls'][this.caform_NotattendedReason].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_panel_member1].setValidators([RemoveWhitespace.whitespace(), Validators.required, myGlobals.alphaWithDots, Validators.maxLength(50)]);
        this.evaluationForm['controls'][this.caform_panel_member1].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_ps_no1].setValidators([RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(30), myGlobals.alphaNum]);
        this.evaluationForm['controls'][this.caform_ps_no1].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_remarks].setValidators([RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(100), myGlobals.alphaNum]);
        this.evaluationForm['controls'][this.caform_remarks].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_selectedStatus].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_selectedStatus].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_interview_date].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_interview_date].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_willing_work].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_willing_work].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_overallAssessmentStatus].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_overallAssessmentStatus].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_appearance].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_appearance].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_knowledgeExperience].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_knowledgeExperience].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_communicationskillOrExpression].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_communicationskillOrExpression].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_taskEffectiveness].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_taskEffectiveness].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_applicationOfKnowledge].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_applicationOfKnowledge].updateValueAndValidity();

        this.evaluationForm['controls'][this.caform_valuesIntegrity].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.caform_valuesIntegrity].updateValueAndValidity();
      }
    }, 100);

  }

  get isattendedorNot() {
    return this.evaluationForm.get(this.caform_isattendedorNot);
  }
  get NotattendedReason() {
    return this.evaluationForm.get(this.caform_NotattendedReason);
  }
  get selectedStatus() {
    return this.evaluationForm.get(this.caform_selectedStatus);
  }
  get interview_date() {
    return this.evaluationForm.get(this.caform_interview_date);
  }
  get interview_place() {
    return this.evaluationForm.get(this.caform_interview_place);
  }
  get willing_work() {
    return this.evaluationForm.get(this.caform_willing_work);
  }
  get physical_disability() {
    return this.evaluationForm.get(this.caform_physical_disability);
  }
  get candidates_strenght() {
    return this.evaluationForm.get(this.caform_candidates_strenght);
  }
  get candidates_weakness() {
    return this.evaluationForm.get(this.caform_candidates_weakness);
  }
  get panel_member1() {
    return this.evaluationForm.get(this.caform_panel_member1);
  }
  get panel_member2() {
    return this.evaluationForm.get(this.caform_panel_member2);
  }
  get panel_member3() {
    return this.evaluationForm.get(this.caform_panel_member3);
  }
  get panel_member4() {
    return this.evaluationForm.get(this.caform_panel_member4);
  }
  get ps_no1() {
    return this.evaluationForm.get(this.caform_ps_no1);
  }
  get ps_no2() {
    return this.evaluationForm.get(this.caform_ps_no2);
  }
  get ps_no3() {
    return this.evaluationForm.get(this.caform_ps_no3);
  }
  get ps_no4() {
    return this.evaluationForm.get(this.caform_ps_no4);
  }
  get remarks() {
    return this.evaluationForm.get(this.caform_remarks);
  }
  get overallAssessmentStatus() {
    return this.evaluationForm.get(this.caform_overallAssessmentStatus);
  }
  get appearance() {
    return this.evaluationForm.get(this.caform_appearance);
  }
  get knowledgeExperience() {
    return this.evaluationForm.get(this.caform_knowledgeExperience);
  }
  get communicationskillOrExpression() {
    return this.evaluationForm.get(this.caform_communicationskillOrExpression);
  }
  get taskEffectiveness() {
    return this.evaluationForm.get(this.caform_taskEffectiveness);
  }
  get applicationOfKnowledge() {
    return this.evaluationForm.get(this.caform_applicationOfKnowledge);
  }
  get valuesIntegrity() {
    return this.evaluationForm.get(this.caform_valuesIntegrity);
  }


  setAssessmentLevel(assessment, value) {
    this.assessments[this.assessments.indexOf(assessment)] = {
      ...assessment,
      level: value
    };
    if (assessment['id'] == 6) {
      this.evaluationForm.patchValue({
        [this.caform_valuesIntegrity]: value
      });
    }
    if (assessment['id'] == 5) {
      this.evaluationForm.patchValue({
        [this.caform_applicationOfKnowledge]: value
      });
    }
    if (assessment['id'] == 4) {
      this.evaluationForm.patchValue({
        [this.caform_taskEffectiveness]: value
      });
    }
    if (assessment['id'] == 3) {
      this.evaluationForm.patchValue({
        [this.caform_communicationskillOrExpression]: value
      });
    }
    if (assessment['id'] == 2) {
      this.evaluationForm.patchValue({
        [this.caform_knowledgeExperience]: value
      });
    }
    if (assessment['id'] == 1) {
      this.evaluationForm.patchValue({
        [this.caform_appearance]: value
      });
    }
  }

  submitEvaluationForm() {
    if (this.evaluationForm.valid) {
      const data = {
        evaluation: 'submit'
      };
      this.openDialog(ShortlistBoxComponent, data);
    } else {
      this.validateAllFields(this.evaluationForm);
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
    }
  }

  submitEvaluationFormAPI() {
    const dateInterview = this.evaluationForm.value[this.caform_interview_date] ? moment(this.evaluationForm.value[this.caform_interview_date]).format('YYYY-MM-DD') : '';
    let formData = this.evaluationForm.getRawValue();
    formData[this.caform_interview_date] = dateInterview;
    formData.uid = this.uid ? this.uid : '';
    formData.shortlist_name = this.shortlist_name ? this.shortlist_name : '';
    const apiData = formData;
    console.log('apiDataRequest', apiData);
    // {
    //   uid: this.uid ? this.uid : '',
    //   shortlist_name: this.shortlist_name ? this.shortlist_name : '',
    //   interview_date: dateInterview,
    //   notAttendedStatus: this.evaluationForm.value.notAttendedStatus,
    //   attendedStatus: this.evaluationForm.value.attendedStatus,
    //   attended: this.evaluationForm.value.attended,
    //   interview_place: this.evaluationForm.value.interview_place,
    //   depth_knowledge: this.evaluationForm.value.depth_knowledge,
    //   breadth_knowledge: this.evaluationForm.value.breadth_knowledge,
    //   thought_clarity: this.evaluationForm.value.thought_clarity,
    //   communicate_ability: this.evaluationForm.value.communicate_ability,
    //   personal_skill: this.evaluationForm.value.personal_skill,
    //   personality: this.evaluationForm.value.personality,
    //   personality_1: this.evaluationForm.value.personality_1,
    //   curricular_activites: this.evaluationForm.value.curricular_activites,
    //   candidate_assesment: this.evaluationForm.value.ASSESSMENT,
    //   physical_disability: this.evaluationForm.value.physical_disability,
    //   willing_work: this.evaluationForm.value.willing_work,
    //   candidates_strenght: this.evaluationForm.value.candidates_strenght,
    //   candidates_weakness: this.evaluationForm.value.candidates_weakness,
    //   panel_member1: this.evaluationForm.value.panel_member1,
    //   panel_member2: this.evaluationForm.value.panel_member2,
    //   panel_member3: this.evaluationForm.value.panel_member3,
    //   panel_member4: this.evaluationForm.value.panel_member4,
    //   ps_no1: this.evaluationForm.value.ps_no1,
    //   ps_no2: this.evaluationForm.value.ps_no2,
    //   ps_no3: this.evaluationForm.value.ps_no3,
    //   ps_no4: this.evaluationForm.value.ps_no4,
    //   topic_given: this.evaluationForm.value.topic_given,
    //   thought: this.evaluationForm.value.thought,
    //   content: this.evaluationForm.value.content,
    //   language: this.evaluationForm.value.language,
    //   idea: this.evaluationForm.value.idea,
    //   clues: this.evaluationForm.value.clues,
    //   time_taken: this.evaluationForm.value.time_taken,
    //   remarks: this.evaluationForm.value.remarks
    // };

    // this.adminService.postEvaluationCandidateData(apiData).subscribe((res: any) => {

    //   this.appConfig.success('Evaluation completed successfully', '');
    //   this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST);
    // }, (err) => {

    // });

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
