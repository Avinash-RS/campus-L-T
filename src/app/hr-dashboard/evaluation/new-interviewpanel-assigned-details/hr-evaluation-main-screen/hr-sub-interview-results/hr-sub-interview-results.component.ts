
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import SampleJson from '../../../../../../assets/files/adani_evaluation_form.json';
import { FormControl, FormGroup, FormBuilder, NgModel, Validators, FormArray } from '@angular/forms';
import * as myGlobals from '../../../../../custom-form-validators/validation';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace.js';
import { ApiServiceService } from 'src/app/services/api-service.service.js';
import { SharedServiceService } from 'src/app/services/shared-service.service.js';
import { ActivatedRoute } from '@angular/router';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';



@Component({
  selector: 'app-hr-sub-interview-results',
  templateUrl: './hr-sub-interview-results.component.html',
  styleUrls: ['./hr-sub-interview-results.component.scss'],
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
  ]
})

export class HrSubInterviewResultsComponent implements OnInit {
  @Input() candidateId;
  @Input() nameOfAssessment;
  @Input() uid;
  @Input() status;
  @Input() shortlist_name;
  intervieweeAttendance: any;
  Notattended: any;
  attendedStatusList: any;
  displayedColumns: string[] = ['name'];
  assessments: any;
  dataSource: MatTableDataSource<any>;
  evaluationForm: FormGroup;
  getCandidateData: any;
  mastersList: any;
  expValidation = "^[a-zA-Z0-9 ]*";
  selectedPost: any;


  adaform_interview_date = 'interview_date';
  adaform_interview_place = 'interview_place';
  adaform_hr_comments = 'hr_comments';
  adaform_hr_selection_decision = 'hr_selection_decision'
  dynCol: any;
  receivedData: any;

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
    this.assessments=[]
    for (const iterator of SampleJson) {
      this.assessments=[...this.assessments,
        {
        name: iterator.name,
        expoints: iterator.expoints
      }]


    }
    // console.log(this.assessments)
    // this.getInterviewResults();
    if (this.candidateId) {
      this.getEvaluationData(this.uid);
      this.nginitFunc();
      this.getCandidateDetails();
    }
  }
  itemchek(item){
    let status=""
    if(item==1){
      status = "Average"
    }else if(item==3){
      status = "Good"
    }else if(item==5){
      status = "Excellent"
    }

    return status
  }
    getCandidateDetails() {
      const apiData = {
        uid: this.uid ? this.uid : '',
        shortlist_name: this.shortlist_name,
        form_type_id: this.appConfig.getSelectedDriveFormDetails().id
      }
      this.adminService.getCandidateInterviewResult(apiData).subscribe((success: any) => {

        const data = success ? success : null;
        if (data) {
            this.receivedData = data
          this.evaluationForm.patchValue({
            [this.adaform_interview_date]: data && data[this.adaform_interview_date] ? data[this.adaform_interview_date] : null,
            [this.adaform_interview_place]: data && data[this.adaform_interview_place] ? data[this.adaform_interview_place] : null,
            [this.adaform_hr_comments]: data && data[this.adaform_hr_comments] ? data[this.adaform_hr_comments] : null,
            [this.adaform_hr_selection_decision]: data && data[this.adaform_hr_selection_decision] ? data[this.adaform_hr_selection_decision] : null,
          });
          if(this.receivedData.hr_selection_decision!="" ){
            this.status='2';
          }
          this.evaluationForm.disable();

          this.dataSource = new MatTableDataSource<any>(this.assessments);
          this.dynCol = []
          data.feedbacks.interviewers.forEach((iver, i) => {
            // console.log(iver)
            this.displayedColumns=[...this.displayedColumns,"interviewer" + i]
            this.dynCol=[...this.dynCol,"interviewer" + i ]
            this.assessments.forEach(item => {

              item['interviewer' + i] = "1"
              // console.log(item)

          });

          });
          // console.log(this.dynCol,'sdfsdf')
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

      this.evaluationForm = this.formBuilder.group({
        [this.adaform_interview_date]: new FormControl('', [Validators.required]),
        [this.adaform_interview_place]: new FormControl('', [RemoveWhitespace.whitespace(), myGlobals.req, myGlobals.alphaNum30]),
        [this.adaform_hr_comments]: new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(255), myGlobals.alphaNum]),
        [this.adaform_hr_selection_decision]: new FormControl('', [Validators.required]),

        // [this.adaform_valuesIntegrity]: new FormControl(null, [Validators.required])
      });
      this.status != '2' ? '' : this.evaluationForm.disable();
    }

    statusChange(status: any) {
      setTimeout(() => {
        this.evaluationForm['controls'][this.adaform_hr_comments].setValidators([RemoveWhitespace.whitespace(), Validators.maxLength(100), myGlobals.alphaNum]);
        this.evaluationForm['controls'][this.adaform_hr_comments].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_interview_date].clearValidators();
        this.evaluationForm['controls'][this.adaform_interview_date].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_hr_selection_decision].clearValidators();
        this.evaluationForm['controls'][this.adaform_hr_selection_decision].updateValueAndValidity();

        this.evaluationForm['controls'][this.adaform_interview_place].clearValidators();
        this.evaluationForm['controls'][this.adaform_interview_place].updateValueAndValidity();

      }, 100);

    }


  get interview_date() {
      return this.evaluationForm.get(this.adaform_interview_date);
    }
  get interview_place() {
      return this.evaluationForm.get(this.adaform_interview_place);
    }
  get remarks() {
      return this.evaluationForm.get(this.adaform_hr_comments);
    }
  get decision() {
      return this.evaluationForm.get(this.adaform_hr_selection_decision);
    }


    submitHrInterviewForm() {
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

    submitHREvaluationFormAPI() {
      const dateInterview = this.evaluationForm.value[this.adaform_interview_date] ? moment(this.evaluationForm.value[this.adaform_interview_date]).format('YYYY-MM-DD') : '';
      let formData = this.evaluationForm.getRawValue();
      formData[this.adaform_interview_date] = dateInterview;
      formData[this.adaform_hr_selection_decision] = this.evaluationForm.value[this.adaform_hr_selection_decision];
      formData[this.adaform_hr_comments] = this.evaluationForm.value[this.adaform_hr_comments]
      formData[this.adaform_interview_place] = this.evaluationForm.value[this.adaform_interview_place]
      formData.uid = this.uid ? this.uid : '';
      formData.shortlist_name = this.shortlist_name ? this.shortlist_name : '';
      formData.form_type_id = this.appConfig.getSelectedDriveFormDetails().id;
      const apiData = formData;
      // console.log(apiData);
      this.adminService.submitHRResultOnCandidates(apiData).subscribe((res: any) => {

        this.appConfig.success('Action on candidate saved', '');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.ASSIGNED_DETAILS);
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
          this.submitHREvaluationFormAPI();
        }
      });
    }



  }
