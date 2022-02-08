
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import SampleJson from '../../../../assets/files/adani_evaluation_form.json';
import { FormControl, FormGroup, FormBuilder, NgModel, Validators, FormArray } from '@angular/forms';
import * as myGlobals from '../../../custom-form-validators/validation';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace.js';
import { ApiServiceService } from 'src/app/services/api-service.service.js';
import { SharedServiceService } from 'src/app/services/shared-service.service.js';
import { ActivatedRoute } from '@angular/router';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

export interface PeriodicElement {
  id: number;
  name: string;
  level: number;
  veryGood: string;
  good: string;
  average: string;
  expoints: any;
}

@Component({
  selector: 'app-adani-evaluation-form',
  templateUrl: './adani-evaluation-form.component.html',
  styleUrls: ['./adani-evaluation-form.component.scss'],
  providers: [
    // {
    //   provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    //   useValue: { useUtc: true }
    // },
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: myGlobals.MY_FORMATS },
  ],
})

export class AdaniEvaluationFormComponent implements OnInit {
@Input() candidateId;
@Input() nameOfAssessment;
@Input() uid;
@Input() status;
@Input() shortlist_name;
  intervieweeAttendance:any;
  Notattended: any;
  attendedStatusList: any;
  displayedColumns: string[] = ['name', 'average','good', 'veryGood'  ];
  assessments: PeriodicElement[] = SampleJson;
  dataSource: MatTableDataSource<PeriodicElement>;
  evaluationForm: FormGroup;
  getCandidateData: any;
  mastersList: any;
  expValidation = "^[a-zA-Z0-9 ]*";
  selectedPost: any;

  caform_isattendedorNot = 'attend_status';
  adaform_NotattendedReason = 'not_attend_reason';
  adaform_interview_date = 'interview_date';
  adaform_interview_place = 'interview_place';
  adaform_remarks = 'comments';
  adaform_l1 = 'work_location';
  adaform_l2 = 'work_bu';
  adaform_technical_subject = 'technical_knowledge';
  adaform_application_understanding = 'application_based_understanding';
  adaform_communication = 'communication';
  adaform_analytical = 'analytical';
  adaform_executive_presence = 'executive_presence';
  adaform_growth = 'potential_for_future_growth';
  // adaform_valuesIntegrity = 'ca_values';

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
      this.getEvaluationData(this.uid);
      this.nginitFunc();
      this.getCandidateDetails();
    }
  }

  getMasters() {
    // this.adminService.keyMastersList().subscribe((data: any)=> {
      this.mastersList = this.appConfig.getLocalData('masters') ? JSON.parse(this.appConfig.getLocalData('masters')) : '';
      this.intervieweeAttendance = this.mastersList?.intervieweeAttendance;
      this.attendedStatusList = this.mastersList?.AttendedStatus;
      this.Notattended = this.mastersList?.notAttendedStatus;
    // }, (err)=> {

    // });
  }
  getCandidateDetails() {
    const apiData = {
      uid: this.candidateId ? this.candidateId : '',
      shortlist_name: this.shortlist_name,
      form_type_id : this.appConfig.getSelectedDriveFormDetails().id
    }
    this.adminService.getAdaniEvaluationDetails(apiData).subscribe((success: any) => {

      const data = success ? success : null;
      if (data) {
        this.evaluationForm.patchValue({
          [this.caform_isattendedorNot]: data ? data[this.caform_isattendedorNot].toString() : null,
          [this.adaform_NotattendedReason]: data && data[this.adaform_NotattendedReason] ? data[this.adaform_NotattendedReason] : null,
          [this.adaform_interview_date]: data && data[this.adaform_interview_date] ? data[this.adaform_interview_date] : null,
          [this.adaform_interview_place]: data && data[this.adaform_interview_place] ? data[this.adaform_interview_place] : null,
          [this.adaform_remarks]: data && data[this.adaform_remarks] ? data[this.adaform_remarks] : null,
          [this.adaform_technical_subject]: data && data[this.adaform_technical_subject] ? data[this.adaform_technical_subject] : null,
          [this.adaform_application_understanding]: data && data[this.adaform_application_understanding] ? data[this.adaform_application_understanding] : null,
          [this.adaform_communication]: data && data[this.adaform_communication] ? data[this.adaform_communication] : null,
          [this.adaform_analytical]: data && data[this.adaform_analytical] ? data[this.adaform_analytical] : null,
          [this.adaform_executive_presence]: data && data[this.adaform_executive_presence] ? data[this.adaform_executive_presence] : null,
          [this.adaform_growth]: data && data[this.adaform_growth] ? data[this.adaform_growth] : null,
          [this.adaform_l1]: data && data[this.adaform_l1] ? data[this.adaform_l1] : null,
          [this.adaform_l2]: data && data[this.adaform_l2] ? data[this.adaform_l2] : null,
          // [this.adaform_valuesIntegrity]: data && data[this.adaform_valuesIntegrity] ? data[this.adaform_valuesIntegrity] : null
        });
        // console.log(data[this.caform_isattendedorNot] );
        this.assessments.forEach(element => {
          if (element['id'] === 1) {
            element['isChecked'] = data[this.adaform_technical_subject] ? data[this.adaform_technical_subject] : null
          }
          if (element['id'] === 2) {
            element['isChecked'] = data[this.adaform_application_understanding] ? data[this.adaform_application_understanding] : null
          }
          if (element['id'] === 3) {
            element['isChecked'] = data[this.adaform_communication] ? data[this.adaform_communication] : null
          }
          if (element['id'] === 4) {
            element['isChecked'] = data[this.adaform_analytical] ? data[this.adaform_analytical] : null
          }
          if (element['id'] === 5) {
            element['isChecked'] = data[this.adaform_executive_presence] ? data[this.adaform_executive_presence] : null
          }
          if (element['id'] === 6) {
            element['isChecked'] = data[this.adaform_growth] ? data[this.adaform_growth] : null
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
      [this.adaform_NotattendedReason]: new FormControl('', [Validators.required]),
      [this.adaform_interview_date]: new FormControl('', [Validators.required]),
      [this.adaform_interview_place]: new FormControl('', [RemoveWhitespace.whitespace(), myGlobals.req, myGlobals.alphaNum30]),
      [this.adaform_remarks]: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(255), myGlobals.alphaNum]),
      [this.adaform_technical_subject]: new FormControl(null, [Validators.required]),
      [this.adaform_application_understanding]: new FormControl(null, [Validators.required]),
      [this.adaform_communication]: new FormControl(null, [Validators.required]),
      [this.adaform_analytical]: new FormControl(null, [Validators.required]),
      [this.adaform_executive_presence]: new FormControl(null, [Validators.required]),
      [this.adaform_growth]: new FormControl(null, [Validators.required]),
      [this.adaform_l1]: new FormControl('', [RemoveWhitespace.whitespace(), Validators.maxLength(255), myGlobals.alphaNum]),
      [this.adaform_l2]: new FormControl('', [RemoveWhitespace.whitespace(), Validators.maxLength(255), myGlobals.alphaNum]),
      // [this.adaform_valuesIntegrity]: new FormControl(null, [Validators.required])
    });
    this.status != '2' ?  '' : this.evaluationForm.disable();
  }

  statusChange(status: any) {
    setTimeout(() => {
      if (status['value'] == '0') {
        this.evaluationForm['controls'][this.adaform_NotattendedReason].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.adaform_NotattendedReason].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_remarks].setValidators([RemoveWhitespace.whitespace(), Validators.maxLength(250), myGlobals.alphaNum]);
        this.evaluationForm['controls'][this.adaform_remarks].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_interview_date].clearValidators();
        this.evaluationForm['controls'][this.adaform_interview_date].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_technical_subject].clearValidators();
        this.evaluationForm['controls'][this.adaform_technical_subject].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_application_understanding].clearValidators();
        this.evaluationForm['controls'][this.adaform_application_understanding].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_communication].clearValidators();
        this.evaluationForm['controls'][this.adaform_communication].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_analytical].clearValidators();
        this.evaluationForm['controls'][this.adaform_analytical].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_executive_presence].clearValidators();
        this.evaluationForm['controls'][this.adaform_executive_presence].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_growth].clearValidators();
        this.evaluationForm['controls'][this.adaform_growth].updateValueAndValidity();

        // this.evaluationForm['controls'][this.adaform_valuesIntegrity].clearValidators();
        // this.evaluationForm['controls'][this.adaform_valuesIntegrity].updateValueAndValidity();
      } else {
        this.evaluationForm['controls'][this.adaform_NotattendedReason].clearValidators();
        this.evaluationForm['controls'][this.adaform_NotattendedReason].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_remarks].setValidators([RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(255), myGlobals.alphaNum]);
        this.evaluationForm['controls'][this.adaform_remarks].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_interview_date].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.adaform_interview_date].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_technical_subject].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.adaform_technical_subject].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_application_understanding].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.adaform_application_understanding].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_communication].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.adaform_communication].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_analytical].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.adaform_analytical].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_executive_presence].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.adaform_executive_presence].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_growth].setValidators([Validators.required]);
        this.evaluationForm['controls'][this.adaform_growth].updateValueAndValidity();

        // this.evaluationForm['controls'][this.adaform_valuesIntegrity].setValidators([Validators.required]);
        // this.evaluationForm['controls'][this.adaform_valuesIntegrity].updateValueAndValidity();
      }
    }, 100);

  }

  get isattendedorNot() {
    return this.evaluationForm.get(this.caform_isattendedorNot);
  }
  get NotattendedReason() {
    return this.evaluationForm.get(this.adaform_NotattendedReason);
  }

  get interview_date() {
    return this.evaluationForm.get(this.adaform_interview_date);
  }
  get interview_place() {
    return this.evaluationForm.get(this.adaform_interview_place);
  }
  get remarks() {
    return this.evaluationForm.get(this.adaform_remarks);
  }
  get lb1() {
    return this.evaluationForm.get(this.adaform_l1);
  }
  get lb2() {
    return this.evaluationForm.get(this.adaform_l2);
  }

  get technical_subject() {
    return this.evaluationForm.get(this.adaform_technical_subject);
  }
  get app_understanding() {
    return this.evaluationForm.get(this.adaform_application_understanding);
  }
  get knowledgeExperience() {
    return this.evaluationForm.get(this.adaform_communication);
  }
  get communicationskillOrExpression() {
    return this.evaluationForm.get(this.adaform_analytical);
  }
  get taskEffectiveness() {
    return this.evaluationForm.get(this.adaform_executive_presence);
  }
  get applicationOfKnowledge() {
    return this.evaluationForm.get(this.adaform_growth);
  }
  // get valuesIntegrity() {
  //   return this.evaluationForm.get(this.adaform_valuesIntegrity);
  // }


  setAssessmentLevel(assessment, value) {
    // console.log(assessment,value)
    this.assessments[this.assessments.indexOf(assessment)] = {
      ...assessment,
      level: value
    };

    if (assessment['id'] == 6) {
      this.evaluationForm.patchValue({
        [this.adaform_growth]: value
      });
    }
    if (assessment['id'] == 5) {
      this.evaluationForm.patchValue({
        [this.adaform_executive_presence]: value
      });
    }
    if (assessment['id'] == 4) {
      this.evaluationForm.patchValue({
        [this.adaform_analytical]: value
      });
    }
    if (assessment['id'] == 3) {
      this.evaluationForm.patchValue({
        [this.adaform_communication]: value
      });
    }
    if (assessment['id'] == 2) {
      this.evaluationForm.patchValue({
        [this.adaform_application_understanding]: value
      });
    }
    if (assessment['id'] == 1) {
      this.evaluationForm.patchValue({
        [this.adaform_technical_subject]: value
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
    const dateInterview = this.evaluationForm.value[this.adaform_interview_date] ? moment(this.evaluationForm.value[this.adaform_interview_date]).format('YYYY-MM-DD') : '';
    let formData = this.evaluationForm.getRawValue();
    formData[this.adaform_interview_date] = dateInterview;
    formData.uid = this.uid ? this.uid : '';
    formData.shortlist_name = this.shortlist_name ? this.shortlist_name : '';
    formData.form_type_id = this.appConfig.getSelectedDriveFormDetails().id;
    const apiData = formData;
    // console.log(apiData);
    this.adminService.postEvaluationAdaniCandidateData(apiData).subscribe((res: any) => {

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
