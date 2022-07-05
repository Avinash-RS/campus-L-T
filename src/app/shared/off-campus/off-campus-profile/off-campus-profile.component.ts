import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog, MatDatepicker } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { environment } from 'src/environments/environment';
import { RecaptchaErrorParameters } from 'ng-recaptcha';

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
export class OffCampusProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matDialogTerms', { static: false }) matDialogRefTerms: TemplateRef<any>;
  @ViewChild('matDialogRefConfirmationPopUp', { static: false }) matDialogRefConfirmationPopUp: TemplateRef<any>;
  @ViewChild('pickerYear', { static: false }) private pickerYear: MatDatepicker<Date>;

  offCampusRegistrationForm: FormGroup;
  captachaSiteKey = environment.captachaSiteKey;
  recaptchaStr = '';

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

  yearofPassingList = [
    '2022'
  ]

  form_name = 'full_name';
  form_email = 'email';
  form_mobile = 'mobile_number';
  form_dob = 'date_of_birth';
  form_gender = 'gender';
  form_education_10th_percentage = 'sslc_marks';
  form_education_12th_percentage = 'hsc_marks';
  form_education_UG_clg_name = 'college_name';
  form_education_UG_clg_qualification = 'qualification';
  form_education_UG_clg_discipline = 'discipline';
  form_education_UG_clg_year_passing = 'year_of_passing';
  form_education_UG_clg_marks = 'graduation_marks';
  form_education_UG_clg_backlogs = 'backlogs';
  form_resume = 'resume';
  form_t_c = 'terms';
  form_eligible = 'eligible';
  form_backlogsHistory = 'backlogsHistory';
  form_otherCompanyContract = 'otherCompanyContract';
  form_misrepresentation = 'misrepresentation';
  form_terms_conditions = 'terms_conditions';

  form_file_path = 'file_path';
  form_file_type = 'filetype';
  form_file_size = 'file_size';
  form_file_name = 'filename';
  form_file_id = 'file_id';
  form_label = 'label';
  minDateDOB: Date;
  passportDateOfIssueMaxDate: Date;
  getAllEducationFormDropdownListSubscription: Subscription;
  OffCampusFormSubmissionSubscription: Subscription;
  ugQualificationList: any;
  ugDisciplineList: any;
  ugInstitutesList: any;
  selectedYear: any;
  formSubmitted: boolean;
  driveName: any;
  yopDate: Date;



  constructor(
    private fb: FormBuilder,
    private appConfig: AppConfigService,
    private gv: GlobalValidatorService,
    private candidateService: CandidateMappersService,
    private loadingService: LoaderService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.appConfig.setLocalData('submitted', false);
    this.dateValidation();
    this.registrationFormInit();
    this.getOffCampusDriveCollegeMasterDetails();
  }

  checkCaptchaBeforeSubmit(captchaSignIn) {
    if (this.recaptchaStr) {
      captchaSignIn.reset();
    }
    captchaSignIn.execute();
  }
  resolvedSignIn(captchaSignInResponse: string) {
    this.recaptchaStr = captchaSignInResponse;
    if (this.recaptchaStr) {
        this.offCampusFormSubmitConfirmation(this.recaptchaStr);
    }
  }

  onError(errorDetails: RecaptchaErrorParameters): void {}

  patchValue() {
    // Below is the sample function for development purpose, we can reuse this function whenever there is a need to update form values.
    this.offCampusRegistrationForm.patchValue({
      // [this.form_education_UG_clg_backlogs]: "89",
      [this.form_education_UG_clg_name]: "A. P. Shah Institute Of Technology",
      [this.form_dob]: this.dateConvertion("29-10-1998"),
      [this.form_education_UG_clg_year_passing]: "2022",
      [this.form_resume]: {
        [this.form_label]: 'Resume',
        [this.form_file_size]: '2933',
        [this.form_file_path]: 'add',
        [this.form_file_name]: '2933.pdf',
        [this.form_file_type]: null,
        [this.form_file_id]: '2933'  
      }
    });
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDateDOB = new Date(1998, 6, 1);
    this.passportDateOfIssueMaxDate = new Date(1998 + 5, 11, 31);
    this.yopDate = new Date(2022, 0, 1);
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

  momentFormYear(date) {
    if (date) {
      const split = moment(date).format('YYYY');
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

  getOffCampusDriveCollegeMasterDetails() {
    this.getAllEducationFormDropdownListSubscription = this.candidateService.OffCampusDriveCollegeMasterDetails().subscribe((data: any) => {
      data = data?.drive_details && data?.drive_details[0] ? data?.drive_details[0] : null;
      this.appConfig.setLocalData('driveId', data?.drive_id);
      this.driveName = data?.drive_name;
      if (data) {
        this.ugQualificationList = data && data.specifications ? data.specifications : [];
        this.ugDisciplineList = data && data.disciplines ? data.disciplines : [];
        const list = data && data.colleges ? data.colleges : [];
        const findUgOthers = list.find((data: any) => data.college_name == 'Others');
        const UgexceptOthers = list.filter((data: any) => data.college_name !== 'Others');
        findUgOthers ? UgexceptOthers.unshift(findUgOthers) :  UgexceptOthers.unshift({college_name: 'Others', id: 'Others'});
        this.ugInstitutesList = UgexceptOthers;
      }
    }, (err) => {

    });
  }

  formNotValid() {
    this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
    this.gv.validateAllFields(this.offCampusRegistrationForm);
  }

  offCampusFormSubmitConfirmation(captcharef?:any) {
    if (this.offCampusRegistrationForm.valid) {
      let confirmationPopUpref = this.dialog.open(this.matDialogRefConfirmationPopUp, {
        width: '600px',
        height: 'auto',
        id: '2',
        autoFocus: false,
        closeOnNavigation: true,
        disableClose: false,
        panelClass: 'form-confirmation-pop-up'
      });
    } else {
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.gv.validateAllFields(this.offCampusRegistrationForm);
    }
  }

  offCampusFormSubmit() {
    this.closeBox('2');
    let formValues = this.offCampusRegistrationForm.getRawValue();
    delete formValues[this.form_t_c];
    formValues[this.form_dob] = this.momentForm(formValues[this.form_dob]);
    formValues[this.form_resume] = formValues[this.form_resume][this.form_file_id];
    formValues['clientResponse'] = this.recaptchaStr ? this.recaptchaStr : '';
    let apiRequestValues = formValues;
    this.OffCampusFormSubmissionSubscription = this.candidateService.OffCampusFormSubmission(apiRequestValues).subscribe((data: any) => {
      this.formSubmitted = true;
      this.appConfig.setLocalData('submitted', true);
      this.offCampusRegistrationForm.reset();
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.UNAUTHENTICATED.OFF_CAMPUS_THANKS);
    }, (err) => {

    });
  }

  resetForm() {
    this.offCampusRegistrationForm.reset();
    return this.appConfig.nzNotification('success', 'Reset', 'Form has been reset successfully');
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
      // [this.form_education_UG_clg_backlogs]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.backlog()]],
      [this.form_resume]: this.initResumeArray(),
      [this.form_t_c]: this.initTermsConditions(),
    })
  }

  initTermsConditions() {
    return this.fb.group({
      [this.form_eligible]: [null, [Validators.requiredTrue]],
      // [this.form_backlogsHistory]: [null, [Validators.requiredTrue]],
      // [this.form_otherCompanyContract]: [null, [Validators.requiredTrue]],
      [this.form_misrepresentation]: [null, [Validators.requiredTrue]],
      // [this.form_terms_conditions]: [null, [Validators.requiredTrue]]
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
      id: '1',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'wrapper-kyc-terms'
    });
  }


  closeBox(id: any) {
    // this.matDialogRefTerms.
    let customDialog = this.dialog.getDialogById(id);
    customDialog.close();
  }

  chosenYearHandler(ev, input) {
    let { _d } = ev;
    this.selectedYear = _d;
    let customYear = this.momentFormYear(this.selectedYear);
    this.offCampusRegistrationForm.patchValue({
      [this.form_education_UG_clg_year_passing]: customYear
    });
    this.pickerYear.close();
  }

  removeFile() {
    this[this.form_resume].patchValue({
      [this.form_label]: 'Resume',
      [this.form_file_size]: null,
      [this.form_file_path]: null,
      [this.form_file_name]: null,
      [this.form_file_type]: null,
      [this.form_file_id]: null,
    });
  }
  async uploadImage(file) {
    try {
      this.loadingService.setLoading(true);
      const data = await (await this.candidateService.uploadoffCampusDocs(file)).json();
      if (data && data.error_code) {
        this.loadingService.setLoading(false);
        return this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
      }
      this.loadingService.setLoading(false);
      if (data && data.file_id) {
        this[this.form_resume].patchValue({
          [this.form_label]: 'Resume',
          [this.form_file_size]: data.file_size,
          [this.form_file_path]: data.file_path,
          [this.form_file_name]: data.file_name,
          [this.form_file_type]: data.type,
          [this.form_file_id]: data.file_id,
        });
        return this.appConfig.nzNotification('success', 'Uploaded', 'Document uploaded successfully');
      }
    }
    catch (e) {
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

          fd.append('user_id', this.email.value ? this.email.value : 'off-campus-user');
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
  // get education_UG_clg_backlogs() {
  //   return this.offCampusRegistrationForm.get(this.form_education_UG_clg_backlogs);
  // }
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
  get terms_conditions() {
    return this.offCampusRegistrationForm.get(`${this.form_t_c}.${this.form_terms_conditions}`);
  }
  get eligible() {
    return this.offCampusRegistrationForm.get(`${this.form_t_c}.${this.form_eligible}`);
  }
  get backlogsHistory() {
    return this.offCampusRegistrationForm.get(`${this.form_t_c}.${this.form_backlogsHistory}`);
  }
  get otherCompanyContract() {
    return this.offCampusRegistrationForm.get(`${this.form_t_c}.${this.form_otherCompanyContract}`);
  }
  get misrepresentation() {
    return this.offCampusRegistrationForm.get(`${this.form_t_c}.${this.form_misrepresentation}`);
  }


  ngOnDestroy() {
    this.getAllEducationFormDropdownListSubscription ? this.getAllEducationFormDropdownListSubscription.unsubscribe() : '';
    this.OffCampusFormSubmissionSubscription ? this.OffCampusFormSubmissionSubscription.unsubscribe() : '';
  }
}
