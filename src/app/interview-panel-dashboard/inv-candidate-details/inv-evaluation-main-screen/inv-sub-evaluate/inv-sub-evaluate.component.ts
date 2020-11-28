import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import SampleJson from '../../../../../assets/files/evaluationData.json';
import * as myGlobals from '../../../../custom-form-validators/validation';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service.js';
import * as _moment from 'moment';
import moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

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
  selector: 'app-inv-sub-evaluate',
  templateUrl: './inv-sub-evaluate.component.html',
  styleUrls: ['./inv-sub-evaluate.component.scss'],
  providers: [
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: { useUtc: true }
    },
  ],
})
export class InvSubEvaluateComponent implements OnInit {
  displayedColumns: string[] = ['name', 'veryGood', 'good', 'acceptable', 'notSuitable'];
  assessments: PeriodicElement[] = SampleJson;
  dataSource: MatTableDataSource<PeriodicElement>;
  evaluationForm: FormGroup;
  getCandidateData: any;
  candidateId: any;
  nameOfAssessment: any;
  uid:any;
  expValidation = "^[a-zA-Z0-9 ]*";
  constructor(
    private formBuilder: FormBuilder,
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    const subWrapperMenus = [
      {
        icon: 'work.svg',
        name: 'Assigned candidates',
        router: CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST,
        data: `${this.activatedRoute.queryParams['_value']['data']}`,
        active: true
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);

    this.editRouteParamGetter();
  }
  get f() {
    return this.evaluationForm.controls;
  }

  ngOnInit() {
  }

  getCandidateDetails() {
    const apiData = {
      uid: this.candidateId ? this.candidateId : ''
    }
    this.adminService.getEvaluationDetails(apiData).subscribe((success: any)=> {
      this.appConfig.hideLoader();
      const data = success && success.length > 0 ? success[0] : null;
      if (data) {        
        
      this.evaluationForm.patchValue({
        interview_date: data['interview_date'] ? data['interview_date'] : '',
        interview_place: data['interview_place'] ? data['interview_place'] : '',
        willing_work: data['willing_work'] ? data['willing_work'] : '',
        physical_disability: data['physical_disability'] ? data['physical_disability'] : '',
        candidates_strenght: data['candidates_strenght'] ? data['candidates_strenght'] : '',
        candidates_weakness: data['candidates_weakness'] ? data['candidates_weakness'] : '',
        panel_member1: data['panel_member1'] ? data['panel_member1'] : '',
        panel_member2: data['panel_member2'] ? data['panel_member2'] : '',
        panel_member3: data['panel_member3'] ? data['panel_member3'] : '',
        panel_member4: data['panel_member4'] ? data['panel_member4'] : '',
        ps_no1: data['ps_no1'] ? data['ps_no1'] : '',
        ps_no2: data['ps_no2'] ? data['ps_no2'] : '',
        ps_no3: data['ps_no3'] ? data['ps_no3'] : '',
        ps_no4: data['ps_no4'] ? data['ps_no4'] : '',
        topic_given: data['topic_given'] ? data['topic_given'] : '',
        thought: data['thought'] ? data['thought'] : '',
        content: data['content'] ? data['content'] : '',
        language: data['language'] ? data['language'] : '',
        idea: data['idea'] ? data['idea'] : '',
        clues: data['clues'] ? data['clues'] : '',
        time_taken: data['time_taken'] ? data['time_taken'] : '',
        remarks: data['remarks'] ? data['remarks'] : '',
        ASSESSMENT: data['candidate_assesment'] ? data['candidate_assesment'] : '',
        depth_knowledge: data['depth_knowledge'] ? data['depth_knowledge'] : '',
        breadth_knowledge: data['breadth_knowledge'] ? data['breadth_knowledge'] : '',
        communicate_ability: data['communicate_ability'] ? data['communicate_ability'] : '',
        personal_skill: data['personal_skill'] ? data['personal_skill'] : '',
        personality: data['personality'] ? data['personality'] : '',
        personality_1: data['personality_1'] ? data['personality_1'] : '',
        curricular_activites: data['curricular_activites'] ? data['curricular_activites'] : '',
        thought_clarity: data['thought_clarity'] ? data['thought_clarity'] : ''
      })
    this.assessments.forEach(element => {
     if (element['id'] === 1) {
       element['isChecked'] = data['depth_knowledge'] ? data['depth_knowledge'] : null
     } 
     if (element['id'] === 2) {
      element['isChecked'] = data['breadth_knowledge'] ? data['breadth_knowledge'] : null
    } 
    if (element['id'] === 3) {
      element['isChecked'] = data['thought_clarity'] ? data['thought_clarity'] : null
    } 
    if (element['id'] === 4) {
      element['isChecked'] = data['communicate_ability'] ? data['communicate_ability'] : null
    } 
    if (element['id'] === 5) {
      element['isChecked'] = data['personal_skill'] ? data['personal_skill'] : null
    } 
    if (element['id'] === 6) {
      element['isChecked'] = data['personality'] ? data['personality'] : null
    } 
    if (element['id'] === 8) {
      element['isChecked'] = data['personality_1'] ? data['personality_1'] : null
    } 
    if (element['id'] === 7) {
      element['isChecked'] = data['curricular_activites'] ? data['curricular_activites'] : null
    } 
    });
  }

    }, (err)=> {

    })
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.candidateId = params['uid'];
      this.uid = params['uid'];
      this.getEvaluationData(this.uid);
      this.nginitFunc();
      this.getCandidateDetails();
    });
  }

  getEvaluationData(cid) {
    const apiData = {
      id: cid
    };
    this.adminService.getEvaluationData(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.getCandidateData = data[0];
    });
  }

  nginitFunc() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.assessments);
    this.evaluationForm = this.formBuilder.group({
      interview_date: new FormControl('', [Validators.required]),
      interview_place: new FormControl('', [RemoveWhitespace.whitespace(), myGlobals.req, myGlobals.alphaNum30]),
      willing_work: new FormControl('', [Validators.required]),
      physical_disability: new FormControl('', [Validators.maxLength(50), myGlobals.alphaNum]),
      candidates_strenght: ['', [Validators.maxLength(100), myGlobals.alphaNum]],
      candidates_weakness: new FormControl('', [Validators.maxLength(100), myGlobals.alphaNum]),
      panel_member1: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, myGlobals.alphaWithDots, Validators.maxLength(50)]),
      panel_member2: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      panel_member3: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      panel_member4: new FormControl('', [myGlobals.alphaWithDots, Validators.maxLength(50)]),
      ps_no1: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(30), myGlobals.alphaNum]),
      ps_no2: new FormControl('', [Validators.maxLength(30), myGlobals.alphaNum]),
      ps_no3: new FormControl('', [Validators.maxLength(30), myGlobals.alphaNum]),
      ps_no4: new FormControl('', [Validators.maxLength(30), myGlobals.alphaNum]),
      topic_given: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(100), myGlobals.alphaNum]),
      thought: new FormControl('', [Validators.maxLength(100), myGlobals.alphaNum]),
      content: new FormControl('', [Validators.maxLength(100), myGlobals.alphaNum]),
      language: new FormControl('', [Validators.maxLength(100), myGlobals.alphaNum]),
      idea: new FormControl('', [Validators.maxLength(100), myGlobals.alphaNum]),
      clues: new FormControl('', [Validators.maxLength(100), myGlobals.alphaNum]),
      time_taken: new FormControl('', [Validators.maxLength(30), myGlobals.alphaNum]),
      remarks: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(100), myGlobals.alphaNum]),
      ASSESSMENT: new FormControl('', [Validators.required]),
      depth_knowledge: new FormControl('', [Validators.required]),
      breadth_knowledge: new FormControl('', [Validators.required]),
      communicate_ability: new FormControl('', [Validators.required]),
      personal_skill: new FormControl('', [Validators.required]),
      personality: new FormControl('', [Validators.required]),
      personality_1: new FormControl('', [Validators.required]),
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
  get personality_1() {
    return this.evaluationForm.get('personality_1');
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
    if (assessment['id'] == 8) {
      this.evaluationForm.patchValue({
        personality_1: value
      });
      this.evaluationForm.value.personality_1 = value;
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
    const dateInterview = this.evaluationForm.value.interview_date ? moment(this.evaluationForm.value.interview_date).format('YYYY-MM-DD') : '';
    const apiData =
        {
          uid: this.uid ? this.uid : '',
          interview_date: dateInterview,
          interview_place: this.evaluationForm.value.interview_place,
          depth_knowledge: this.evaluationForm.value.depth_knowledge,
          breadth_knowledge: this.evaluationForm.value.breadth_knowledge,
          thought_clarity: this.evaluationForm.value.thought_clarity,
          communicate_ability: this.evaluationForm.value.communicate_ability,
          personal_skill: this.evaluationForm.value.personal_skill,
          personality: this.evaluationForm.value.personality,
          personality_1: this.evaluationForm.value.personality_1,
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
        };

    this.adminService.postEvaluationCandidateData(apiData).subscribe((res: any) => {
      this.appConfig.hideLoader();
      this.appConfig.success('Evaluation completed successfully', '');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST);
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
