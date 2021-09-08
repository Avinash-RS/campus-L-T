import { Subscription } from 'rxjs';
import { CONSTANT } from './../../../constants/app-constants.service';
import { GlobalValidatorService } from './../../../custom-form-validators/globalvalidators/global-validator.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import * as moment from 'moment'; //in your component
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';

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

  marital_list = [
    {
      name: 'Married',
      value: 'Married'
    },
    {
      name: 'Unmarried',
      value: 'Unmarried'
    },
    {
      name: 'Widow',
      value: 'Widow'
    }
  ];
  no_children_list = ['0', '1', '2', '3', '4', '5'];
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
  passportValidminDate: Date;
  passportValidmaxDate: Date;
  passportDateOfIssueMaxDate: Date;
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

  form_emergency_contact_name = 'emergency_contact_name';
  form_emergency_contact_relation = 'emergency_contact_relation';
  form_personal_email = 'personal_email';

  form_marital_status = 'marital_status';
  form_domicile_state = 'domicile_state';
  form_no_of_children = 'no_of_children';

  form_language_array = 'languages_known';
  form_language_name = 'language';
  form_language_is_read = 'is_read';
  form_language_is_write = 'is_write';
  form_language_is_speak = 'is_speak';

  form_passport_number: 'passport_number';
  form_name_as_in_passport: 'name_as_in_passport';
  form_profession_as_in_passport: 'profession_as_in_passport';
  form_date_of_issue: 'date_of_issue';
  form_valid_upto: 'valid_upto';
  form_place_of_issue: 'place_of_issue';
  form_country_valid_for: 'country_valid_for';

  // Health
  form_serious_illness: 'serious_illness';
  form_no_of_days: 'no_of_days';
  form_nature_of_illness: 'nature_of_illness';
  form_physical_disability: 'physical_disability';
  form_left_eyepower_glass: 'left_eyepower_glass';
  form_right_eye_power_glass: 'right_eye_power_glass';


// Form control name declaration end

  personalDetails: any;
  getAllStates: any;
  nonMergedPersonalDetails: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
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
    this.showStepper();
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('personal');
  }

  getPersonalData() {
    if (this.candidateService.getLocalProfileData()) {
      this.personalDetails = this.candidateService.getLocalpersonal_details();
      this.personalDetails ? this.patchPersonalForm() : '';
    } else {
      let apiData = {
        form_name: 'joining',
        section_name: ''
      }
      this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
        this.candidateService.saveAllProfileToLocal(data);
        this.personalDetails = this.candidateService.getLocalpersonal_details();
        this.personalDetails ? this.patchPersonalForm() : '';
      });
    }
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
    if (this.appConfig.getLocalData('bloodgroup')) {
      this.bloodGroupDropdownList = JSON.parse(this.appConfig.getLocalData('bloodgroup'));
    } else {
      this.candidateService.getBloodGroups().subscribe((data: any) => {
        this.bloodGroupDropdownList = data;
        this.bloodGroupDropdownList && this.bloodGroupDropdownList.length > 0 ? this.appConfig.setLocalData('bloodgroup', JSON.stringify(this.bloodGroupDropdownList)) : '';
      }, (err) => {

      });
    }
  }

  dateValidation() {
        // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
        const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear - 50, 0, 1);
        this.minDateDOB = new Date(currentYear - 90, 0, 1);
        this.maxDate = new Date(currentYear + 20, 11, 31);
        this.passportDateOfIssueMaxDate = new Date();
        this.passportValidminDate = new Date(currentYear - 15, 0, 1);
        this.passportValidmaxDate = new Date(currentYear + 40, 0, 1);
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
       [this.form_emergency_contact_name]: rawPersonalFormValue[this.form_emergency_contact_name],
       [this.form_emergency_contact_relation]: rawPersonalFormValue[this.form_emergency_contact_relation],
       [this.form_personal_email]: rawPersonalFormValue[this.form_personal_email],
       [this.form_domicile_state]: rawPersonalFormValue[this.form_domicile_state],
       [this.form_marital_status]: rawPersonalFormValue[this.form_marital_status],
       [this.form_no_of_children]: rawPersonalFormValue[this.form_no_of_children],
       profile_image: this.personalDetails.profile_image,
       user_id: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
      };

      this.candidateService.joiningFormGetPersonalDetailsSave(apiData).subscribe((data: any)=> {

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
      if(this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().personal_details == '1') {
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

          //
          // const data = await (await this.candidateService.profileUpload(fd)).json();
            // this.profileData = {
            //   fid: data[0].id,
            //   uuid: '',
            //   localShowUrl: data[0].frontend_url,
            //   apiUrl: data[0].backend_url
            // };
            // this.appConfig.setLocalData('profileData', JSON.stringify(this.profileData));
            //

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
      [this.form_state_of_birth]: this.personalDetails[this.form_state_of_birth] ? this.personalDetails[this.form_state_of_birth].toString() : null,
      [this.form_nationality]: this.personalDetails[this.form_nationality],
      [this.form_mother_tongue]: this.personalDetails[this.form_mother_tongue],
      [this.form_religion]: this.personalDetails[this.form_religion],
      [this.form_caste]: this.personalDetails[this.form_caste],
      [this.form_category]: this.personalDetails[this.form_category],
      [this.form_blood_group]: this.personalDetails[this.form_blood_group] ? this.personalDetails[this.form_blood_group].toString() : null,
      [this.form_father_name]: this.personalDetails[this.form_father_name],
      [this.form_emergency_contact]: this.personalDetails[this.form_emergency_contact],
      [this.form_mobile]: this.personalDetails[this.form_mobile],
      [this.form_email]: this.personalDetails[this.form_email],
      [this.form_aadhar]: this.personalDetails[this.form_aadhar],
      [this.form_pan]: this.personalDetails[this.form_pan],
      [this.form_offer_reference]: this.personalDetails[this.form_offer_reference],
      [this.form_offer_date]: this.dateConvertion(this.personalDetails[this.form_offer_date]),
      [this.form_height]: this.personalDetails[this.form_height] ? this.personalDetails[this.form_height].toString() : null,
      [this.form_weight]: this.personalDetails[this.form_weight] ? this.personalDetails[this.form_weight].toString() : null,
      [this.form_identification_mark1]: this.personalDetails[this.form_identification_mark1],
      [this.form_identification_mark2]: this.personalDetails[this.form_identification_mark2],
      [this.form_emergency_contact_name]: this.personalDetails[this.form_emergency_contact_name],
      [this.form_emergency_contact_relation]: this.personalDetails[this.form_emergency_contact_relation],
      [this.form_personal_email]: this.personalDetails[this.form_personal_email],
      [this.form_domicile_state]: this.personalDetails[this.form_domicile_state] ? this.personalDetails[this.form_domicile_state].toString() : null,
      [this.form_marital_status]: this.personalDetails[this.form_marital_status],
      [this.form_no_of_children]: this.personalDetails[this.form_no_of_children] ? this.personalDetails[this.form_no_of_children].toString() : null,
      [this.form_passport_number]: this.personalDetails[this.form_passport_number],
      [this.form_name_as_in_passport]: this.personalDetails[this.form_name_as_in_passport],
      [this.form_profession_as_in_passport]: this.personalDetails[this.form_profession_as_in_passport],
      [this.form_date_of_issue]: this.dateConvertion(this.personalDetails[this.form_date_of_issue]),
      [this.form_valid_upto]: this.dateConvertion(this.personalDetails[this.form_valid_upto]),
      [this.form_place_of_issue]: this.personalDetails[this.form_place_of_issue],
      [this.form_country_valid_for]: this.personalDetails[this.form_country_valid_for],
      [this.form_serious_illness]: this.personalDetails[this.form_serious_illness],
      [this.form_no_of_days]: this.personalDetails[this.form_no_of_days],
      [this.form_nature_of_illness]: this.personalDetails[this.form_nature_of_illness],
      [this.form_physical_disability]: this.personalDetails[this.form_physical_disability],
      [this.form_left_eyepower_glass]: this.personalDetails[this.form_left_eyepower_glass],
      [this.form_right_eye_power_glass]: this.personalDetails[this.form_right_eye_power_glass]
    });
    this.url = this.personalDetails.profile_image.url;
    this.patchLanguageForm();
    this.checkIsMarried();
  }

  patchLanguageForm() {
    if (this.personalDetails && this.personalDetails[this.form_language_array] && this.personalDetails[this.form_language_array].length > 0) {
      this.getLanguageArr.clear();
      this.personalDetails[this.form_language_array].forEach((element, i) => {
        this.getLanguageArr.push(this.patchingLanguageForm(element));
      });
    }
  }
  patchingLanguageForm(data) {
    return this.fb.group({
      [this.form_language_name]: [data[this.form_language_name], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_language_is_read]: [data[this.form_language_is_read]],
      [this.form_language_is_write]: [data[this.form_language_is_write]],
      [this.form_language_is_speak]: [data[this.form_language_is_speak]],
    }, { validator: FormCustomValidators.anyOneSelected })
  }
  maritalStatusChange() {
    this.checkIsMarried();
  }
  checkIsMarried() {
    if (this.personalForm.value[this.form_marital_status] && this.personalForm.value[this.form_marital_status] == 'Married' || this.personalForm.value[this.form_marital_status] && this.personalForm.value[this.form_marital_status] == 'Widow') {
      this.personalForm.controls[this.form_no_of_children].setValidators([Validators.required]);
      this.personalForm['controls'][this.form_no_of_children].updateValueAndValidity({ emitEvent: false });
    } else {
      this.personalForm.controls[this.form_no_of_children].setValue(null);
      this.personalForm.controls[this.form_no_of_children].clearValidators();
      this.personalForm['controls'][this.form_no_of_children].updateValueAndValidity({ emitEvent: false });
    }
  }
  formInitialize() {
    this.personalForm = this.fb.group({
      // [this.form_title]: [null, [Validators.required]],
      [this.form_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_dob]: [null, [Validators.required]],
      [this.form_gender]: [{value: null, disabled: this.candidateService.checkKycOrJoiningForm()}, [Validators.required]],
      [this.form_place_of_birth]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_state_of_birth]: [null, [Validators.required]],
      [this.form_nationality]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_mother_tongue]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_religion]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_caste]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_category]: [null, [Validators.required]],
      [this.form_blood_group]: [null, [Validators.required]],
      [this.form_father_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_emergency_contact]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.mobileRegex()]],
      [this.form_mobile]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.mobileRegex()]],
      [this.form_email]: [{value: this.appConfig.getLocalData('userEmail'), disabled: true}, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.email()]],
      [this.form_aadhar]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.aadhaar()]],
      [this.form_pan]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.panNo()]],
      [this.form_offer_reference]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.offer()]],
      [this.form_offer_date]: [null, [Validators.required]],
      [this.form_height]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.numberDecimals()]],
      [this.form_weight]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.numberDecimals()]],
      [this.form_identification_mark1]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_identification_mark2]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_emergency_contact_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_emergency_contact_relation]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_personal_email]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.email()]],
      [this.form_domicile_state]: [null, [Validators.required]],
      [this.form_marital_status]: [null, [Validators.required]],
      [this.form_no_of_children]: [null],
      [this.form_passport_number]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_name_as_in_passport]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_profession_as_in_passport]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_date_of_issue]: [null],
      [this.form_valid_upto]: [null],
      [this.form_place_of_issue]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_country_valid_for]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_serious_illness]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_no_of_days]: [null, [RemoveWhitespace.whitespace(), Validators.maxLength(5), this.glovbal_validators.numberOnly()]],
      [this.form_nature_of_illness]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_physical_disability]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_left_eyepower_glass]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.eyenumberDecimals()]],
      [this.form_right_eye_power_glass]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.eyenumberDecimals()]],

      [this.form_language_array]: this.fb.array([this.initLanguageArray()])
    })
    this.candidateService.checkKycOrJoiningForm() ? '' : this.setJoiningAndKYCValidators(this.personalForm);
  }

  initLanguageArray() {
    return this.fb.group({
      [this.form_language_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_language_is_read]: [null],
      [this.form_language_is_write]: [null],
      [this.form_language_is_speak]: [null],
    }, { validator: FormCustomValidators.anyOneSelected })
  }

  addlanguage() {
    let i = this.getLanguageArr['controls'].length - 1;
    if (this.getLanguageArr.valid) {
      if (this.getLanguageArr['controls'][i]['value'][this.form_language_name]) {
        this.getLanguageArr['controls'][i]['controls'][this.form_language_is_read].setErrors(null);
        if (this.getLanguageArr && this.getLanguageArr['controls'] && this.getLanguageArr['controls'][i] && this.getLanguageArr['controls'][i]['value'] && this.getLanguageArr['controls'][i]['value'][this.form_language_name]) {
          return this.getLanguageArr.push(this.initLanguageArray());
        }
      } else {
        this.getLanguageArr['controls'][i]['controls'][this.form_language_is_read].setErrors({ notSelected: true });
      }
    } else {
      this.glovbal_validators.validateAllFormArrays(this.personalForm.get([this.form_language_array]) as FormArray);
    }
  }

  removeLanguage(i) {
    this.getLanguageArr.removeAt(i);
  }

  setJoiningAndKYCValidators(form: FormGroup) {
    for (const key in form.controls) {
      if (this.keyValue(key)) {
          form.get(key).clearValidators();
          form.get(key).updateValueAndValidity();
      }
  }
  }
  keyValue(key) {
   return key != this.form_name
    && key != this.form_email
    && key != this.form_mobile
    && key != this.form_gender
    && key != this.form_dob ? true : false;
  }

  // Form getters
  // get ftitle() {
  //   return this.personalForm.get(this.form_title);
  // }
  get getLanguageArr() { return this.personalForm.get([this.form_language_array]) as FormArray; }

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

  get emergency_contact_name() {
    return this.personalForm.get(this.form_emergency_contact_name);
  }

  get emergency_contact_relation() {
    return this.personalForm.get(this.form_emergency_contact_relation);
  }

  get personal_email() {
    return this.personalForm.get(this.form_personal_email);
  }

  get domicile_state() {
    return this.personalForm.get(this.form_domicile_state);
  }

  get marital_status() {
    return this.personalForm.get(this.form_marital_status);
  }

  get no_of_children() {
    return this.personalForm.get(this.form_no_of_children);
  }

  get passport_number() {
    return this.personalForm.get(this.form_passport_number);
  }

  get name_as_in_passport() {
    return this.personalForm.get(this.form_name_as_in_passport);
  }

  get profession_as_in_passport() {
    return this.personalForm.get(this.form_profession_as_in_passport);
  }

  get date_of_issue() {
    return this.personalForm.get(this.form_date_of_issue);
  }

  get valid_upto() {
    return this.personalForm.get(this.form_valid_upto);
  }

  get place_of_issue() {
    return this.personalForm.get(this.form_place_of_issue);
  }

  get country_valid_for() {
    return this.personalForm.get(this.form_country_valid_for);
  }

  get serious_illness() {
    return this.personalForm.get(this.form_serious_illness);
  }

  get no_of_days() {
    return this.personalForm.get(this.form_no_of_days);
  }

  get nature_of_illness() {
    return this.personalForm.get(this.form_nature_of_illness);
  }

  get physical_disability() {
    return this.personalForm.get(this.form_physical_disability);
  }

  get left_eyepower_glass() {
    return this.personalForm.get(this.form_left_eyepower_glass);
  }

  get right_eye_power_glass() {
    return this.personalForm.get(this.form_right_eye_power_glass);
  }


ngOnDestroy() {
  this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
  this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
}
}
