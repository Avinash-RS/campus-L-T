import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  uploadForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  conditionJoining = 'joining'
  //form Variables
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
      [this.form_joiningArray]: this.fb.array([])
    })
  }

  getDocuments() {
    this.candidateService.joiningFormGetDocuments().subscribe((data: any)=> {
      this.appConfig.hideLoader();
      this.getJoiningDocuments = data && data['Joining_Details'] ? data['Joining_Details'] : [];
      this.checkJoiningArrayinitalize();      
    }, (err)=> {

    });
  }

  checkJoiningArrayinitalize() {
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
        this.uploadImage(fd, i, form);
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
