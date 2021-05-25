import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild(MatAccordion, {static: false}) accordion: MatAccordion;
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  dependentForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  //form Variables
  form_dependentArray = 'dependentArray';
  form_dependent_name = 'name_of_your_family';
  form_dependent_dob = 'family_date_of_birth';
  form_dependent_relationship = 'relationship';
  form_dependent_occupation = 'occupation';
  form_dependent_differently_abled = 'differently_abled';
  form_dependent_status = 'status';
  form_isDependent = 'dependent'

  dependedentDetails: any;
  downloadabledocs: any;
  pdfsrc: any;
  selectedImage: any;
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

  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date(currentYear + 20, 11, 31);
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

async uploadImage(file) {

  try {
    this.appConfig.showLoader();
    const data = await (await this.candidateService.uploadJoiningDocs(file)).json();

    // this.candidateService.uploadCandidateDocument(fd).subscribe((data: any) => {
    console.log('response', data);
    
    this.appConfig.hideLoader();


    this.appConfig.nzNotification('success', 'Uploaded', 'Document uploaded successfully');
  } catch (e) {
    this.appConfig.hideLoader();
  }
  // }, (err) => {

  // });
}

onSelectFile(event) {
    
  const fd = new FormData();
    if (event.target.files && (event.target.files[0].type.includes('application/pdf'))) {
      // this.showResumeImgError = false;
      if (event.target.files[0].size < 2000000) {
        // this.showResumeImgSizeError = false;
        // this.urlResume = event.target.files[0].name;
        this.selectedImage = event.target.files[0];
        fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
        fd.append('description', 'Testing');
        fd.append('label', 'joining');
        fd.append('level', 'other');
        console.log('selected', this.selectedImage);
        
        fd.append('product_image', this.selectedImage);
        this.uploadImage(fd);
      } else {
        // this.showResumeImgSizeError = true;
      }
    } else {
      // this.showResumeImgError = true;
    }
  // console.log(this.otherDocArr.controls, 'otherDocFile');
}

getDownloadableDocs() {
  this.candidateService.joiningFormDownloadableDocuments().subscribe((data: any)=> {
    this.appConfig.hideLoader();
    this.downloadabledocs = data ? data : [];
  });
}
  formSubmit(routeValue?: any) {
    // if(this.dependentForm.valid) {
      this.candidateService.joiningFormUpload().subscribe((data: any)=> {
        this.appConfig.hideLoader();
        this.appConfig.nzNotification('success', 'Saved', 'Upload details has been updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
      });
    // } else {
    //   this.ngAfterViewInit();
    //   this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
    //   this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
    // }

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

  
  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }

}
