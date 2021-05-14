import { CONSTANT } from './../../../constants/app-constants.service';
import { GlobalValidatorService } from './../../../custom-form-validators/globalvalidators/global-validator.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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


export class JoiningPersonalComponent implements OnInit {
  minDate: Date;
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
  }

  getPersonalData() {
    this.appConfig.showLoader();
    this.candidateService.joiningFormGetPersonalDetails().subscribe((data: any)=> {
      this.appConfig.hideLoader();
      let personal = data?.length > 0 ? data[0] : null;
      this.nonMergedPersonalDetails = personal;
      if (personal) {
        this.personalDetails = {
          ...personal?.personal_details,
          ...personal?.profile_details,
        }
        this.patchPersonalForm();
      } else {
        this.personalDetails = [];
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
     return split == 'Invalid date' ? null : split;
    }
  }

  formSubmit() {
    if (this.personalForm.valid) {      
      let rawPersonalFormValue = this.personalForm.getRawValue();
      let profile_details= {
       [this.form_aadhar]: rawPersonalFormValue[this.form_aadhar],
       [this.form_dob]: this.momentForm(rawPersonalFormValue[this.form_dob]),
       [this.form_email]: rawPersonalFormValue[this.form_email],
       [this.form_gender]: rawPersonalFormValue[this.form_gender],
       [this.form_height]: rawPersonalFormValue[this.form_height],
       [this.form_mobile]: rawPersonalFormValue[this.form_mobile],
       [this.form_nationality]: rawPersonalFormValue[this.form_nationality],
       [this.form_weight]: rawPersonalFormValue[this.form_weight],
       profile_image: this.personalDetails.profile_image,
       user_id: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
      };
      let personal_details= {
       [this.form_blood_group]: rawPersonalFormValue[this.form_blood_group],
       [this.form_caste]: rawPersonalFormValue[this.form_caste],
       [this.form_emergency_contact]: rawPersonalFormValue[this.form_emergency_contact],
       [this.form_father_name]: rawPersonalFormValue[this.form_father_name],
       [this.form_identification_mark1]: rawPersonalFormValue[this.form_identification_mark1],
       [this.form_identification_mark2]: rawPersonalFormValue[this.form_identification_mark2],
       [this.form_mother_tongue]: rawPersonalFormValue[this.form_mother_tongue],
       [this.form_pan]: rawPersonalFormValue[this.form_pan],
       [this.form_place_of_birth]: rawPersonalFormValue[this.form_place_of_birth],
       [this.form_religion]: rawPersonalFormValue[this.form_religion],
       [this.form_state_of_birth]: rawPersonalFormValue[this.form_state_of_birth],
      };
       const apiData = [{
         personal_details,
         profile_details
         }];  
      
      this.candidateService.joiningFormGetPersonalDetailsSave(apiData).subscribe((data: any)=> {
        this.appConfig.hideLoader();
        this.appConfig.nzNotification('success', 'Saved', 'Personal details has been updated');
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT); 
      });
    } else {
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFields(this.personalForm);
    }    
  }


  routeNext() {
    if (this.personalForm.valid) {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT); 
    }
    this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
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
      [this.form_name]: this.personalDetails[this.form_name] ? this.personalDetails[this.form_name] : this.appConfig.getLocalData('username'), 
      [this.form_dob]: this.dateConvertion(this.personalDetails[this.form_dob]), 
      [this.form_gender]: this.personalDetails[this.form_gender], 
      [this.form_place_of_birth]: this.personalDetails[this.form_place_of_birth], 
      [this.form_state_of_birth]: this.personalDetails[this.form_state_of_birth], 
      [this.form_nationality]: this.personalDetails[this.form_nationality], 
      [this.form_mother_tongue]: this.personalDetails[this.form_mother_tongue], 
      [this.form_religion]: this.personalDetails[this.form_religion], 
      [this.form_caste]: this.personalDetails[this.form_caste], 
      [this.form_blood_group]: this.personalDetails[this.form_blood_group], 
      [this.form_father_name]: this.personalDetails[this.form_father_name], 
      [this.form_emergency_contact]: this.personalDetails[this.form_emergency_contact], 
      [this.form_mobile]: this.personalDetails[this.form_mobile], 
      [this.form_email]: this.personalDetails[this.form_email], 
      [this.form_aadhar]: this.personalDetails[this.form_aadhar], 
      [this.form_pan]: this.personalDetails[this.form_pan], 
      // [this.form_offer_reference]: this.personalDetails[this.form_offer_reference], 
      // [this.form_offer_date]: this.dateConvertion(this.personalDetails[this.form_offer_date]), 
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
      [this.form_name]: [null, [Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_dob]: [null],
      [this.form_gender]: [{value: null, disabled: true}],
      [this.form_place_of_birth]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_state_of_birth]: [null],
      [this.form_nationality]: [{value: null, disabled: true}, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_mother_tongue]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_religion]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_caste]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_blood_group]: [null, [Validators.required]],
      [this.form_father_name]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_emergency_contact]: [null, [this.glovbal_validators.mobileRegex(), RemoveWhitespace.whitespace()]],
      [this.form_mobile]: [null, [Validators.required, this.glovbal_validators.mobileRegex(), RemoveWhitespace.whitespace()]],
      [this.form_email]: [{value: null, disabled: true}, [Validators.required, this.glovbal_validators.email(), RemoveWhitespace.whitespace()]],
      [this.form_aadhar]: [{value: null, disabled: true}, [this.glovbal_validators.aadhaar(), RemoveWhitespace.whitespace()]],
      [this.form_pan]: [null, [this.glovbal_validators.alphaNum10(), RemoveWhitespace.whitespace()]],
      // [this.form_offer_reference]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      // [this.form_offer_date]: [null],
      [this.form_height]: [{value: null, disabled: true}, [this.glovbal_validators.numberDecimals(), RemoveWhitespace.whitespace()]],
      [this.form_weight]: [{value: null, disabled: true}, [this.glovbal_validators.numberDecimals(), RemoveWhitespace.whitespace()]],
      [this.form_identification_mark1]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_identification_mark2]: [null, [this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],    
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
  // get offer_reference() {
  //   return this.personalForm.get(this.form_offer_reference);
  // }
  // get offer_date() {
  //   return this.personalForm.get(this.form_offer_date);
  // }
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


}
