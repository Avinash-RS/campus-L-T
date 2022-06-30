import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { Subscription } from 'rxjs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM-YYYY', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-shared-off-campus-profile',
  templateUrl: './off-campus-profile.component.html',
  styleUrls: ['./off-campus-profile.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OffCampusProfileComponent implements OnInit, OnDestroy {
  @ViewChild('matDialogTerms', { static: false }) matDialogRefTerms: TemplateRef<any>;

  offCampusRegistrationForm: FormGroup;

  // Gender DropDown List
  genderDropdownList = [
    {
      label: 'Male',
      value: 'Male'
    },
    {
      label: 'Female',
      value: 'Female'
    },
    {
      label: 'Others',
      value: 'Others'
    }
  ];
  
  form_name = 'name';
  form_email = 'email';
  form_mobile = 'mobile';
  form_dob = 'dob';
  form_gender = 'gender';
  form_education_10th_percentage = '10thPercentage';
  form_education_12th_percentage = '12thPercentage';
  form_education_UG_clg_name = 'clg_name';
  form_education_UG_clg_qualification = 'clg_qualification';
  form_education_UG_clg_discipline = 'clg_discipline';
  form_education_UG_clg_year_passing = 'clg_year_passing';
  form_education_UG_clg_marks = 'clg_marks';
  form_education_UG_clg_backlogs = 'clg_backlogs';
  form_resume = 'resume';
  form_t_c = 'terms';

  form_file_path = 'file_path';
  form_file_type = 'filetype';
  form_file_size = 'file_size';
  form_file_name = 'filename';
  form_file_id = 'file_id';
  form_label = 'label';
  minDateDOB: Date;
  passportDateOfIssueMaxDate: Date;
  getAllEducationFormDropdownListSubscription: Subscription;
  ugQualificationList: any;
  pgQualificationList: any;
  ugDisciplineList: any;
  pgDisciplineList: any;
  ugInstitutesList: any;
  pgInstitutesList: any;



  constructor(
    private fb: FormBuilder,
    private appConfig: AppConfigService,
    private gv: GlobalValidatorService,
    private candidateService: CandidateMappersService,
    private loadingService: LoaderService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.registrationFormInit();
    this.educationDropdownValues();
  }

  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDateDOB = new Date(currentYear - 90, 0, 1);
    this.passportDateOfIssueMaxDate = new Date();
    // this.maxDate = new Date(currentYear + 20, 11, 31);
    // this.passportValidminDate = new Date(currentYear - 15, 0, 1);
    // this.passportValidmaxDate = new Date(currentYear + 40, 0, 1);
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
      return split;
    }
  }

  dateConvertion(date) {
    if (date) {
      const split = moment(date).format();
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format();
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

  educationDropdownValues() {
    const api = {
      level: '',
      discipline: '',
      specification: ''
    };
   this.getAllEducationFormDropdownListSubscription = this.candidateService.getAllEducationFormDropdownList(api).subscribe((data: any) => {
      this.ugQualificationList = data && data.ug_specifications ? data.ug_specifications : [];
      this.pgQualificationList = data && data.pg_specifications ? data.pg_specifications : [];
      this.ugDisciplineList = data && data.ug_disciplines ? data.ug_disciplines : [];
      this.pgDisciplineList = data && data.pg_disciplines ? data.pg_disciplines : [];
      const list = data && data.ug_pg_colleges ? data.ug_pg_colleges : [];
      this.ugInstitutesList = list;
      const exceptOthers = list.filter((data: any) => data.college_name !== 'Others');
      this.pgInstitutesList = exceptOthers;
    }, (err) => {

    });
  }


  offCampusFormSubmit() {

  }

  registrationFormInit() {
    this.offCampusRegistrationForm = this.fb.group({
      [this.form_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.alphaNum255()]],
      [this.form_email]: [null, [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(255), this.gv.email()]],
      [this.form_mobile]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.mobileRegex()]],
      [this.form_dob]: [null, [Validators.required]],
      [this.form_gender]: [null, [Validators.required]],
      [this.form_education_10th_percentage]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.percentageNew(), this.gv.percentage(), Validators.maxLength(5)]],
      [this.form_education_12th_percentage]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.percentageNew(), this.gv.percentage(), Validators.maxLength(5)]],
      [this.form_education_UG_clg_name]: [null, [Validators.required]],
      [this.form_education_UG_clg_qualification]: [null, [Validators.required]],
      [this.form_education_UG_clg_discipline]: [null, [Validators.required]],
      [this.form_education_UG_clg_year_passing]: [null, [Validators.required]],
      [this.form_education_UG_clg_marks]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.percentageNew(), this.gv.percentage(), Validators.maxLength(5)]],
      [this.form_education_UG_clg_backlogs]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.backlog()]],
      [this.form_resume]: this.initResumeArray(),
      [this.form_t_c]: [null, [Validators.requiredTrue]]
    })
  }

  initResumeArray() {
    return this.fb.group({
      [this.form_label]: ['Resume'],
      [this.form_file_size]: [null],
      [this.form_file_path]: [null, [Validators.required]],
      [this.form_file_name]: [null],
      [this.form_file_type]: [null],
      [this.form_file_id]: [null],
    })
  }

  matDialogOpenTerms() {
    let termsAndCondtionsPopRef = this.dialog.open(this.matDialogRefTerms, {
    width: '890px',
    height: 'auto',
    autoFocus: false,
    closeOnNavigation: true,
    disableClose: false,
    panelClass: 'wrapper-kyc-terms'
  });
}

closeBox() {
  this.dialog.closeAll();
}


  removeFile() {
    this[this.form_resume].patchValue({
      [this.form_label]: 'Resume',
      [this.form_file_size]: null,
      [this.form_file_path]: null,
      [this.form_file_name]: null,
      [this.form_file_type]: null,
      [this.form_file_id]:   null,
    });
  }
  async uploadImage(file) {
    try {
      this.loadingService.setLoading(true);
      const data = await (await this.candidateService.uploadJoiningDocs(file)).json();
      if (data && data.error_code) {
        console.log('coming1')
        this.loadingService.setLoading(false);
       return this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
      }
      this.loadingService.setLoading(false);
      if (data && data.file_id) {
        console.log('coming2');
        this[this.form_resume].patchValue({
          [this.form_label]: 'Resume',
          [this.form_file_size]: data.file_size,
          [this.form_file_path]: data.file_path,
          [this.form_file_name]: data.file_name,
          [this.form_file_type]: data.type,
          [this.form_file_id]:   data.file_id,
        });
        return this.appConfig.nzNotification('success', 'Uploaded', 'Document uploaded successfully');
      }
    }  
    catch (e) {
      console.log('coming4', e);
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
    }
  }
  
  onSelectFile(event) {
    const fd = new FormData();
    this.filepath.markAsTouched();
    if (event.target.files && (event.target.files[0].type.includes('application/pdf'))) {
      if (event.target.files[0].size < 2000000) {
        if (this.appConfig.minImageSizeValidation(event.target.files[0].size)) {
        let image = event.target.files[0];

        fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
        fd.append('description', 'off-campus Resume');
        fd.append('label', 'off-campus Resume');
        fd.append('level', 'off-campus Resume');
        fd.append('product_image', image);
        this.uploadImage(fd);
      }
     } else {
      this.appConfig.nzNotification('error', 'Not Uploaded', 'Maximum file size is 2 MB');
     }
    } else {
      return this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload .PDF files only');
    }
  }

  get name() {
    return this.offCampusRegistrationForm.get(this.form_name);
  }
  get email() {
    return this.offCampusRegistrationForm.get(this.form_email);
  }
  get mobile() {
    return this.offCampusRegistrationForm.get(this.form_mobile);
  }
  get dob() {
    return this.offCampusRegistrationForm.get(this.form_dob);
  }
  get gender() {
    return this.offCampusRegistrationForm.get(this.form_gender);
  }
  get education_10th_percentage() {
    return this.offCampusRegistrationForm.get(this.form_education_10th_percentage);
  }
  get education_12th_percentage() {
    return this.offCampusRegistrationForm.get(this.form_education_12th_percentage);
  }
  get education_UG_clg_name() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_name);
  }
  get education_UG_clg_qualification() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_qualification);
  }
  get education_UG_clg_discipline() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_discipline);
  }
  get education_UG_clg_year_passing() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_year_passing);
  }
  get education_UG_clg_marks() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_marks);
  }
  get education_UG_clg_backlogs() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_backlogs);
  }
  get resume() {
    return this.offCampusRegistrationForm.get(this.form_resume);
  }
  get filepath() {
    return this.offCampusRegistrationForm.get(`${this.form_resume}.${this.form_file_path}`);
  }
  get filename() {
    return this.offCampusRegistrationForm.get(`${this.form_resume}.${this.form_file_name}`);
  }
  get t_c() {
    return this.offCampusRegistrationForm.get(this.form_t_c);
  }

  ngOnDestroy() {
    this.getAllEducationFormDropdownListSubscription ? this.getAllEducationFormDropdownListSubscription.unsubscribe() : '';
  }
}
