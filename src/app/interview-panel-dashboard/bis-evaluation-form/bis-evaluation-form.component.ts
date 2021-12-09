import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import * as myGlobals from '../../custom-form-validators/validation';
import SampleJson from '../../../assets/files/BIS_evaluation_data.json';

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
  selector: 'app-bis-evaluation-form',
  templateUrl: './bis-evaluation-form.component.html',
  styleUrls: ['./bis-evaluation-form.component.scss'],
  providers: [
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: { useUtc: true }
    },
  ]
})
export class BisEvaluationFormComponent implements OnInit {
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
            attended: data['attended'] ? data['attended'] : '',
            notAttendedStatus: data?.['notAttendedStatus'] ? data['notAttendedStatus'] : '',
            attendedStatus: data?.['attendedStatus'] ? data['attendedStatus'] : '',
            interview_date: data?.['interview_date'] ? data['interview_date'] : '',
            interview_place: data?.['interview_place'] ? data['interview_place'] : '',
            willing_work: data?.['willing_work'] ? data['willing_work'] : '',
            physical_disability: data?.['physical_disability'] ? data['physical_disability'] : '',
            candidates_strenght: data?.['candidates_strenght'] ? data['candidates_strenght'] : '',
            candidates_weakness: data?.['candidates_weakness'] ? data['candidates_weakness'] : '',
            panel_member1: data?.['panel_member1'] ? data['panel_member1'] : '',
            panel_member2: data?.['panel_member2'] ? data['panel_member2'] : '',
            panel_member3: data?.['panel_member3'] ? data['panel_member3'] : '',
            panel_member4: data?.['panel_member4'] ? data['panel_member4'] : '',
            ps_no1: data?.['ps_no1'] ? data['ps_no1'] : '',
            ps_no2: data?.['ps_no2'] ? data['ps_no2'] : '',
            ps_no3: data?.['ps_no3'] ? data['ps_no3'] : '',
            ps_no4: data?.['ps_no4'] ? data['ps_no4'] : '',
            topic_given: data?.['topic_given'] ? data['topic_given'] : '',
            thought: data?.['thought'] ? data['thought'] : '',
            content: data?.['content'] ? data['content'] : '',
            language: data?.['language'] ? data['language'] : '',
            idea: data?.['idea'] ? data['idea'] : '',
            clues: data?.['clues'] ? data['clues'] : '',
            time_taken: data?.['time_taken'] ? data['time_taken'] : '',
            remarks: data?.['remarks'] ? data['remarks'] : '',
            ASSESSMENT: data?.['candidate_assesment'] ? data['candidate_assesment'] : '',
            depth_knowledge: data?.['depth_knowledge'] ? data['depth_knowledge'] : null,
            breadth_knowledge: data?.['breadth_knowledge'] ? data['breadth_knowledge'] : null,
            communicate_ability: data?.['communicate_ability'] ? data['communicate_ability'] : null,
            personal_skill: data?.['personal_skill'] ? data['personal_skill'] : null,
            personality: data?.['personality'] ? data['personality'] : null,
            personality_1: data?.['personality_1'] ? data['personality_1'] : null,
            curricular_activites: data?.['curricular_activites'] ? data['curricular_activites'] : null,
            thought_clarity: data?.['thought_clarity'] ? data['thought_clarity'] : null
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
          this.statusChange({value: data['attended']});
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
        attended: new FormControl('', [Validators.required]),
        notAttendedStatus: new FormControl('', [Validators.required]),
        attendedStatus: new FormControl('', [Validators.required]),
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
        depth_knowledge: new FormControl(null, [Validators.required]),
        breadth_knowledge: new FormControl(null, [Validators.required]),
        communicate_ability: new FormControl(null, [Validators.required]),
        personal_skill: new FormControl(null, [Validators.required]),
        personality: new FormControl(null, [Validators.required]),
        personality_1: new FormControl(null, [Validators.required]),
        curricular_activites: new FormControl(null, [Validators.required]),
        thought_clarity: new FormControl(null, [Validators.required]),
      });
      this.status != '2' ?  '' : this.evaluationForm.disable();
    }

    statusChange(status: any) {
      setTimeout(() => {
        if (status['value'] == '0') {
          this.evaluationForm['controls']['notAttendedStatus'].setValidators([Validators.required]);
          this.evaluationForm['controls']['notAttendedStatus'].updateValueAndValidity();
          this.evaluationForm['controls']['attendedStatus'].clearValidators();
          this.evaluationForm['controls']['attendedStatus'].updateValueAndValidity();
          this.evaluationForm['controls']['willing_work'].clearValidators();
          this.evaluationForm['controls']['willing_work'].updateValueAndValidity();
          this.evaluationForm['controls']['panel_member1'].clearValidators();
          this.evaluationForm['controls']['panel_member1'].updateValueAndValidity();
          this.evaluationForm['controls']['ps_no1'].clearValidators();
          this.evaluationForm['controls']['ps_no1'].updateValueAndValidity();
          this.evaluationForm['controls']['topic_given'].clearValidators();
          this.evaluationForm['controls']['topic_given'].updateValueAndValidity();
          this.evaluationForm['controls']['remarks'].clearValidators();
          this.evaluationForm['controls']['remarks'].updateValueAndValidity();
          this.evaluationForm['controls']['ASSESSMENT'].clearValidators();
          this.evaluationForm['controls']['ASSESSMENT'].updateValueAndValidity();

          this.evaluationForm['controls']['depth_knowledge'].clearValidators();
          // this.evaluationForm['controls']['depth_knowledge'].reset();
          this.evaluationForm['controls']['depth_knowledge'].updateValueAndValidity();

          this.evaluationForm['controls']['breadth_knowledge'].clearValidators();
          // this.evaluationForm['controls']['breadth_knowledge'].reset();
          this.evaluationForm['controls']['breadth_knowledge'].updateValueAndValidity();

          this.evaluationForm['controls']['communicate_ability'].clearValidators();
          // this.evaluationForm['controls']['communicate_ability'].reset();
          this.evaluationForm['controls']['communicate_ability'].updateValueAndValidity();

          this.evaluationForm['controls']['personal_skill'].clearValidators();
          // this.evaluationForm['controls']['personal_skill'].reset();
          this.evaluationForm['controls']['personal_skill'].updateValueAndValidity();

          this.evaluationForm['controls']['personality'].clearValidators();
          // this.evaluationForm['controls']['personality'].reset();
          this.evaluationForm['controls']['personality'].updateValueAndValidity();

          this.evaluationForm['controls']['personality_1'].clearValidators();
          // this.evaluationForm['controls']['personality_1'].reset();
          this.evaluationForm['controls']['personality_1'].updateValueAndValidity();

          this.evaluationForm['controls']['curricular_activites'].clearValidators();
          // this.evaluationForm['controls']['curricular_activites'].reset();
          this.evaluationForm['controls']['curricular_activites'].updateValueAndValidity();

          this.evaluationForm['controls']['thought_clarity'].clearValidators();
          // this.evaluationForm['controls']['thought_clarity'].reset();
          this.evaluationForm['controls']['thought_clarity'].updateValueAndValidity();
        } else {
          this.evaluationForm['controls']['attendedStatus'].setValidators([Validators.required]);
          this.evaluationForm['controls']['attendedStatus'].updateValueAndValidity();
          this.evaluationForm['controls']['notAttendedStatus'].clearValidators();
          this.evaluationForm['controls']['notAttendedStatus'].updateValueAndValidity();
          this.evaluationForm['controls']['willing_work'].setValidators([Validators.required]);
          this.evaluationForm['controls']['willing_work'].updateValueAndValidity();
          this.evaluationForm['controls']['panel_member1'].setValidators([RemoveWhitespace.whitespace(), Validators.required, myGlobals.alphaWithDots, Validators.maxLength(50)]);
          this.evaluationForm['controls']['panel_member1'].updateValueAndValidity();
          this.evaluationForm['controls']['ps_no1'].setValidators([RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(30), myGlobals.alphaNum]);
          this.evaluationForm['controls']['ps_no1'].updateValueAndValidity();
          if (this.selectedPost) {
            this.evaluationForm['controls']['topic_given'].setValidators([RemoveWhitespace.whitespace(), Validators.maxLength(100), myGlobals.alphaNum]);
            this.evaluationForm['controls']['topic_given'].updateValueAndValidity();
          } else {
            this.evaluationForm['controls']['topic_given'].setValidators([RemoveWhitespace.whitespace(), Validators.maxLength(100), myGlobals.alphaNum]);
            this.evaluationForm['controls']['topic_given'].updateValueAndValidity();
          }
          this.evaluationForm['controls']['remarks'].setValidators([RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(100), myGlobals.alphaNum]);
          this.evaluationForm['controls']['remarks'].updateValueAndValidity();
          this.evaluationForm['controls']['ASSESSMENT'].setValidators([Validators.required]);
          this.evaluationForm['controls']['ASSESSMENT'].updateValueAndValidity();
          this.evaluationForm['controls']['depth_knowledge'].setValidators([Validators.required]);
          this.evaluationForm['controls']['depth_knowledge'].updateValueAndValidity();
          this.evaluationForm['controls']['breadth_knowledge'].setValidators([Validators.required]);
          this.evaluationForm['controls']['breadth_knowledge'].updateValueAndValidity();
          this.evaluationForm['controls']['communicate_ability'].setValidators([Validators.required]);
          this.evaluationForm['controls']['communicate_ability'].updateValueAndValidity();
          this.evaluationForm['controls']['personal_skill'].setValidators([Validators.required]);
          this.evaluationForm['controls']['personal_skill'].updateValueAndValidity();
          this.evaluationForm['controls']['personality'].setValidators([Validators.required]);
          this.evaluationForm['controls']['personality'].updateValueAndValidity();
          this.evaluationForm['controls']['personality_1'].clearValidators();
          this.evaluationForm['controls']['personality_1'].updateValueAndValidity();
          this.evaluationForm['controls']['curricular_activites'].clearValidators();
          this.evaluationForm['controls']['curricular_activites'].updateValueAndValidity();
          this.evaluationForm['controls']['thought_clarity'].setValidators([Validators.required]);
          this.evaluationForm['controls']['thought_clarity'].updateValueAndValidity();
          this.evaluationForm['controls']['topic_given'].clearValidators();
          this.evaluationForm['controls']['topic_given'].updateValueAndValidity();
          this.evaluationForm['controls']['remarks'].clearValidators();
          this.evaluationForm['controls']['remarks'].updateValueAndValidity();
        }
      }, 100);

    }

    get interview_date() {
      return this.evaluationForm.get('interview_date');
    }

    get notAttendedStatus() {
      return this.evaluationForm.get('notAttendedStatus');
    }

    get attendedStatus() {
      return this.evaluationForm.get('attendedStatus');
    }

    get nota() {
      return this.evaluationForm.get('attended');
    }

    get attended() {
      return this.evaluationForm.get('attended');
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
      this.evaluationForm.controls.topic_given.setValue(null);
      this.evaluationForm.controls.topic_given.clearValidators();
      this.evaluationForm.controls.topic_given.updateValueAndValidity();
      this.evaluationForm.controls.thought.setValue(null);
      this.evaluationForm.controls.thought.clearValidators();
      this.evaluationForm.controls.thought.updateValueAndValidity();
      this.evaluationForm.controls.content.setValue(null);
      this.evaluationForm.controls.content.clearValidators();
      this.evaluationForm.controls.content.updateValueAndValidity();
      this.evaluationForm.controls.language.setValue(null);
      this.evaluationForm.controls.language.clearValidators();
      this.evaluationForm.controls.language.updateValueAndValidity();
      this.evaluationForm.controls.idea.setValue(null);
      this.evaluationForm.controls.idea.clearValidators();
      this.evaluationForm.controls.idea.updateValueAndValidity();
      this.evaluationForm.controls.clues.setValue(null);
      this.evaluationForm.controls.clues.clearValidators();
      this.evaluationForm.controls.clues.updateValueAndValidity();
      this.evaluationForm.controls.time_taken.setValue(null);
      this.evaluationForm.controls.time_taken.clearValidators();
      this.evaluationForm.controls.time_taken.updateValueAndValidity();
      this.evaluationForm.controls.remarks.setValue(null);
      this.evaluationForm.controls.remarks.clearValidators();
      this.evaluationForm.controls.remarks.updateValueAndValidity();
      this.evaluationForm.controls.personality_1.setValue(null);
      this.evaluationForm.controls.personality_1.clearValidators();
      this.evaluationForm.controls.personality_1.updateValueAndValidity();
      this.evaluationForm.controls.curricular_activites.setValue(null);
      this.evaluationForm.controls.curricular_activites.clearValidators();
      this.evaluationForm.controls.curricular_activites.updateValueAndValidity();
      this.evaluationForm.controls.candidates_strenght.setValue(null);
      this.evaluationForm.controls.candidates_strenght.clearValidators();
      this.evaluationForm.controls.candidates_strenght.updateValueAndValidity();
      this.evaluationForm.controls.candidates_weakness.setValue(null);
      this.evaluationForm.controls.candidates_weakness.clearValidators();
      this.evaluationForm.controls.candidates_weakness.updateValueAndValidity();
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
        form: '2',
        notAttendedStatus: this.evaluationForm.value.notAttendedStatus,
        attendedStatus: this.evaluationForm.value.attendedStatus,
        attended: this.evaluationForm.value.attended,
        uid: this.uid ? this.uid : '',
        shortlist_name: this.shortlist_name ? this.shortlist_name : '',
        interview_date: dateInterview,
        interview_place: this.evaluationForm.value.interview_place,
        depth_knowledge: this.evaluationForm.value.depth_knowledge,
        breadth_knowledge: this.evaluationForm.value.breadth_knowledge,
        thought_clarity: this.evaluationForm.value.thought_clarity,
        communicate_ability: this.evaluationForm.value.communicate_ability,
        personal_skill: this.evaluationForm.value.personal_skill,
        personality: this.evaluationForm.value.personality,
        personality_1: this.evaluationForm.value.personality_1 ? null : null,
        curricular_activites: this.evaluationForm.value.curricular_activites ? null : null,
        candidate_assesment: this.evaluationForm.value.ASSESSMENT,
        physical_disability: this.evaluationForm.value.physical_disability,
        willing_work: this.evaluationForm.value.willing_work,
        candidates_strenght: this.evaluationForm.value.candidates_strenght ? null : null,
        candidates_weakness: this.evaluationForm.value.candidates_weakness ? null : null,
        panel_member1: this.evaluationForm.value.panel_member1,
        panel_member2: this.evaluationForm.value.panel_member2,
        panel_member3: this.evaluationForm.value.panel_member3,
        panel_member4: this.evaluationForm.value.panel_member4,
        ps_no1: this.evaluationForm.value.ps_no1,
        ps_no2: this.evaluationForm.value.ps_no2,
        ps_no3: this.evaluationForm.value.ps_no3,
        ps_no4: this.evaluationForm.value.ps_no4,
        topic_given: this.evaluationForm.value.topic_given ? null : null,
        thought: this.evaluationForm.value.thought ? null : null,
        content: this.evaluationForm.value.content ? null : null,
        language: this.evaluationForm.value.language ? null : null,
        idea: this.evaluationForm.value.idea ? null : null,
        clues: this.evaluationForm.value.clues ? null : null,
        time_taken: this.evaluationForm.value.time_taken ? null : null,
        remarks: this.evaluationForm.value.remarks ? null : null
      };

      this.adminService.postEvaluationCandidateData(apiData).subscribe((res: any) => {

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
