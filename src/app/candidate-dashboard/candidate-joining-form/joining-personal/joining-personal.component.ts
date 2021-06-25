import { Subscription } from 'rxjs';
import { CONSTANT } from './../../../constants/app-constants.service';
import { GlobalValidatorService } from './../../../custom-form-validators/globalvalidators/global-validator.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import * as moment from 'moment'; //in your component

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
  selector: 'app-joining-personal',
  templateUrl: './joining-personal.component.html',
  styleUrls: ['./joining-personal.component.scss'],
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


export class JoiningPersonalComponent implements OnInit, AfterViewInit, OnDestroy {
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  category = [
    {
      name: 'Scheduled Caste',
      caste: 'SC'
    },
    {
      name: 'Scheduled Tribe',
      caste: 'ST'
    },
    {
      name: 'De-notified Tribe',
      caste: 'DenotifiedTribe'
    },
    {
      name: 'Nomadic Tribe',
      caste: 'NomadicTribe'
    },
    {
      name: 'Special Backward Category',
      caste: 'SBC'
    },
    {
      name: 'Other Backward Classes',
      caste: 'OBC'
    },
    {
      name: 'General / Open Category',
      caste: 'GEN'
    },
    {
      name: 'Other',
      caste: 'Other'
    },
  ];
  minDate: Date;
  minDateDOB: Date;
  maxDate: Date;
  url: '';
  // url = 'assets/images/img_avatar2.jpg';
  selectedImage: any;
  showSizeError = {
    image: false,
    size: false,
    minsize: false,
    maxsize: false,
    reset() { 
      this.image = false
      this.minsize = false
      this.maxsize = false
    }
  };
  personalForm: FormGroup;
  // Title Dropdown list
  bloodGroupDropdownList: any;

  // Gender DropDown List 
  genderDropdownList = [
    {
      label: 'Male',
      value: 'Male'
    },
    {
      label: 'Female',
      value: 'Female'
    }
  ]
  // Form control name declaration Start
  form_candidate_id = 'candidate_id';
  form_title = 'title';
  form_name = 'name';
  form_dob = 'dob';
  form_gender = 'gender';
  form_place_of_birth = 'place_of_birth';
  form_state_of_birth = 'state_of_birth';
  form_nationality = 'nationality';
  form_mother_tongue = 'mother_tongue';
  form_religion = 'religion';
  form_caste = 'caste';
  form_category = 'category';
  form_blood_group = 'blood_group';
  form_father_name = 'father_name';
  form_emergency_contact = 'emergency_contact_no';
  form_mobile = 'mobile';
  form_email = 'email';
  form_aadhar = 'aadharno';
  form_pan = 'pan_no';
  form_offer_reference = 'offer_reference';
  form_offer_date = 'offer_date';
  form_height = 'height';
  form_weight = 'weight';
  form_identification_mark1 = 'identification_mark1';
  form_identification_mark2 = 'identification_mark2';
// Form control name declaration end

  personalDetails: any;
  getAllStates: any;
  nonMergedPersonalDetails: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService
  ) { 
    this.dateValidation();
  }

  ngOnInit() {
    this.formInitialize();
    this.getBloodGroup();
    this.getStateAPI();
    this.getPersonalData();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
  }

  ngAfterViewInit() {
    this.sharedService.joiningFormActiveSelector.next('personal');
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getPersonalData() {
    this.appConfig.showLoader();
    this.candidateService.joiningFormGetPersonalDetails().subscribe((data: any)=> {
      this.appConfig.hideLoader();
      this.personalDetails = data ? data : null;
      if (this.personalDetails) {        
        this.patchPersonalForm();
      }
    });
  }

  getStateAPI() {
    const datas = {
      country_id: '101'
    };
    this.candidateService.updatedState(datas).subscribe((data: any) => {
      this.getAllStates = data[0];
    }, (err) => {

    });
  }

  getBloodGroup() {
    this.candidateService.getBloodGroups().subscribe((data: any) => {
      this.bloodGroupDropdownList = data;
    }, (err) => {

    });
  }

  dateValidation() {
        // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
        const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear - 50, 0, 1);
        this.minDateDOB = new Date(currentYear - 90, 0, 1);
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

  formSubmit(routeValue?:any) {
    if (this.personalForm.valid) {      
      let rawPersonalFormValue = this.personalForm.getRawValue();
      const apiData = {
       [this.form_name]: rawPersonalFormValue[this.form_name],
       [this.form_aadhar]: rawPersonalFormValue[this.form_aadhar],
       [this.form_dob]: this.momentForm(rawPersonalFormValue[this.form_dob]),
       [this.form_email]: rawPersonalFormValue[this.form_email],
       [this.form_gender]: rawPersonalFormValue[this.form_gender],
       [this.form_height]: rawPersonalFormValue[this.form_height],
       [this.form_mobile]: rawPersonalFormValue[this.form_mobile],
       [this.form_nationality]: rawPersonalFormValue[this.form_nationality],
       [this.form_weight]: rawPersonalFormValue[this.form_weight],
       [this.form_blood_group]: rawPersonalFormValue[this.form_blood_group],
       [this.form_caste]: rawPersonalFormValue[this.form_caste],
       [this.form_category]: rawPersonalFormValue[this.form_category],
       [this.form_emergency_contact]: rawPersonalFormValue[this.form_emergency_contact],
       [this.form_father_name]: rawPersonalFormValue[this.form_father_name],
       [this.form_identification_mark1]: rawPersonalFormValue[this.form_identification_mark1],
       [this.form_identification_mark2]: rawPersonalFormValue[this.form_identification_mark2],
       [this.form_mother_tongue]: rawPersonalFormValue[this.form_mother_tongue],
       [this.form_pan]: rawPersonalFormValue[this.form_pan],
       [this.form_offer_reference]: rawPersonalFormValue[this.form_offer_reference], 
       [this.form_offer_date]: this.dateConvertion(rawPersonalFormValue[this.form_offer_date]), 
       [this.form_place_of_birth]: rawPersonalFormValue[this.form_place_of_birth],
       [this.form_religion]: rawPersonalFormValue[this.form_religion],
       [this.form_state_of_birth]: rawPersonalFormValue[this.form_state_of_birth],
       profile_image: this.personalDetails.profile_image,
       user_id: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
      };
      
      this.candidateService.joiningFormGetPersonalDetailsSave(apiData).subscribe((data: any)=> {
        this.appConfig.hideLoader();
        this.appConfig.nzNotification('success', 'Saved', 'Personal details is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT); 
      });
    } else {
      this.ngAfterViewInit();
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFields(this.personalForm);
    }    
  }


  saveRequestRxJs() {
    this.sendPopupResultSubscription = this.sharedService.sendPopupResult.subscribe((result: any)=> {
      if (result.result == 'save') {
      this.formSubmit(result.route);
      }     
    });
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any)=> {
      if(data.current == 'personal') {
        if (!this.personalForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      } 
    });
  }

  routeNext() {
    if (!this.personalForm.dirty) {
      if(this.appConfig.getLocalData('personal') == '1') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
      } else {
        if(this.personalForm.valid) {
          return this.sharedService.openJoiningRoutePopUp.next(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
        }
        this.glovbal_validators.validateAllFields(this.personalForm);
        this.ngAfterViewInit();
        this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');    
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
      }
    }

  async onSelectFile(event) {

    if (event.target.files && (event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jp')) && !event.target.files[0].type.includes('svg')) {
      this.showSizeError.reset();

      // if (event.target.files[0].size > 500000 && event.target.files[0].size < 2000000) {
      if (event.target.files[0].size > 40000) {
        this.showSizeError.reset();
        if (event.target.files[0].size < 2000000) {
          this.showSizeError.reset();
          // this.showSizeError.image = false;
        this.selectedImage = event.target.files[0];

        const fd = new FormData();
        fd.append('product_image', this.selectedImage);
        const file = event.target.files[0].lastModified.toString() + event.target.files[0].name;
        const reader = new FileReader();
        let urls;

        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = async(event: any) => { // called once readAsDataURL is completed
          urls = event.target.result;
          this.url = urls;

          // this.appConfig.showLoader();
          // const data = await (await this.candidateService.profileUpload(fd)).json();
            // this.profileData = {
            //   fid: data[0].id,
            //   uuid: '',
            //   localShowUrl: data[0].frontend_url,
            //   apiUrl: data[0].backend_url
            // };
            // this.appConfig.setLocalData('profileData', JSON.stringify(this.profileData));
            //         this.appConfig.hideLoader();

        };
      } else {
        this.showSizeError.reset();
        this.showSizeError.maxsize = true;
      }
      } else {
        this.showSizeError.reset();
        this.showSizeError.minsize = true;
      }
    } else {
      this.showSizeError.reset();
      this.showSizeError.image = true;
    }
  }

  public delete() {
    this.showSizeError.reset();
    this.url = null;
  }


  patchPersonalForm() {
    this.personalForm.patchValue({
      // [this.form_title]: this.personalDetails[this.form_title], 
      [this.form_name]: this.personalDetails[this.form_name], 
      [this.form_dob]: this.dateConvertion(this.personalDetails[this.form_dob]), 
      [this.form_gender]: this.personalDetails[this.form_gender], 
      [this.form_place_of_birth]: this.personalDetails[this.form_place_of_birth], 
      [this.form_state_of_birth]: this.personalDetails[this.form_state_of_birth], 
      [this.form_nationality]: this.personalDetails[this.form_nationality], 
      [this.form_mother_tongue]: this.personalDetails[this.form_mother_tongue], 
      [this.form_religion]: this.personalDetails[this.form_religion], 
      [this.form_caste]: this.personalDetails[this.form_caste], 
      [this.form_category]: this.personalDetails[this.form_category], 
      [this.form_blood_group]: this.personalDetails[this.form_blood_group], 
      [this.form_father_name]: this.personalDetails[this.form_father_name], 
      [this.form_emergency_contact]: this.personalDetails[this.form_emergency_contact], 
      [this.form_mobile]: this.personalDetails[this.form_mobile], 
      [this.form_email]: this.personalDetails[this.form_email], 
      [this.form_aadhar]: this.personalDetails[this.form_aadhar], 
      [this.form_pan]: this.personalDetails[this.form_pan], 
      [this.form_offer_reference]: this.personalDetails[this.form_offer_reference], 
      [this.form_offer_date]: this.dateConvertion(this.personalDetails[this.form_offer_date]), 
      [this.form_height]: this.personalDetails[this.form_height], 
      [this.form_weight]: this.personalDetails[this.form_weight], 
      [this.form_identification_mark1]: this.personalDetails[this.form_identification_mark1], 
      [this.form_identification_mark2]: this.personalDetails[this.form_identification_mark2], 
    });
    this.url = this.personalDetails.profile_image;
  }

  formInitialize() {
    this.personalForm = this.fb.group({
      // [this.form_title]: [null, [Validators.required]],
      [this.form_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_dob]: [{value: null, disabled: true}],
      [this.form_gender]: [{value: null, disabled: true}],
      [this.form_place_of_birth]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_state_of_birth]: [null],
      [this.form_nationality]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_mother_tongue]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_religion]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_caste]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_category]: [null, [Validators.required]],
      [this.form_blood_group]: [null, [Validators.required]],
      [this.form_father_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_emergency_contact]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.mobileRegex()]],
      [this.form_mobile]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.mobileRegex()]],
      [this.form_email]: [{value: null, disabled: true}, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.email()]],
      [this.form_aadhar]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(), this.glovbal_validators.aadhaar()]],
      [this.form_pan]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum10()]],
      [this.form_offer_reference]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_offer_date]: [null],
      [this.form_height]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(), this.glovbal_validators.numberDecimals()]],
      [this.form_weight]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(), this.glovbal_validators.numberDecimals()]],
      [this.form_identification_mark1]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_identification_mark2]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],    
    })
  }

  // Form getters
  // get ftitle() {
  //   return this.personalForm.get(this.form_title);
  // }
  get fname() {
    return this.personalForm.get(this.form_name);
  }
  get dob() {
    return this.personalForm.get(this.form_dob);
  }
  get gender() {
    return this.personalForm.get(this.form_gender);
  }
  get place_of_birth() {
    return this.personalForm.get(this.form_place_of_birth);
  }
  get state_of_birth() {
    return this.personalForm.get(this.form_state_of_birth);
  }
  get nationality() {
    return this.personalForm.get(this.form_nationality);
  }
  get mother_tongue() {
    return this.personalForm.get(this.form_mother_tongue);
  }
  get religion() {
    return this.personalForm.get(this.form_religion);
  }
  get caste() {
    return this.personalForm.get(this.form_caste);
  }
  get category1() {
    return this.personalForm.get(this.form_category);
  }
  get blood_group() {
    return this.personalForm.get(this.form_blood_group);
  }
  get father_name() {
    return this.personalForm.get(this.form_father_name);
  }
  get emergency_contact() {
    return this.personalForm.get(this.form_emergency_contact);
  }
  get mobile() {
    return this.personalForm.get(this.form_mobile);
  }
  get email() {
    return this.personalForm.get(this.form_email);
  }
  get aadhar() {
    return this.personalForm.get(this.form_aadhar);
  }
  get pan() {
    return this.personalForm.get(this.form_pan);
  }
  get offer_reference() {
    return this.personalForm.get(this.form_offer_reference);
  }
  get offer_date() {
    return this.personalForm.get(this.form_offer_date);
  }
  get height() {
    return this.personalForm.get(this.form_height);
  }
  get weight() {
    return this.personalForm.get(this.form_weight);
  }
  get identification_mark1() {
    return this.personalForm.get(this.form_identification_mark1);
  }
  get identification_mark2() {
    return this.personalForm.get(this.form_identification_mark2);
  }

ngOnDestroy() {
  this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
  this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
}
}
