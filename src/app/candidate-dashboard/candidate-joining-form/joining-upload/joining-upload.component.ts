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
  selector: 'app-joining-upload',
  templateUrl: './joining-upload.component.html',
  styleUrls: ['./joining-upload.component.scss'],
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
export class JoiningUploadComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('matDialog', {static: false}) matDialogRef: TemplateRef<any>;
  @ViewChild('noDocs', {static: false}) matNoDocs: TemplateRef<any>;
  @ViewChild(MatAccordion, {static: false}) accordion: MatAccordion;
  step = 0;
  getEducationDocuments: any[];

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  semesterList = [1,2,3,4,5,6,7,8,9,10];
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  uploadForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  conditionJoining = 'joining';
  conditionEducation = 'education';
  //Joining Variables
  form_joiningArray = 'joiningArray';
  form_name = 'name';
  form_label = 'label';
  form_id = 'id';
  form_file_name = 'filename';
  form_file_path = 'file_path';
  form_file_type = 'file_type';
  form_file_size = 'file_size';
  form_file_id = 'file_id';
  form_description = 'description';
  form_Not_Submitted_Description = 'Not_Submitted_Description';
  form_expectedDate = 'expectedDate';

  // Education variables
  form_educationArray = 'educationArray';
  form_noofSemester = 'no_of_semester';
  form_education_level = 'Education_level';
  form_eourse_Completion = 'course_completion_certificate';
  form_degree_Completion = 'degree_completion_certificate';
  form_semesterArray = 'semesterArray';

  dependedentDetails: any;
  downloadabledocs: any;
  pdfsrc: any;
  selectedImage: any;
  hoverHide: any;
  getJoiningDocuments: any;
  expectedDate = new FormControl(null, [Validators.required]);
  reason = new FormControl(null, [Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]);
  joiningNotUploadedDocs: any[];
  isRoute: any;


  dummyValue = [
    {
      [this.form_education_level]: 'SSLC',
      [this.form_noofSemester]: null,
      [this.form_semesterArray]: [
        {
          [this.form_file_id]: "2297",
          [this.form_id]: "166",
          [this.form_file_path]: "http://campus-qa.lntedutech.com/d8cintana2/profile/get_certificate_name_test?certificate_id=2297",
          [this.form_file_size]: "190.04 KB",
          [this.form_file_name]: "Caste Declaration.pdf",
          [this.form_name]: "SSLC",
          [this.form_label]: "SSLC Certificate",
          [this.form_description]: null,
          [this.form_Not_Submitted_Description]: null,
          [this.form_expectedDate]: null
        }
      ]
    },
    {
      [this.form_education_level]: 'HSC',
      [this.form_noofSemester]: null,
      [this.form_semesterArray]: []
    },
    {
      [this.form_education_level]: 'Diploma',
      [this.form_noofSemester]: null,
      [this.form_semesterArray]: []
    },
    {
      [this.form_education_level]: 'UG',
      [this.form_noofSemester]: null,
      [this.form_semesterArray]: []
    },
    {
      [this.form_education_level]: 'PG',
      [this.form_noofSemester]: null,
      [this.form_semesterArray]: []
    },
  ];

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
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
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
  }

  ngAfterViewInit() {
    this.sharedService.joiningFormActiveSelector.next('upload');
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
      [this.form_educationArray]: this.fb.array([])
    })
  }

  getDocuments() {
    this.candidateService.joiningFormGetDocuments().subscribe((data: any)=> {
      this.appConfig.hideLoader();
      this.getJoiningDocuments = data && data['Joining_Details'] ? data['Joining_Details'] : [];
      this.getEducationDocuments = this.dummyValue;
      this.checkJoiningArrayinitalize();      
    }, (err)=> {

    });
  }

  checkJoiningArrayinitalize() {
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
        this.getJoiningArr.push(this.patchJoiningArray(element));
      });
    } else {
      this.getJoiningArr.push(this.initJoiningArray());
    }

  // Education
    if (this.getEducationDocuments && this.getEducationDocuments.length > 0) {
      this.getEducationDocuments.forEach(element => {
        this.getEducationArr.push(this.patchEducationArray(element));
      });
    } else {
      this.getEducationArr.push(this.initEducationArray());
      // console.log('adda', this.getEducationArr.controls[0]['controls']);
    }


  }

  patchJoiningArray(data) {
    return this.fb.group({
      [this.form_name]: [data[this.form_name]],
      [this.form_label]: [data[this.form_label]],
      [this.form_id]: [data[this.form_id]],
      [this.form_file_size]: [data[this.form_file_size]],
      [this.form_file_path]: [data[this.form_file_path]],
      [this.form_file_name]: [data[this.form_file_name]],
      [this.form_file_type]: [data[this.form_file_type]],
      [this.form_file_id]: [data[this.form_file_id]],
      [this.form_description]: [data[this.form_description], [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_Not_Submitted_Description]: [data[this.form_Not_Submitted_Description], [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_expectedDate]: [data[this.form_expectedDate]],
    })    
  }

  patchEducationArray(data) {
    return this.fb.group({
      [this.form_education_level]: [data[this.form_education_level]],
      [this.form_noofSemester]: [data[this.form_noofSemester], (data[this.form_education_level] != 'SSLC' && data[this.form_education_level] != 'HSC' ? [Validators.required] : null)],
      [this.form_semesterArray]: data[this.form_semesterArray] && data[this.form_semesterArray].length > 0 ? this.patchSubArray(data[this.form_noofSemester], data[this.form_education_level], data) : this.patchSubInitArray(data[this.form_education_level], data)
      // [this.form_semesterArray]: this.fb.array([])
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
      [this.form_description]: [data[this.form_description], [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_Not_Submitted_Description]: [data[this.form_Not_Submitted_Description], [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_expectedDate]: [data[this.form_expectedDate] ? this.dateConvertion(data[this.form_expectedDate]) : null]
    })        
  }

  patchSubArray(semestercount, level, form) {
    let subSem = [];
    if (form[this.form_semesterArray].length > 0) {
      form[this.form_semesterArray].forEach(element => {
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


  initJoiningArray() {
    return this.fb.group({
      [this.form_name]: [null],
      [this.form_label]: [null],
      [this.form_id]: [null],
      [this.form_file_size]: [null],
      [this.form_file_path]: [null],
      [this.form_file_name]: [null],
      [this.form_file_type]: [null],
      [this.form_file_id]: [null],
      [this.form_description]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_Not_Submitted_Description]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
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
      [this.form_description]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_Not_Submitted_Description]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
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
  
  addToSemesterArray(i?: any) {
    console.log('smeser', this.getSemesterArr(i));
    this.getSemesterArr(i).push(this.initSemesterArray());
  }

  removeInSemesterArray(i, j) {
    this.getSemesterArr(i).removeAt(j);
  }

  changeSemesterCount(form, i) {
    console.log(form, i);
    console.log('adad', form.value[this.form_noofSemester]);
    
    if (form.value[this.form_semesterArray].length < Number(form.value[this.form_noofSemester])) {

    } else {

    }
    console.log(this.getSemesterArr(i));
    
    // this.getSemesterArr(i).push(this.initSemesterArray());

  }
/*
    form.patchValue({
      [this.form_label]: ['SSLCcccccccccccccccccc'],
    });
*/
validateNotUploaded() {
  if (this.reason.valid && this.expectedDate.valid) {
    this.dialog.closeAll();
    let joiningArray = this.getJoiningArr.getRawValue();
    joiningArray.forEach((element, i) => {
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
    this.finalSubmit(this.isRoute ? this.isRoute : '');
  } else {
    this.reason.markAllAsTouched();
    this.expectedDate.markAllAsTouched();
  }
}

  formSubmit(routeValue?: any) {
    if (this.checkJoiningNotUploaded()) {
      this.openNodocs(routeValue ? routeValue : '');
    } else {
      this.beforeSubmit(routeValue ? routeValue : '');
    }
  }

  checkJoiningNotUploaded() {
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
      return true;
    } else {
      return false;
    }
  }

  beforeSubmit(routeValue?: any) {
    let joiningArray = this.getJoiningArr.getRawValue();
    joiningArray.forEach((element, i) => {
      if (element[this.form_file_path]) {
      this.getJoiningArr.at(i).patchValue({
      [this.form_Not_Submitted_Description]: null,
      [this.form_expectedDate]: null
    });                  
      }
    });
    this.finalSubmit(routeValue ? routeValue : '');
  }

  finalSubmit(routeValue?: any) {
    let joiningArray = this.getJoiningArr.getRawValue();
    console.log('final Submit', joiningArray);
    const apiData = {
      Joining_Details: joiningArray
    }
    
    // if(this.dependentForm.valid) {
      this.candidateService.joiningFormUpload(apiData).subscribe((data: any)=> {
        this.appConfig.hideLoader();
        this.appConfig.nzNotification('success', 'Saved', 'Upload details has been updated');
        // this.sharedService.joiningFormStepperStatus.next();
        // return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
      });
    // } else {
    //   this.ngAfterViewInit();
    //   this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
    //   this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
    // }

  }

async uploadImage(file, i, form) {
  try {
    this.appConfig.showLoader();
    const data = await (await this.candidateService.uploadJoiningDocs(file)).json();

    // this.candidateService.uploadCandidateDocument(fd).subscribe((data: any) => {
    console.log('response', data);
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
    }
    
    this.appConfig.hideLoader();


    this.appConfig.nzNotification('success', 'Uploaded', 'Document uploaded successfully');
  } catch (e) {
    this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
    this.appConfig.hideLoader();
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
  this.selectedImage = null;
}

onSelectFile(event, i, form) {
    
  const fd = new FormData();
    if (event.target.files && (event.target.files[0].type.includes('application/pdf'))) {
      if (event.target.files[0].size < 2000000) {
        this.selectedImage = event.target.files[0];
        fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
        fd.append('description', this.getJoiningArr.at(i).value[this.form_description]);
        fd.append('label', form);
        fd.append('level', this.getJoiningArr.at(i).value[this.form_name]);
        fd.append('product_image', this.selectedImage);
        // this.uploadImage(fd, i, form);
        this.getEducationArr.at(i).patchValue({
          [this.form_file_name]: 'hi',
          [this.form_file_id]: 'hi',
          [this.form_file_path]: 'hi',
          [this.form_file_size]: 'hi',
          [this.form_file_type]: 'hi',
        });        
      
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
  this.candidateService.joiningFormDownloadableDocuments().subscribe((data: any)=> {
    this.appConfig.hideLoader();
    this.downloadabledocs = data ? data : [];
  });
  }


  saveRequestRxJs() {
    this.sendPopupResultSubscription =  this.sharedService.sendPopupResult.subscribe((result: any)=> {
      
      if (result.result == 'save') {
      this.formSubmit(result.route);
      }     
    });
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any)=> {
      if(data.current == 'upload') {
        // if (!this.dependentForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        // } else {
        //   return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        // }
      } 
    });
  }

  routeNext(route) {
    // if (!this.dependentForm.dirty) {
      if (route == 'education') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
      } else {
        this.formSubmit();
        // if (this.appConfig.getLocalData('upload') == '1') {
        //   return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
        // } else {
        //  if (this.dependentForm.valid) {
        //   return this.sharedService.openJoiningRoutePopUp.next(route == 'education' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
        //   // }
        //   this.ngAfterViewInit();
        //   this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        // }
      }
    // } else {
      // return this.sharedService.openJoiningRoutePopUp.next(route == 'education' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
    // }
  }

  openNodocs(routeValue?: any) {
    this.isRoute = routeValue ? routeValue : '';
    // this.pdfsrc = src;
    // this.pdfsrc = 'http://campus-qa.lntedutech.com/d8cintana2/sites/default/files/Templates/BGV_Declaration.pdf';
    const dialogRef = this.dialog.open(this.matNoDocs, {
      width: '800px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForNoDoc'
    });
  }

  openMatDialog(src) {
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
  get getEducationArr() { return this.uploadForm.get([this.form_educationArray]) as FormArray; }
  getSemesterArr(i: any) : FormArray {
        return this.getEducationArr.at(i).get([this.form_semesterArray]) as FormArray
      }



  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, 0, 1);
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
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }

}
