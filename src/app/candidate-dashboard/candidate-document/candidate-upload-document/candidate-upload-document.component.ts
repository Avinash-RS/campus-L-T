import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog, MatAccordion } from '@angular/material';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import moment from 'moment';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { LoaderService } from 'src/app/services/loader-service.service';

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
  selector: 'app-candidate-upload-document',
  templateUrl: './candidate-upload-document.component.html',
  styleUrls: ['./candidate-upload-document.component.scss'],
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
export class CandidateUploadDocumentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matDialog', {static: false}) matDialogRef: TemplateRef<any>;
  @ViewChild('noDocs', {static: false}) matNoDocs: TemplateRef<any>;
  @ViewChild(MatAccordion, {static: false}) accordion: MatAccordion;
  step = 0;
  getEducationDocuments: any[];
  educationNotUploadedDocs: any[];
  getResumeDocuments: any[];
  resumeNotUploadedDocs: any[];
  getTransferDocuments: any[];
  transferNotUploadedDocs: any[];
  getOtherCertificationDocuments: any[];
  getbankDocuments: any[];
  bankNotUploadedDocs: any[];
  IsreasonAvailable: any;
  isReasonDate: any;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  semesterList = ['1','2','3','4','5','6','7','8','9','10'];
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  uploadForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  conditionJoining = 'joining';
  conditionEducation = 'education';
  conditionTransfer = 'transfer';
  conditionResume = 'resume';
  conditionOther = 'others';
  conditionCert = 'cert';
  conditionBank = 'bank';
  //Joining Variables
  form_joiningArray = 'joining_details';
  form_file_id = 'file_id';
  form_id = 'id';
  form_file_path = 'file_path';
  form_file_type = 'filetype';
  form_file_size = 'file_size';
  form_file_name = 'filename';
  form_name = 'name';
  form_label = 'label';
  form_description = 'description';
  form_Not_Submitted_Description = 'not_submitted_description';
  form_expectedDate = 'expected_date';

  // Education variables
  form_educationArray = 'education_documents';
  form_semesterArray = 'sub_documents';
  form_noofSemester = 'no_of_semester';
  form_education_level = 'education_level';
  form_eourse_Completion = 'course_completion_certificate';
  form_degree_Completion = 'degree_completion_certificate';

  // Resume Variables
  form_resumeArray = 'resume';

  // Transfer certificate Variables
  form_transferCertArray = 'transfer_certificate';

  // Other certificate Variables
  form_otherCertArray = 'other_certifications';

  // Certifications array
  form_CertificationArray = 'certifications';
  getCertificationDocuments: any;
  // Banking
  form_bankArray = 'banking_details';
  form_acc_no = 'account_no';
  form_ifsc_code = 'ifsc_code';
  form_branch = 'branch';

  dependedentDetails: any;
  downloadabledocs: any;
  pdfsrc: any;
  selectedImage: any;
  hoverHide: any;
  getJoiningDocuments: any;
  expectedDate = new FormControl(null, [Validators.required]);
  reason = new FormControl(null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]);
  joiningNotUploadedDocs: any[];
  isRoute: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private loadingService: LoaderService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService,
    private dialog: MatDialog,
  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.formInitialize();
    this.getDocuments();
    this.getDownloadableDocs();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  formInitialize() {
    this.uploadForm = this.fb.group({
      [this.form_joiningArray]: this.fb.array([]),
      [this.form_educationArray]: this.fb.array([]),
      [this.form_transferCertArray]: this.fb.array([]),
      [this.form_resumeArray]: this.fb.array([]),
      [this.form_bankArray]: this.fb.array([]),
      [this.form_CertificationArray]: this.fb.array([]),
      [this.form_otherCertArray]: this.fb.array([]),
    })
  }

  getDocuments() {
      let apiData = {
        form_name: 'documents_upload',
        section_name: 'document_details'
      }
      this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
        let apiDocumentDetails = data;
        this.ifDocumentDetails(apiDocumentDetails);
      });
  }

  ifDocumentDetails(data) {
    this.getJoiningDocuments = data && data['joining_details'] ? data['joining_details'] : [];
    this.getEducationDocuments = data && data['education_documents'] ? data['education_documents'] : [];
    this.getResumeDocuments = data && data['resume'] ? data['resume'] : [];
    this.getTransferDocuments = data && data['transfer_certificate'] ? data['transfer_certificate'] : [];
    this.getbankDocuments = data && data['banking_details'] ? data['banking_details'] : [];
    this.getCertificationDocuments = data && data['certifications'] ? data['certifications'] : [];
    this.getOtherCertificationDocuments = data && data['other_certifications'] ? data['other_certifications'] : [];
    this.checkJoiningArrayinitalize();
  }

  ifNotDocumentDetails() {

  }

  checkNotSubmittedReasonAndDate(element) {
    if (!this.IsreasonAvailable) {
      this.IsreasonAvailable = element[this.form_Not_Submitted_Description] ? element[this.form_Not_Submitted_Description] : null;
      this.isReasonDate = element[this.form_expectedDate] ? element[this.form_expectedDate] : null;
    }
  }
  checkJoiningArrayinitalize() {
    if (this.candidateService.checkKycOrJoiningForm() || true) {
    // Joining
    let arr = [];
    this.getJoiningDocuments.forEach(element => {
      if (element) {
        arr.push(element);
      }
    });
    this.getJoiningDocuments = arr;
    if (this.getJoiningDocuments && this.getJoiningDocuments.length > 0) {
      this.getJoiningDocuments.forEach(element => {
        this.checkNotSubmittedReasonAndDate(element);
        this.getJoiningArr.push(this.patchJoiningArray(element));
      });
    } else {
      this.getJoiningArr.push(this.initJoiningArray());
    }

  // Education
    if (this.getEducationDocuments && this.getEducationDocuments.length > 0) {
      this.getEducationDocuments.forEach(element => {
        if (!element[this.form_semesterArray]) {
          element[this.form_semesterArray] = [];
        }
        this.getEducationArr.push(this.patchEducationArray(element));
      });
    } else {
      this.getEducationArr.push(this.initEducationArray());
    }

      // Trans
      if (this.getTransferDocuments && this.getTransferDocuments.length > 0) {
        this.getTransferDocuments.forEach(element => {
          this.checkNotSubmittedReasonAndDate(element);
          this.getTransferArr.push(this.patchJoiningArray(element));
        });
      } else {
        this.getTransferArr.push(this.initTransferArray());
      }

      // Banking Details
      if (this.getbankDocuments && this.getbankDocuments.length > 0) {
        this.getbankDocuments.forEach(element => {
          this.checkNotSubmittedReasonAndDate(element);
          this.getBankArr.push(this.patchBankingArray(element));
        });
      } else {
        this.getBankArr.push(this.initBankingArray());
      }

      // Other Certifications
      if (this.getOtherCertificationDocuments && this.getOtherCertificationDocuments.length > 0) {
        this.getOtherCertificationDocuments.forEach(element => {
          this.getOtherCertArr.push(this.patchJoiningArray(element, 'otherCert'));
        });
      } else {
        // this.getOtherCertArr.push(this.initJoiningArray());
      }

      // Certifications
      if (this.getCertificationDocuments && this.getCertificationDocuments.length > 0) {
        this.getCertificationDocuments.forEach(element => {
          this.getCertificationsArr.push(this.patchJoiningArray(element, 'otherCert'));
        });
      } else {
        // this.getOtherCertArr.push(this.initJoiningArray());
      }

      this.patchNotSubmittedReason();

    }
    // Resume
    if (this.getResumeDocuments && this.getResumeDocuments.length > 0 && this.getResumeDocuments[0] && this.getResumeDocuments[0][this.form_name]) {
      this.getResumeDocuments.forEach(element => {
        this.checkNotSubmittedReasonAndDate(element);
        this.getResumeArr.push(this.patchResumeArray(element));
      });
    } else {
      this.getResumeArr.push(this.initResumeArray());
    }

  }

  patchNotSubmittedReason() {
    if (this.IsreasonAvailable) {
      this.reason.patchValue(this.IsreasonAvailable);
      this.isReasonDate ? this.expectedDate.patchValue(this.dateConvertion(this.isReasonDate)) : ''
    }
  }

  patchJoiningArray(data, otherCert?) {
    return this.fb.group({
      [this.form_name]: [data[this.form_name], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_label]: [data[this.form_label], (otherCert == 'otherCert' ? [Validators.required, this.glovbal_validators.alphaNum255()] : [Validators.nullValidator])],
      // [this.form_id]: [data[this.form_id]],
      [this.form_file_size]: [data[this.form_file_size]],
      [this.form_file_path]: [data[this.form_file_path]],
      [this.form_file_name]: [data[this.form_file_name]],
      [this.form_file_type]: [data[this.form_file_type]],
      [this.form_file_id]: [data[this.form_file_id]],
      [this.form_description]: [data[this.form_description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_Not_Submitted_Description]: [data[this.form_Not_Submitted_Description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_expectedDate]: [data[this.form_expectedDate]],
    })
  }

  patchResumeArray(data, otherCert?) {
    return this.fb.group({
      [this.form_name]: [data[this.form_name], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_label]: [data[this.form_label], (otherCert == 'otherCert' ? [Validators.required, this.glovbal_validators.alphaNum255()] : [Validators.nullValidator])],
      // [this.form_id]: [data[this.form_id]],
      [this.form_file_size]: [data[this.form_file_size]],
      [this.form_file_path]: [data[this.form_file_path], [Validators.required]],
      [this.form_file_name]: [data[this.form_file_name]],
      [this.form_file_type]: [data[this.form_file_type]],
      [this.form_file_id]: [data[this.form_file_id]],
      [this.form_description]: [data[this.form_description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_Not_Submitted_Description]: [data[this.form_Not_Submitted_Description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_expectedDate]: [data[this.form_expectedDate]],
    })
  }

  patchEducationArray(data) {
    return this.fb.group({
      [this.form_education_level]: [data[this.form_education_level]],
      [this.form_noofSemester]: [data[this.form_noofSemester], (data[this.form_education_level] != 'SSLC' && data[this.form_education_level] != 'HSC' ? [Validators.required] : null)],
      [this.form_semesterArray]: data[this.form_semesterArray] && data[this.form_semesterArray].length > 0 ? this.patchSubArray(data[this.form_noofSemester], data[this.form_education_level], data) : this.patchSubInitArray(data[this.form_education_level], data)
    });
  }

  patchSemesterArray(data, level) {
    return this.fb.group({
      [this.form_name]: level == 'SSLC' || level == 'HSC' ? level : [data[this.form_name]],
      [this.form_label]: level == 'SSLC' || level == 'HSC' ? level + ' Certificate' : [data[this.form_label]],
      [this.form_file_size]: [data[this.form_file_size]],
      [this.form_file_path]: [data[this.form_file_path]],
      [this.form_file_name]: [data[this.form_file_name]],
      [this.form_file_type]: [data[this.form_file_type]],
      [this.form_file_id]: [data[this.form_file_id]],
      [this.form_description]: [data[this.form_description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_Not_Submitted_Description]: [data[this.form_Not_Submitted_Description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_expectedDate]: [data[this.form_expectedDate] ? this.dateConvertion(data[this.form_expectedDate]) : null]
    })
  }

  patchSubArray(semestercount, level, form) {
    let subSem = [];
    if (form[this.form_semesterArray].length > 0) {
      form[this.form_semesterArray].forEach(element => {
        this.checkNotSubmittedReasonAndDate(element);
        subSem.push(this.patchSemesterArray(element, level));
      });
      return this.fb.array(subSem);
    }
  }
  patchSubInitArray(level, form) {
    if (level == 'SSLC' || level == 'HSC') {
      let data = {
        label: level == 'SSLC' ? 'SSLC Certificate' : 'HSC Certificate',
        name: level
      }
       return this.fb.array([this.initSemesterArray(data)]);
    } else {
      return this.fb.array([]);
    }
  }

  initJoiningArray(otherCert?) {
    return this.fb.group({
      [this.form_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_label]: [null, (otherCert == 'otherCert' ? [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()] : [Validators.nullValidator])],
      // [this.form_id]: [null],
      [this.form_file_size]: [null],
      [this.form_file_path]: [null],
      [this.form_file_name]: [null],
      [this.form_file_type]: [null],
      [this.form_file_id]: [null],
      [this.form_description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_Not_Submitted_Description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_expectedDate]: [null]
    })
  }

  initTransferArray() {
    return this.fb.group({
      [this.form_name]: ['Transfer Certificate', [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_label]: ['Transfer Certificate'],
      // [this.form_id]: [null],
      [this.form_file_size]: [null],
      [this.form_file_path]: [null],
      [this.form_file_name]: [null],
      [this.form_file_type]: [null],
      [this.form_file_id]: [null],
      [this.form_description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_Not_Submitted_Description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_expectedDate]: [null]
    })
  }

  initResumeArray() {
    return this.fb.group({
      [this.form_name]: ['Resume', [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_label]: ['Resume'],
      // [this.form_id]: [null],
      [this.form_file_size]: [null],
      [this.form_file_path]: [null, [Validators.required]],
      [this.form_file_name]: [null],
      [this.form_file_type]: [null],
      [this.form_file_id]: [null],
      [this.form_description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_Not_Submitted_Description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_expectedDate]: [null]
    })
  }

  patchBankingArray(data) {
    return this.fb.group({
      [this.form_name]: [data[this.form_name]],
      [this.form_label]: [data[this.form_label], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]], // Bank name
      [this.form_acc_no]: [data[this.form_acc_no], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.numberOnly(), Validators.maxLength(50)]],
      [this.form_ifsc_code]: [data[this.form_ifsc_code], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_branch]: [data[this.form_branch], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_id]: [data[this.form_id]],
      [this.form_file_size]: [data[this.form_file_size]],
      [this.form_file_path]: [data[this.form_file_path]],
      [this.form_file_name]: [data[this.form_file_name]],
      [this.form_file_type]: [data[this.form_file_type]],
      [this.form_file_id]: [data[this.form_file_id]],
      [this.form_description]: [data[this.form_description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_Not_Submitted_Description]: [data[this.form_Not_Submitted_Description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_expectedDate]: [data[this.form_expectedDate]],
    })
  }

  initBankingArray() {
    return this.fb.group({
      [this.form_name]: ['Banking'],
      [this.form_label]: ['Banking', [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]], // Bank name
      [this.form_acc_no]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.numberOnly(), Validators.maxLength(50)]],
      [this.form_ifsc_code]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_branch]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_id]: [null],
      [this.form_file_size]: [null],
      [this.form_file_path]: [null],
      [this.form_file_name]: [null],
      [this.form_file_type]: [null],
      [this.form_file_id]: [null],
      [this.form_description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_Not_Submitted_Description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_expectedDate]: [null]
    })
  }

  initSemesterArray(data?) {
    return this.fb.group({
      [this.form_name]: [data ? data.name : null],
      [this.form_label]: [data ? data.label : null],
      [this.form_file_size]: [null],
      [this.form_file_path]: [null],
      [this.form_file_name]: [null],
      [this.form_file_type]: [null],
      [this.form_file_id]: [null],
      [this.form_description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_Not_Submitted_Description]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_expectedDate]: [null]
    })
  }
  initEducationArray() {
    return this.fb.group({
      [this.form_education_level]: [null],
      [this.form_noofSemester]: [null, [Validators.required]],
      [this.form_semesterArray]: this.fb.array([this.initSemesterArray()]),
    });
  }

  removeInOtherArray(i) {
    this.getOtherCertArr.removeAt(i);
  }
  addToOtherArray(i?: any) {
   if (this.getOtherCertArr.valid) {
    return this.getOtherCertArr.push(this.initJoiningArray('otherCert'));
    }
    this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_otherCertArray]) as FormArray);
  }

  removeInCertificationsArray(i) {
    this.getCertificationsArr.removeAt(i);
  }
  addToCertificationsArray(i?: any) {
   if (this.getCertificationsArr.valid) {
    return this.getCertificationsArr.push(this.initJoiningArray('otherCert'));
    }
    this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_CertificationArray]) as FormArray);
  }

  addToSemesterArray(i?: any) {
    return this.getSemesterArr(i).push(this.initSemesterArray());
  }

  removeInSemesterArray(i, j) {
    this.getSemesterArr(i).removeAt(j);
  }

  changeSemesterCount(form, formIndex) {
    form['controls'][this.form_noofSemester].markAsTouched({ onlySelf: true });

    let nosemCount = form.value[this.form_noofSemester] ? form.value[this.form_noofSemester] : 0;
    let NoOfSemcount = Number(nosemCount) + 1;
    let level = form.value[this.form_education_level];
    let existingSemCount = form.value[this.form_semesterArray].length;
    this.addOrRemoveArray(level, NoOfSemcount, existingSemCount, form, formIndex);
  }

  addOrRemoveArray(level, NoOfSemcount, existingSemCount, form, formIndex) {
    level = level == 'Diploma' ? 'Diploma' : 'Degree';
    let data: any;
      if (existingSemCount == 0) {
        for (let i = 0; i < NoOfSemcount; i++) {
          if (i == 0) {
            data = {
              label: `${level} or Provisional Certificate`,
              name: 'degreeOrProvision'
            }
          this.getSemesterArr(formIndex).push(this.initSemesterArray(data));
        }
          if (i > 0) {
            data = {
              label: `Semester ${i}`,
              name: `sem${i}`
            }
            this.getSemesterArr(formIndex).push(this.initSemesterArray(data));
          }
        }
      } else if (existingSemCount != 0 && (NoOfSemcount > existingSemCount)) {
        let i = existingSemCount;
        for (i; i < NoOfSemcount; i++) {
          if (i == 0) {
            data = {
              label: level == 'Diploma' ? `${level} Certificate or Provisional Certificate` : `${level} or Provisional Certificate`,
              name: 'degreeOrProvision'
            }
          this.getSemesterArr(formIndex).push(this.initSemesterArray(data));
        }
          if (i > 0) {
            data = {
              label: `Semester ${i}`,
              name: `sem${i}`
            }
            this.getSemesterArr(formIndex).push(this.initSemesterArray(data));
          }
        }
      } else {
        let i = existingSemCount;
        for (i; i >= NoOfSemcount; i--) {
          this.getSemesterArr(formIndex).removeAt(i);
        }
      }
  }

  validateNotUploaded() {
  if (this.reason.valid && this.expectedDate.valid) {
    this.dialog.closeAll();
    // Joining Mapping of reason and expected value
    let joiningArray = this.getJoiningArr.getRawValue();
    joiningArray.forEach((element, i) => {
        // Nulling the not sub and exp date
        this.getJoiningArr.at(i).patchValue({
        [this.form_Not_Submitted_Description]: null,
        [this.form_expectedDate]: null
      });
       // If file path not found, patching the not sub desc and exp date
       if (!element[this.form_file_path]) {
    this.getJoiningArr.at(i).patchValue({
      [this.form_file_name]: null,
      [this.form_file_id]: null,
      [this.form_file_path]: null,
      [this.form_file_size]: null,
      [this.form_file_type]: null,
      [this.form_Not_Submitted_Description]: this.reason.value,
      [this.form_expectedDate]: this.momentForm(this.expectedDate.value)
    });
    }
    });

      // Transfer Mapping of reason and expected value
      let transferArray = this.getTransferArr.getRawValue();
      transferArray.forEach((element, i) => {
          // Nulling the not sub and exp date
          this.getTransferArr.at(i).patchValue({
          [this.form_Not_Submitted_Description]: null,
          [this.form_expectedDate]: null
        });
          // If file path not found, patching the not sub desc and exp date
          if (!element[this.form_file_path]) {
      this.getTransferArr.at(i).patchValue({
        [this.form_file_name]: null,
        [this.form_file_id]: null,
        [this.form_file_path]: null,
        [this.form_file_size]: null,
        [this.form_file_type]: null,
        [this.form_Not_Submitted_Description]: this.reason.value,
        [this.form_expectedDate]: this.momentForm(this.expectedDate.value)
      });
      }
      });


      // Resume Mapping of reason and expected value
      let resumeArray = this.getResumeArr.getRawValue();
      resumeArray.forEach((element, i) => {
          // Nulling the not sub and exp date
          this.getResumeArr.at(i).patchValue({
          [this.form_Not_Submitted_Description]: null,
          [this.form_expectedDate]: null
        });
          // If file path not found, patching the not sub desc and exp date
          if (!element[this.form_file_path]) {
      this.getResumeArr.at(i).patchValue({
        [this.form_file_name]: null,
        [this.form_file_id]: null,
        [this.form_file_path]: null,
        [this.form_file_size]: null,
        [this.form_file_type]: null,
        [this.form_Not_Submitted_Description]: this.reason.value,
        [this.form_expectedDate]: this.momentForm(this.expectedDate.value)
      });
      }
      });

        // Bank Mapping of reason and expected value
        let bankArray = this.getBankArr.getRawValue();
        bankArray.forEach((element, i) => {
            // Nulling the not sub and exp date
            this.getBankArr.at(i).patchValue({
            [this.form_Not_Submitted_Description]: null,
            [this.form_expectedDate]: null
          });
            // If file path not found, patching the not sub desc and exp date
            if (!element[this.form_file_path]) {
        this.getBankArr.at(i).patchValue({
          [this.form_file_name]: null,
          [this.form_file_id]: null,
          [this.form_file_path]: null,
          [this.form_file_size]: null,
          [this.form_file_type]: null,
          [this.form_Not_Submitted_Description]: this.reason.value,
          [this.form_expectedDate]: this.momentForm(this.expectedDate.value)
        });
        }
        });

    // Education Mapping of reason and expected value
    let educationArray = this.getEducationArr.getRawValue();
    educationArray.forEach((ele, i) => {
      ele[this.form_semesterArray].forEach((element, subIndex) => {
        // Nulling the not sub and exp date
        this.getSemesterArr(i).at(subIndex).patchValue({
        [this.form_Not_Submitted_Description]: null,
        [this.form_expectedDate]: null
        });
       // If file path not found, patching the not sub desc and exp date
       if (!element[this.form_file_path]) {
          this.getSemesterArr(i).at(subIndex).patchValue({
            [this.form_file_name]: null,
            [this.form_file_id]: null,
            [this.form_file_path]: null,
            [this.form_file_size]: null,
            [this.form_file_type]: null,
            [this.form_Not_Submitted_Description]: this.reason.value,
            [this.form_expectedDate]: this.momentForm(this.expectedDate.value)
          });
        }
      });
    });

    // other
    let otherCertArray = this.getOtherCertArr.getRawValue();
    otherCertArray.forEach((element, i) => {
      if (!element[this.form_file_path]) {
        this.getOtherCertArr.removeAt(i);
      }
      if (element[this.form_file_path]) {
        this.getOtherCertArr.at(i).patchValue({
          [this.form_name]: this.form_label
        });
        }
    });

    // Certifications
    let certificationsArray = this.getCertificationsArr.getRawValue();
    certificationsArray.forEach((element, i) => {
      if (!element[this.form_file_path]) {
        this.getCertificationsArr.removeAt(i);
      }
      if (element[this.form_file_path]) {
        this.getCertificationsArr.at(i).patchValue({
          [this.form_name]: this.form_label
        });
        }
    });

    this.finalSubmit(this.isRoute ? this.isRoute : '');
  } else {
    this.reason.markAllAsTouched();
    this.expectedDate.markAllAsTouched();
  }
}

  formSubmit(routeValue?: any) {
    if (this.uploadForm.valid) {
    if (this.checkJoiningNotUploaded()) {
      this.openNodocs(routeValue ? routeValue : '');
    } else {
      this.beforeSubmit(routeValue ? routeValue : '');
    }
    } else {
      this.ngAfterViewInit();
      this.accordion.openAll();
      this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_resumeArray]) as FormArray);
      this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_educationArray]) as FormArray);
      this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_bankArray]) as FormArray);
      this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_CertificationArray]) as FormArray);
      this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_otherCertArray]) as FormArray);
      if (this.getEducationArr.invalid) {
        return this.appConfig.nzNotification('error', 'Education Uploads', 'Please fill all the red highlighted fields in Education Uploads to proceed further');
      }
      if (this.getBankArr.invalid) {
        return this.appConfig.nzNotification('error', 'Banking Details', 'Please fill all the red highlighted fields in Banking Details to proceed further');
      }
      if (this.getCertificationsArr.invalid) {
        return this.appConfig.nzNotification('error', 'Certification Uploads', 'Please fill all the red highlighted fields in Other Certifications to proceed further');
      }
      if (this.getOtherCertArr.invalid) {
        return this.appConfig.nzNotification('error', 'Other Certifications', 'Please fill all the red highlighted fields in Other Certifications to proceed further');
      } else {
        this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      }
    }
  }


  checkJoiningNotUploaded() {
    let isValid = {
      joining: true,
      education: true,
      transfer: true,
      resume: true,
      bank: true,
      other: true,
    }
    // Joining
    let joiningArray = this.uploadForm.getRawValue()[this.form_joiningArray];
    this.joiningNotUploadedDocs = [];
    joiningArray.forEach(element => {
      if (!element[this.form_file_path]) {
        let ele = {
          label: element[this.form_label],
        }
        this.joiningNotUploadedDocs.push(ele);
      }
    });

    if (this.joiningNotUploadedDocs && this.joiningNotUploadedDocs.length > 0) {
      isValid.joining = false;
    }

    // Transfer
    let transferArray = this.uploadForm.getRawValue()[this.form_transferCertArray];
    this.transferNotUploadedDocs = [];
    transferArray.forEach(element => {
      if (!element[this.form_file_path]) {
        let ele = {
          label: element[this.form_label],
        }
        this.transferNotUploadedDocs.push(ele);
      }
    });

    if (this.transferNotUploadedDocs && this.transferNotUploadedDocs.length > 0) {
      isValid.transfer = false;
    }

    // Resume
    let resumeArray = this.uploadForm.getRawValue()[this.form_resumeArray];
    this.resumeNotUploadedDocs = [];
    resumeArray.forEach(element => {
      if (!element[this.form_file_path]) {
        let ele = {
          label: element[this.form_label],
        }
        this.resumeNotUploadedDocs.push(ele);
      }
    });

    if (this.resumeNotUploadedDocs && this.resumeNotUploadedDocs.length > 0) {
      isValid.resume = false;
    }

    // Banking
    let bankArray = this.uploadForm.getRawValue()[this.form_bankArray];
    this.bankNotUploadedDocs = [];
    bankArray.forEach(element => {
      if (!element[this.form_file_path]) {
        let ele = {
          label: 'Bank Passbook Front Page or Bank Cheque Leaf',
        }
        this.bankNotUploadedDocs.push(ele);
      }
    });

    if (this.bankNotUploadedDocs && this.bankNotUploadedDocs.length > 0) {
      isValid.bank = false;
    }


    // Education
    let educationArray = this.uploadForm.getRawValue()[this.form_educationArray];
    this.educationNotUploadedDocs = [];
    educationArray.forEach(element => {
      let subData = {
        label: element[this.form_education_level],
        subDocs: []
      };
      element[this.form_semesterArray].forEach(sub => {
          if (!sub[this.form_file_path]) {
          subData.subDocs.push({'label': sub[this.form_label]});
        }
      });
      subData.subDocs.length > 0 ? this.educationNotUploadedDocs.push(subData) : '';
    });
    if (this.educationNotUploadedDocs && this.educationNotUploadedDocs.length > 0) {
      isValid.education = false;
    }

    let finalValidCheck = JSON.stringify(isValid);
    return finalValidCheck.includes('false') ? true : false;
  }

  beforeSubmit(routeValue?: any) {
    // Joining Nulling the not sub desc and exp date.
    let joiningArray = this.getJoiningArr.getRawValue();
    joiningArray.forEach((element, i) => {
      if (element[this.form_file_path]) {
      this.getJoiningArr.at(i).patchValue({
      [this.form_Not_Submitted_Description]: null,
      [this.form_expectedDate]: null
    });
      }
    });

    // Transfer Nulling the not sub desc and exp date.
    let transferArray = this.getTransferArr.getRawValue();
    transferArray.forEach((element, i) => {
      if (element[this.form_file_path]) {
      this.getTransferArr.at(i).patchValue({
      [this.form_Not_Submitted_Description]: null,
      [this.form_expectedDate]: null
    });
      }
    });

      // Resume Nulling the not sub desc and exp date.
      let resumeArray = this.getResumeArr.getRawValue();
      resumeArray.forEach((element, i) => {
        if (element[this.form_file_path]) {
        this.getResumeArr.at(i).patchValue({
        [this.form_Not_Submitted_Description]: null,
        [this.form_expectedDate]: null
      });
        }
      });

    // Banking Nulling the not sub desc and exp date.
    let bankingArray = this.getBankArr.getRawValue();
    bankingArray.forEach((element, i) => {
      if (element[this.form_file_path]) {
      this.getBankArr.at(i).patchValue({
      [this.form_Not_Submitted_Description]: null,
      [this.form_expectedDate]: null
    });
      }
    });

    // Education Nulling the not sub desc and exp date.
    let educationArray = this.getEducationArr.getRawValue();
    educationArray.forEach((ele, i) => {
      ele[this.form_semesterArray].forEach((element, subIndex) => {
       if (element[this.form_file_path]) {
          this.getSemesterArr(i).at(subIndex).patchValue({
            [this.form_Not_Submitted_Description]: null,
            [this.form_expectedDate]: null
          });
        }
      });
    });

    // Other
    let otherCertArray = this.getOtherCertArr.getRawValue();
    otherCertArray.forEach((element, i) => {
      if (!element[this.form_file_path]) {
        this.getOtherCertArr.removeAt(i);
      }
      if (element[this.form_file_path]) {
        this.getOtherCertArr.at(i).patchValue({
          [this.form_name]: this.form_label
        });
        }
    });

      // Certificatopms
      let certificationsArray = this.getCertificationsArr.getRawValue();
      certificationsArray.forEach((element, i) => {
        if (!element[this.form_file_path]) {
          this.getCertificationsArr.removeAt(i);
        }
        if (element[this.form_file_path]) {
          this.getCertificationsArr.at(i).patchValue({
            [this.form_name]: this.form_label
          });
          }
      });

    this.finalSubmit(routeValue ? routeValue : '');
  }

  finalSubmit(routeValue?: any) {
    let joiningArray = this.getJoiningArr.getRawValue();
    let educationArray = this.getEducationArr.getRawValue();
    let transferArray = this.getTransferArr.getRawValue();
    let resumeArray = this.getResumeArr.getRawValue();
    let bankArray = this.getBankArr.getRawValue();
    let certArray = this.getCertificationsArr.getRawValue();
    let otherArray = this.getOtherCertArr.getRawValue();
    const apiData = {
      joining_details: joiningArray,
      education_documents: educationArray,
      resume: resumeArray,
      certifications: certArray,
      other_certifications: otherArray,
      transfer_certificate: transferArray,
      banking_details: bankArray
    }
    const UploadApiRequestDetails = {
      form_name: "documents_upload",
      section_name: "document_details",
      saving_data: apiData
    }

    // if(this.dependentForm.valid) {
      this.candidateService.newSaveProfileData(UploadApiRequestDetails).subscribe((data: any)=> {
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? 'Document details updated successfully' : 'Document details updated successfully');
      });
  }

async uploadImage(file, i, form) {
  try {
    this.loadingService.setLoading(true);
    const data = await (await this.candidateService.uploadJoiningDocs(file)).json();
    if (data && data.error_code) {
      this.loadingService.setLoading(false);
     return this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
    }
    this.loadingService.setLoading(false);
    // this.candidateService.uploadCandidateDocument(fd).subscribe((data: any) => {
    if (data && data.file_id) {
      if (form == this.conditionJoining) {
      this.getJoiningArr.at(i).patchValue({
        [this.form_file_name]: data.file_name,
        [this.form_file_id]: data.file_id,
        [this.form_file_path]: data.file_path,
        [this.form_file_size]: data.file_size,
        [this.form_file_type]: data.type,
      });
    }
    if (form == this.conditionTransfer) {
      this.getTransferArr.at(i).patchValue({
        [this.form_file_name]: data.file_name,
        [this.form_file_id]: data.file_id,
        [this.form_file_path]: data.file_path,
        [this.form_file_size]: data.file_size,
        [this.form_file_type]: data.type,
      });
    }
    if (form == this.conditionResume) {
      this.getResumeArr.at(i).patchValue({
        [this.form_file_name]: data.file_name,
        [this.form_file_id]: data.file_id,
        [this.form_file_path]: data.file_path,
        [this.form_file_size]: data.file_size,
        [this.form_file_type]: data.type,
      });
    }
    if (form == this.conditionBank) {
      this.getBankArr.at(i).patchValue({
        [this.form_file_name]: data.file_name,
        [this.form_file_id]: data.file_id,
        [this.form_file_path]: data.file_path,
        [this.form_file_size]: data.file_size,
        [this.form_file_type]: data.type,
      });
    }
    if (form == this.conditionCert) {
      this.getCertificationsArr.at(i).patchValue({
        [this.form_file_name]: data.file_name,
        [this.form_file_id]: data.file_id,
        [this.form_file_path]: data.file_path,
        [this.form_file_size]: data.file_size,
        [this.form_file_type]: data.type,
      });
    }
    if (form == this.conditionOther) {
      this.getOtherCertArr.at(i).patchValue({
        [this.form_file_name]: data.file_name,
        [this.form_file_id]: data.file_id,
        [this.form_file_path]: data.file_path,
        [this.form_file_size]: data.file_size,
        [this.form_file_type]: data.type,
      });
    }
    }

    this.appConfig.nzNotification('success', 'Uploaded', 'Document uploaded successfully');
  } catch (e) {
    this.loadingService.setLoading(false);
    this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');

  }
  // }, (err) => {

  // });
}

removeFile(i, form) {
  if (form == this.conditionJoining) {
    this.getJoiningArr.at(i).patchValue({
    [this.form_file_name]: null,
    [this.form_file_id]: null,
    [this.form_file_path]: null,
    [this.form_file_size]: null,
    [this.form_file_type]: null,
  });
}
if (form == this.conditionTransfer) {
  this.getTransferArr.at(i).patchValue({
  [this.form_file_name]: null,
  [this.form_file_id]: null,
  [this.form_file_path]: null,
  [this.form_file_size]: null,
  [this.form_file_type]: null,
});
}
if (form == this.conditionResume) {
  this.getResumeArr.at(i).patchValue({
  [this.form_file_name]: null,
  [this.form_file_id]: null,
  [this.form_file_path]: null,
  [this.form_file_size]: null,
  [this.form_file_type]: null,
});
}
if (form == this.conditionBank) {
  this.getBankArr.at(i).patchValue({
  [this.form_file_name]: null,
  [this.form_file_id]: null,
  [this.form_file_path]: null,
  [this.form_file_size]: null,
  [this.form_file_type]: null,
});
}
if (form == this.conditionCert) {
  this.getCertificationsArr.at(i).patchValue({
  [this.form_file_name]: null,
  [this.form_file_id]: null,
  [this.form_file_path]: null,
  [this.form_file_size]: null,
  [this.form_file_type]: null,
});
}
if (form == this.conditionOther) {
  this.getOtherCertArr.at(i).patchValue({
  [this.form_file_name]: null,
  [this.form_file_id]: null,
  [this.form_file_path]: null,
  [this.form_file_size]: null,
  [this.form_file_type]: null,
});
}

  this.selectedImage = null;
}

onSelectFile(event, i, form) {
  if (form == this.conditionJoining && this.getJoiningArr.at(i).value[this.form_name] == 'PhotoID') {
    return this.onPhotoUpload(event, i, form);
  }
  if (form == this.conditionBank && this.getBankArr.at(i).value[this.form_name] == 'Banking' || form == this.conditionJoining && this.getJoiningArr.at(i).value[this.form_name] == 'Aadhar' || form == this.conditionJoining && this.getJoiningArr.at(i).value[this.form_name] == 'PAN' || form == this.conditionJoining && this.getJoiningArr.at(i).value[this.form_name] == 'CasteDeclaration' || form == this.conditionTransfer && this.getTransferArr.at(i).value[this.form_name] == 'TransferCertificate'
  ) {
    if (event.target.files && (event.target.files[0].type.includes('application/pdf'))) {
    } else {
      return this.onPhotoUpload(event, i, form);
    }
  }
  const fd = new FormData();
    if (event.target.files && (event.target.files[0].type.includes('application/pdf'))) {
      if (event.target.files[0].size < 2000000) {
        this.selectedImage = event.target.files[0];

        if (form == this.conditionJoining) {
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.getJoiningArr.at(i).value[this.form_description]);
          fd.append('label', form);
          fd.append('level', this.getJoiningArr.at(i).value[this.form_name]);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, i, form);
        }
        if (form == this.conditionTransfer) {
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.getTransferArr.at(i).value[this.form_description]);
          fd.append('label', form);
          fd.append('level', this.getTransferArr.at(i).value[this.form_name]);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, i, form);
        }
        if (form == this.conditionResume) {
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.getResumeArr.at(i).value[this.form_description]);
          fd.append('label', form);
          fd.append('level', this.getResumeArr.at(i).value[this.form_name]);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, i, form);
        }
        if (form == this.conditionBank) {
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.getBankArr.at(i).value[this.form_description]);
          fd.append('label', form);
          fd.append('level', this.getBankArr.at(i).value[this.form_name]);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, i, form);
        }
        if (form == this.conditionCert) {
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.getCertificationsArr.at(i).value[this.form_description]);
          fd.append('label', form);
          fd.append('level', this.getCertificationsArr.at(i).value[this.form_label]);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, i, form);
        }
        if (form == this.conditionOther) {
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.getOtherCertArr.at(i).value[this.form_description]);
          fd.append('label', form);
          fd.append('level', this.getOtherCertArr.at(i).value[this.form_label]);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, i, form);
        }
      } else {
        // this.showResumeImgSizeError = true;
        this.appConfig.nzNotification('error', 'Not Uploaded', 'Maximum file size is 2 MB');
      }
    } else {
      if (form == this.conditionBank && this.getBankArr.at(i).value[this.form_name] == 'Banking' || form == this.conditionJoining && this.getJoiningArr.at(i).value[this.form_name] == 'Aadhar' || form == this.conditionJoining && this.getJoiningArr.at(i).value[this.form_name] == 'PAN' || form == this.conditionJoining && this.getJoiningArr.at(i).value[this.form_name] == 'CasteDeclaration' || form == this.conditionTransfer && this.getTransferArr.at(i).value[this.form_name] == 'TransferCertificate') {
        return this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload PDF or PNG/JPEG files only');
      } else {
        this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload PDF files only');
      }
      // this.showResumeImgError = true;
    }
}

onPhotoUpload(event, i, form) {
  const fd = new FormData();
  if (event.target.files && (event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jp')) && !event.target.files[0].type.includes('svg')) {
      if (event.target.files[0].size < 2000000) {
        this.selectedImage = event.target.files[0];

        if (form == this.conditionJoining) {
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.getJoiningArr.at(i).value[this.form_description]);
          fd.append('label', form);
          fd.append('level', this.getJoiningArr.at(i).value[this.form_name]);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, i, form);
        }
        if (form == this.conditionBank) {
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.getBankArr.at(i).value[this.form_description]);
          fd.append('label', form);
          fd.append('level', this.getBankArr.at(i).value[this.form_name]);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, i, form);
        }
        if (form == this.conditionTransfer) {
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.getTransferArr.at(i).value[this.form_description]);
          fd.append('label', form);
          fd.append('level', this.getTransferArr.at(i).value[this.form_name]);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, i, form);
        }
      } else {
        // this.showResumeImgSizeError = true;
        this.appConfig.nzNotification('error', 'Not Uploaded', 'Maximum file size is 2 MB');
      }
    } else {
      if (form == this.conditionBank && this.getBankArr.at(i).value[this.form_name] == 'PhotoID') {
        return this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload PNG/JPEG files only');
      } else {
        return this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload PDF or PNG/JPEG files only');
      }
      // this.showResumeImgError = true;
    }
}


async uploadEducationImage(file, mainIndex, subIndex, form) {
  try {
    this.loadingService.setLoading(true);
    const data = await (await this.candidateService.uploadJoiningDocs(file)).json();
    if (data && data.error_code) {
      this.loadingService.setLoading(false);
     return this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
    }
    this.loadingService.setLoading(false);
    // this.candidateService.uploadCandidateDocument(fd).subscribe((data: any) => {
    if (data && data.file_id) {
        this.getSemesterArr(mainIndex).at(subIndex).patchValue({
          [this.form_file_name]: data.file_name,
          [this.form_file_id]: data.file_id,
          [this.form_file_path]: data.file_path,
          [this.form_file_size]: data.file_size,
          [this.form_file_type]: data.type
        });
    }

    this.appConfig.nzNotification('success', 'Uploaded', 'Document uploaded successfully');
  } catch (e) {
    this.loadingService.setLoading(false);
    this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');

  }
  // }, (err) => {

  // });
}

removeEducationFile(mainIndex, subIndex, form) {
    this.getSemesterArr(mainIndex).at(subIndex).patchValue({
    [this.form_file_name]: null,
    [this.form_file_id]: null,
    [this.form_file_path]: null,
    [this.form_file_size]: null,
    [this.form_file_type]: null,
  });
  this.selectedImage = null;
}

onEducationFileUpload(event, mainIndex, subIndex, form) {

  const fd = new FormData();
    if (event.target.files && (event.target.files[0].type.includes('application/pdf'))) {
      if (event.target.files[0].size < 2000000) {
        this.selectedImage = event.target.files[0];

        fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
        fd.append('description', this.getSemesterArr(mainIndex).at(subIndex).value[this.form_description]);
        fd.append('label', this.getEducationArr.at(mainIndex).value[this.form_education_level]);
        fd.append('level', this.getSemesterArr(mainIndex).at(subIndex).value[this.form_name]);
        fd.append('product_image', this.selectedImage);
        this.uploadEducationImage(fd, mainIndex, subIndex, form);
      } else {
        // this.showResumeImgSizeError = true;
        this.appConfig.nzNotification('error', 'Not Uploaded', 'Maximum file size is 2 MB');
      }
    } else {
      this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload PDF files only');
      // this.showResumeImgError = true;
    }
}

  getDownloadableDocs() {
    this.downloadabledocs = [];
  // this.candidateService.joiningFormDownloadableDocuments().subscribe((data: any)=> {
    //
    // this.downloadabledocs = data ? data : [];
  // });
  }

  openNodocs(routeValue?: any) {
    this.isRoute = routeValue ? routeValue : '';
    // this.pdfsrc = src;
    // this.pdfsrc = 'http://campus-qa.lntedutech.com/d8cintana2/sites/default/files/Templates/BGV_Declaration.pdf';
    const dialogRef = this.dialog.open(this.matNoDocs, {
      width: '850px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForNoDoc'
    });
  }

  openMatDialog(src, type?) {
    if (!type.includes('application/pdf')) {
      return window.open(src, '_blank');
    }
    this.pdfsrc = src;
    // this.pdfsrc = 'http://campus-qa.lntedutech.com/d8cintana2/sites/default/files/Templates/BGV_Declaration.pdf';
    const dialogRef = this.dialog.open(this.matDialogRef, {
      width: '600px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForPDFViewer'
    });
  }
  closeBox() {
    this.dialog.closeAll();
  }

  downloadPDF(src, filename) {
    let link = document.createElement('a');
link.setAttribute('type', 'hidden');
link.href = src;
link.download = src;
link.target = '_blank';
document.body.appendChild(link);
link.click();
link.remove();
  }

    // Form getters
  // convenience getters for easy access to form fields
  get getJoiningArr() { return this.uploadForm.get([this.form_joiningArray]) as FormArray; }
  get getResumeArr() { return this.uploadForm.get([this.form_resumeArray]) as FormArray; }
  get getTransferArr() { return this.uploadForm.get([this.form_transferCertArray]) as FormArray; }
  get getBankArr() { return this.uploadForm.get([this.form_bankArray]) as FormArray; }
  get getOtherCertArr() { return this.uploadForm.get([this.form_otherCertArray]) as FormArray; }
  get getCertificationsArr() { return this.uploadForm.get([this.form_CertificationArray]) as FormArray; }
  get getEducationArr() { return this.uploadForm.get([this.form_educationArray]) as FormArray; }
  getSemesterArr(i: any) : FormArray {
        return this.getEducationArr.at(i).get([this.form_semesterArray]) as FormArray
      }



  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, 0, 0);
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


  ngOnDestroy() {
  }
}
