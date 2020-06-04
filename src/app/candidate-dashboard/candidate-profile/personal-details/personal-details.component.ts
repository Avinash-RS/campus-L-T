import { Component, OnInit, ViewChild, OnDestroy, AfterContentInit, AfterContentChecked } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import { MatAutocompleteTrigger, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
// Date Picker
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { FormCanDeactivate } from 'src/app/guards/form-canDeactivate/form-can-deactivate';
import { NzMessageService } from 'ng-zorro-antd';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
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
export class PersonalDetailsComponent extends FormCanDeactivate implements OnInit, OnDestroy {

  @ViewChild('form', { static: false })
  form: NgForm;
  presentAddressFormReference: NgForm;
  permanentAddressFormReference: NgForm;
  languagesFormReference: NgForm;
  passportFormReference: NgForm;
  healthFormReference: NgForm;

  category = [
    {
      name: '0BC',
      caste: 'obc'
    },
    {
      name: 'BC',
      caste: 'bc'
    },
    {
      name: 'SC',
      caste: 'sc'
    },
    {
      name: 'MBC',
      caste: 'mbc'
    },
    {
      name: 'OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC OC ',
      caste: 'oc'
    },
  ];

  date = [
    { date: '01' }, { date: '02' }, { date: '03' }, { date: '04' }, { date: '05' }, { date: '06' }, { date: '07' }, { date: '08' }, { date: '09' }, { date: '10' }, { date: '11' }, { date: '12' }, { date: '13' }, { date: '14' }, { date: '15' }, { date: '16' }, { date: '17' }, { date: '18' }, { date: '19' }, { date: '20' }, { date: '21' }, { date: '22' }, { date: '23' }, { date: '24' }, { date: '25' }, { date: '26' }, { date: '27' }, { date: '28' }, { date: '29' }, { date: '30' }, { date: '31' }
  ];
  month = [
    { month: '01' }, { month: '02' }, { month: '03' }, { month: '04' }, { month: '05' }, { month: '06' }, { month: '07' }, { month: '08' }, { month: '09' }, { month: '10' }, { month: '11' }, { month: '12' },
  ];
  year = [
    { year: '1985' }, { year: '1986' }, { year: '1987' }, { year: '1988' }, { year: '1989' }, { year: '1990' }, { year: '1991' }, { year: '1992' }, { year: '1993' }, { year: '1994' }, { year: '1995' }, { year: '1996' }, { year: '1997' }, { year: '1998' }, { year: '1999' }, { year: '2000' }, { year: '2001' }, { year: '2002' }, { year: '2003' }, { year: '2004' }, { year: '2005' }, { year: '2006' }, { year: '2007' }, { year: '2008' }, { year: '2009' }, { year: '2010' }
  ];

  // Non-FormControl Fields
  validateOnSubmit = false;
  checked = false;
  radioValue;
  // State and City
  allCities: any;
  allStates: any;
  allPermanentCities: any;
  allPermanentStates: any;

  // Form 1 Upto Category
  upToCategoryForm: FormGroup;
  languagesForm: FormGroup;
  presentAddressForm: FormGroup;
  permanentAddressForm: FormGroup;
  passportForm: FormGroup;

  // Dates
  minDate: Date;
  maxDate: Date;
  passportValidminDate: Date;
  passportValidmaxDate: Date;
  healthForm: FormGroup;
  selectedImage: any;
  url: string;
  showSizeError = {
    image: false,
    size: false
  };
  userData: any;
  userDetails: any;
  FinaluserDetails: any;
  KYCModifiedData: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
  ) {
    super();
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date();
    this.passportValidminDate = new Date(currentYear - 20, 0, 1);
    this.passportValidmaxDate = new Date();
  }

  ngOnInit() {
    this.FormsInitialization();
    if (!this.appConfig.getLocalData('allStates') || !this.appConfig.getLocalData('allCities')) {
      this.cityAPI();
      this.stateAPI();
    } else {
      this.allCities = JSON.parse(this.appConfig.getLocalData('allCities'));
      this.allStates = JSON.parse(this.appConfig.getLocalData('allStates'));
    }

    if (this.appConfig.getLocalData('kycForm')) {
      const data = JSON.parse(this.appConfig.getLocalData('kycForm'));
      this.regularGetUserDetails(data);
    } else {
      this.getUserDetails();
    }
    if (this.appConfig.getLocalData('personalFormTouched')) {
      this.appConfig.clearLocalDataOne('personalFormTouched');
    }
  }

  cancel() {
    this.ngOnInit();
  }


  regularGetUserDetails(data) {
    if (data) {
      if (data['field_isformsubmitted'][0]['value'] === true) {
        this.appConfig.setLocalData('field_isformsubmitted', 'true');
        this.appConfig.setLocalData('personalFormSubmitted', 'true');
      } else {
        this.appConfig.setLocalData('field_isformsubmitted', 'false');
        this.appConfig.setLocalData('personalFormSubmitted', 'false');
      }
    } else {
      this.appConfig.setLocalData('field_isformsubmitted', 'false');
      this.appConfig.setLocalData('personalFormSubmitted', 'false');
    }

    this.userData = data;
    if (this.userData) {
      const organizeUserDetails = data;
      this.KYCModifiedData = data;
    } else {
      this.appConfig.hideLoader();
    }
    this.appConfig.hideLoader();
    this.FormsInitialization();

    if (this.userData && this.userData['field_isformsubmitted'][0]['value'] == true) {
      this.validateAllForms();
    }
  }
  // For Edit
  getUserDetails() {
    this.candidateService.getUserProfile().subscribe((data: any) => {
      this.appConfig.setLocalData('KYCAPI', JSON.stringify(data));
      if (data && data.length > 0) {
        if (data[0] && data[0]['field_isformsubmitted'] && data[0]['field_isformsubmitted'][0] && data[0]['field_isformsubmitted'][0]['value'] === true) {
          this.appConfig.setLocalData('field_isformsubmitted', 'true');
          this.appConfig.setLocalData('personalFormSubmitted', 'true');
          this.appConfig.setLocalData('educationalFormSubmitted', 'true');
          this.appConfig.setLocalData('familyFormSubmitted', 'true');
          this.appConfig.setLocalData('generalFormSubmitted', 'true');
          this.appConfig.setLocalData('confirmFormSubmitted', 'true');
        } else {
          this.appConfig.setLocalData('field_isformsubmitted', 'false');
          this.appConfig.setLocalData('personalFormSubmitted', 'false');
          this.appConfig.setLocalData('educationalFormSubmitted', 'false');
          this.appConfig.setLocalData('familyFormSubmitted', 'false');
          this.appConfig.setLocalData('generalFormSubmitted', 'false');
          this.appConfig.setLocalData('confirmFormSubmitted', 'false');
        }
      } else {
        this.appConfig.setLocalData('field_isformsubmitted', 'false');
        this.appConfig.setLocalData('personalFormSubmitted', 'false');
        this.appConfig.setLocalData('educationalFormSubmitted', 'false');
        this.appConfig.setLocalData('familyFormSubmitted', 'false');
        this.appConfig.setLocalData('generalFormSubmitted', 'false');
        this.appConfig.setLocalData('confirmFormSubmitted', 'false');
      }

      const datas = [];
      this.userData = data;
      if (this.userData && this.userData.length > 0) {
        this.userDetails = data[0];
        const organizeUserDetails = data[0];
        this.KYCModifiedData = data;
        this.KYCModifiedData = {
          type: 'candidate',

          uid: [
            {
              target_id: this.appConfig.getLocalData('userId')
            }
          ],
          field_name: { value: organizeUserDetails && organizeUserDetails['field_name'] && organizeUserDetails['field_name'][0] ? organizeUserDetails['field_name'][0]['value'] : '' },
          field_email: { value: organizeUserDetails && organizeUserDetails['field_email'] && organizeUserDetails['field_email'][0] ? organizeUserDetails['field_email'][0]['value'] : '' },
          field_mobile: { value: organizeUserDetails && organizeUserDetails['field_mobile'] && organizeUserDetails['field_mobile'][0] ? organizeUserDetails['field_mobile'][0]['value'] : '' },
          field_gender: { value: organizeUserDetails && organizeUserDetails['field_gender'] && organizeUserDetails['field_gender'][0] ? organizeUserDetails['field_gender'][0]['value'] : '' },
          field_mariatal_status: { value: organizeUserDetails && organizeUserDetails['field_mariatal_status'] && organizeUserDetails['field_mariatal_status'][0] ? organizeUserDetails['field_mariatal_status'][0]['value'] : '' },
          field_dob: { value: organizeUserDetails && organizeUserDetails['field_dob'] && organizeUserDetails['field_dob'][0] ? organizeUserDetails['field_dob'][0]['value'] : '' },
          field_nationality: { value: organizeUserDetails && organizeUserDetails['field_nationality'] && organizeUserDetails['field_nationality'][0] ? organizeUserDetails['field_nationality'][0]['value'] : '' },
          field_category: { value: organizeUserDetails && organizeUserDetails['field_category'] && organizeUserDetails['field_category'][0] ? organizeUserDetails['field_category'][0]['value'] : '' },

          field_present_line_street_addres: { value: organizeUserDetails && organizeUserDetails['field_present_line_street_addres'] && organizeUserDetails['field_present_line_street_addres'][0] ? organizeUserDetails['field_present_line_street_addres'][0]['value'] : '' },
          field_present_line2_street_addre: { value: organizeUserDetails && organizeUserDetails['field_present_line2_street_addre'] && organizeUserDetails['field_present_line2_street_addre'][0] ? organizeUserDetails['field_present_line2_street_addre'][0]['value'] : '' },
          field_present_zip: { value: organizeUserDetails && organizeUserDetails['field_present_zip'] && organizeUserDetails['field_present_zip'][0] ? organizeUserDetails['field_present_zip'][0]['value'] : '' },
          field_preset_city: { value: organizeUserDetails && organizeUserDetails['field_preset_city'] && organizeUserDetails['field_preset_city'][0] ? organizeUserDetails['field_preset_city'][0]['value'] : '' },
          field_present_state: { value: organizeUserDetails && organizeUserDetails['field_present_state'] && organizeUserDetails['field_present_state'][0] ? organizeUserDetails['field_present_state'][0]['value'] : '' },

          field_permanent_line1_street_add: { value: organizeUserDetails && organizeUserDetails['field_permanent_line1_street_add'] && organizeUserDetails['field_permanent_line1_street_add'][0] ? organizeUserDetails['field_permanent_line1_street_add'][0]['value'] : '' },
          field_permanent_line2_street_add: { value: organizeUserDetails && organizeUserDetails['field_permanent_line2_street_add'] && organizeUserDetails['field_permanent_line2_street_add'][0] ? organizeUserDetails['field_permanent_line2_street_add'][0]['value'] : '' },
          field_permanent_zip: { value: organizeUserDetails && organizeUserDetails['field_permanent_zip'] && organizeUserDetails['field_permanent_zip'][0] ? organizeUserDetails['field_permanent_zip'][0]['value'] : '' },
          field_permanent_city: { value: organizeUserDetails && organizeUserDetails['field_permanent_city'] && organizeUserDetails['field_permanent_city'][0] ? organizeUserDetails['field_permanent_city'][0]['value'] : '' },
          field_permanent_state: { value: organizeUserDetails && organizeUserDetails['field_permanent_state'] && organizeUserDetails['field_permanent_state'][0] ? organizeUserDetails['field_permanent_state'][0]['value'] : '' },

          field_language_known: { value: organizeUserDetails && organizeUserDetails['field_language_known'] && organizeUserDetails['field_language_known'][0] ? organizeUserDetails['field_language_known'][0]['value'] : '' },

          field_read: [{ value: organizeUserDetails && organizeUserDetails['field_read'] && organizeUserDetails['field_read'][0] ? organizeUserDetails['field_read'][0]['value'] : '' }],
          field_write: [{ value: organizeUserDetails && organizeUserDetails['field_write'] && organizeUserDetails['field_write'][0] ? organizeUserDetails['field_write'][0]['value'] : '' }],
          field_speak: [{ value: organizeUserDetails && organizeUserDetails['field_speak'] && organizeUserDetails['field_speak'][0] ? organizeUserDetails['field_speak'][0]['value'] : '' }],

          field_passport_number: { value: organizeUserDetails && organizeUserDetails['field_passport_number'] && organizeUserDetails['field_passport_number'][0] ? organizeUserDetails['field_passport_number'][0]['value'] : '' },
          field_name_as_in_passport: { value: organizeUserDetails && organizeUserDetails['field_name_as_in_passport'] && organizeUserDetails['field_name_as_in_passport'][0] ? organizeUserDetails['field_name_as_in_passport'][0]['value'] : '' },
          field_profesiona_as_passport: { value: organizeUserDetails && organizeUserDetails['field_profesiona_as_passport'] && organizeUserDetails['field_profesiona_as_passport'][0] ? organizeUserDetails['field_profesiona_as_passport'][0]['value'] : '' },
          field_date_of_issue: { value: organizeUserDetails && organizeUserDetails['field_date_of_issue'] && organizeUserDetails['field_date_of_issue'][0] ? organizeUserDetails['field_date_of_issue'][0]['value'] : '' },
          field_valid_upto: { value: organizeUserDetails && organizeUserDetails['field_valid_upto'] && organizeUserDetails['field_valid_upto'][0] ? organizeUserDetails['field_valid_upto'][0]['value'] : '' },
          field_place_of_issue: { value: organizeUserDetails && organizeUserDetails['field_place_of_issue'] && organizeUserDetails['field_place_of_issue'][0] ? organizeUserDetails['field_place_of_issue'][0]['value'] : '' },
          field_country_valid_for: { value: organizeUserDetails && organizeUserDetails['field_country_valid_for'] && organizeUserDetails['field_country_valid_for'][0] ? organizeUserDetails['field_country_valid_for'][0]['value'] : '' },

          field_serious_illness: { value: organizeUserDetails && organizeUserDetails['field_serious_illness'] && organizeUserDetails['field_serious_illness'][0] ? organizeUserDetails['field_serious_illness'][0]['value'] : '' },
          field_no_of_days: { value: organizeUserDetails && organizeUserDetails['field_no_of_days'] && organizeUserDetails['field_no_of_days'][0] ? organizeUserDetails['field_no_of_days'][0]['value'] : '' },
          field_nature_of_illness: { value: organizeUserDetails && organizeUserDetails['field_nature_of_illness'] && organizeUserDetails['field_nature_of_illness'][0] ? organizeUserDetails['field_nature_of_illness'][0]['value'] : '' },
          field_physical_disability: { value: organizeUserDetails && organizeUserDetails['field_physical_disability'] && organizeUserDetails['field_physical_disability'][0] ? organizeUserDetails['field_physical_disability'][0]['value'] : '' },
          field_height: { value: organizeUserDetails && organizeUserDetails['field_height'] && organizeUserDetails['field_height'][0] ? organizeUserDetails['field_height'][0]['value'] : '' },
          field_weight: { value: organizeUserDetails && organizeUserDetails['field_weight'] && organizeUserDetails['field_weight'][0] ? organizeUserDetails['field_weight'][0]['value'] : '' },
          field_right_eye_power_glass: { value: organizeUserDetails && organizeUserDetails['field_right_eye_power_glass'] && organizeUserDetails['field_right_eye_power_glass'][0] ? organizeUserDetails['field_right_eye_power_glass'][0]['value'] : '' },
          field_left_eyepower_glass: { value: organizeUserDetails && organizeUserDetails['field_left_eyepower_glass'] && organizeUserDetails['field_left_eyepower_glass'][0] ? organizeUserDetails['field_left_eyepower_glass'][0]['value'] : '' },

          // Educational
          field_level: { value: organizeUserDetails && organizeUserDetails['field_level'] && organizeUserDetails['field_level'][0] ? organizeUserDetails['field_level'][0]['value'] : '' },
          field_board_university: { value: organizeUserDetails && organizeUserDetails['field_board_university'] && organizeUserDetails['field_board_university'][0] ? organizeUserDetails['field_board_university'][0]['value'] : '' },
          field_institute: { value: organizeUserDetails && organizeUserDetails['field_institute'] && organizeUserDetails['field_institute'][0] ? organizeUserDetails['field_institute'][0]['value'] : '' },
          field_discipline: { value: organizeUserDetails && organizeUserDetails['field_discipline'] && organizeUserDetails['field_discipline'][0] ? organizeUserDetails['field_discipline'][0]['value'] : '' },
          field_specification: { value: organizeUserDetails && organizeUserDetails['field_specification'] && organizeUserDetails['field_specification'][0] ? organizeUserDetails['field_specification'][0]['value'] : '' },
          field_year_of_passing: { value: organizeUserDetails && organizeUserDetails['field_year_of_passing'] && organizeUserDetails['field_year_of_passing'][0] ? organizeUserDetails['field_year_of_passing'][0]['value'] : '' },
          field_percentage: { value: organizeUserDetails && organizeUserDetails['field_percentage'] && organizeUserDetails['field_percentage'][0] ? organizeUserDetails['field_percentage'][0]['value'] : '' },

          // Family
          field_name_of_your_family_member: { value: organizeUserDetails && organizeUserDetails['field_name_of_your_family_member'] && organizeUserDetails['field_name_of_your_family_member'][0] ? organizeUserDetails['field_name_of_your_family_member'][0]['value'] : '' },
          field_family_date_of_birth: { value: organizeUserDetails && organizeUserDetails['field_family_date_of_birth'] && organizeUserDetails['field_family_date_of_birth'][0] ? organizeUserDetails['field_family_date_of_birth'][0]['value'] : '' },
          field_relationship: { value: organizeUserDetails && organizeUserDetails['field_relationship'] && organizeUserDetails['field_relationship'][0] ? organizeUserDetails['field_relationship'][0]['value'] : '' },
          field_occupation: { value: organizeUserDetails && organizeUserDetails['field_occupation'] && organizeUserDetails['field_occupation'][0] ? organizeUserDetails['field_occupation'][0]['value'] : '' },

          // General
          field_add_your_skills: { value: organizeUserDetails && organizeUserDetails['field_add_your_skills'] && organizeUserDetails['field_add_your_skills'][0] ? organizeUserDetails['field_add_your_skills'][0]['value'] : '' },
          field_relatives_l_t_group_name: { value: organizeUserDetails && organizeUserDetails['field_relatives_l_t_group_name'] && organizeUserDetails['field_relatives_l_t_group_name'][0] ? organizeUserDetails['field_relatives_l_t_group_name'][0]['value'] : '' },
          field_realationship: { value: organizeUserDetails && organizeUserDetails['field_realationship'] && organizeUserDetails['field_realationship'][0] ? organizeUserDetails['field_realationship'][0]['value'] : '' },
          field_position: { value: organizeUserDetails && organizeUserDetails['field_position'] && organizeUserDetails['field_position'][0] ? organizeUserDetails['field_position'][0]['value'] : '' },
          field_company: { value: organizeUserDetails && organizeUserDetails['field_company'] && organizeUserDetails['field_company'][0] ? organizeUserDetails['field_company'][0]['value'] : '' },
          field_faculty_reference: { value: organizeUserDetails && organizeUserDetails['field_faculty_reference'] && organizeUserDetails['field_faculty_reference'][0] ? organizeUserDetails['field_faculty_reference'][0]['value'] : '' },
          field_faculty_reference1: { value: organizeUserDetails && organizeUserDetails['field_faculty_reference1'] && organizeUserDetails['field_faculty_reference1'][0] ? organizeUserDetails['field_faculty_reference1'][0]['value'] : '' },

          is_default: [{
            value: '1'
          }],
          field_isformsubmitted: [
            {
              value: true
            }
          ],
        };
        this.appConfig.setLocalData('kycForm', JSON.stringify(this.KYCModifiedData));

        this.appConfig.hideLoader();
      } else {
        this.KYCModifiedData = {
          type: 'candidate',

          uid: [
            {
              target_id: this.appConfig.getLocalData('userId')
            }
          ],

          is_default: [{
            value: '1'
          }],
          field_isformsubmitted: [
            {
              value: false
            }
          ],
        };
        this.appConfig.setLocalData('kycForm', JSON.stringify(this.KYCModifiedData));

        this.appConfig.hideLoader();
      }
      this.FormsInitialization();

      if (this.userData && this.userData.length > 0) {
        this.validateAllForms();
      }

    }, (error) => {

    });
  }

  detectSelectChange() {
    this.appConfig.setLocalData('personalFormTouched', 'true');
  }
  detectInput(form) {

    if (form.touched === true) {
      this.appConfig.setLocalData('personalFormTouched', 'true');
    }
  }

  onSubmit(OptA, OptB, OptC, OptD, OptE, OptF) {
    if (this.upToCategoryForm.valid && this.presentAddressForm.valid && this.permanentAddressForm.valid
      && this.languagesForm.valid && this.passportForm.valid && this.healthForm.valid && (this.languagesForm.value.firstRead || this.languagesForm.value.firstWrite || this.languagesForm.value.firstSpeak)) {
      this.KYCModifiedData.field_name = { value: this.upToCategoryForm.value.name ? this.upToCategoryForm.value.name : '' };
      this.KYCModifiedData.field_email = { value: this.upToCategoryForm.value.mail ? this.upToCategoryForm.value.mail : '' };
      this.KYCModifiedData.field_mobile = { value: this.upToCategoryForm.value.mobile ? this.upToCategoryForm.value.mobile : '' };
      this.KYCModifiedData.field_gender = { value: this.upToCategoryForm.value.gender ? this.upToCategoryForm.value.gender : '' };
      this.KYCModifiedData.field_mariatal_status = { value: this.upToCategoryForm.value.marital ? this.upToCategoryForm.value.marital : '' };
      this.KYCModifiedData.field_dob = { value: moment(`${this.upToCategoryForm.value.dobYear}-${this.upToCategoryForm.value.dobMonth}-${this.upToCategoryForm.value.dobDate}`).format() };
      this.KYCModifiedData.field_nationality = { value: this.upToCategoryForm.value.nationality ? this.upToCategoryForm.value.nationality : '' };
      this.KYCModifiedData.field_category = { value: this.upToCategoryForm.value.category ? this.upToCategoryForm.value.category : '' };
      this.KYCModifiedData.field_present_line_street_addres = { value: this.presentAddressForm.value.presentAddress1 ? this.presentAddressForm.value.presentAddress1 : '' };
      this.KYCModifiedData.field_present_line2_street_addre = { value: this.presentAddressForm.value.presentAddress2 ? this.presentAddressForm.value.presentAddress2 : '' };
      this.KYCModifiedData.field_present_zip = { value: this.presentAddressForm.value.presentZipCode ? this.presentAddressForm.value.presentZipCode : '' };
      this.KYCModifiedData.field_preset_city = { value: this.presentAddressForm.value.presentCity ? this.presentAddressForm.value.presentCity : '' };
      this.KYCModifiedData.field_present_state = { value: this.presentAddressForm.value.presentState ? this.presentAddressForm.value.presentState : '' };
      this.KYCModifiedData.field_permanent_line1_street_add = { value: this.permanentAddressForm.value.permanentAddress1 ? this.permanentAddressForm.value.permanentAddress1 : '' };
      this.KYCModifiedData.field_permanent_line2_street_add = { value: this.permanentAddressForm.value.permanentAddress2 ? this.permanentAddressForm.value.permanentAddress2 : '' };
      this.KYCModifiedData.field_permanent_zip = { value: this.permanentAddressForm.value.permanentZipCode ? this.permanentAddressForm.value.permanentZipCode : '' };
      this.KYCModifiedData.field_permanent_city = { value: this.permanentAddressForm.value.permanentCity ? this.permanentAddressForm.value.permanentCity : '' };
      this.KYCModifiedData.field_permanent_state = { value: this.permanentAddressForm.value.permanentState ? this.permanentAddressForm.value.permanentState : '' };
      this.KYCModifiedData.field_language_known = { value: this.languagesForm.value.languageRequired ? this.languagesForm.value.languageRequired : '' };

      this.KYCModifiedData.field_read = [{ value: this.languagesForm.value.firstRead ? true : false }];
      this.KYCModifiedData.field_write = [{ value: this.languagesForm.value.firstWrite ? true : false }];
      this.KYCModifiedData.field_speak = [{ value: this.languagesForm.value.firstSpeak ? true : false }];

      this.KYCModifiedData.field_passport_number = { value: this.passportForm.value.passportNumber ? this.passportForm.value.passportNumber : '' };
      this.KYCModifiedData.field_name_as_in_passport = { value: this.passportForm.value.passportName ? this.passportForm.value.passportName : '' };
      this.KYCModifiedData.field_profesiona_as_passport = { value: this.passportForm.value.passportProfession ? this.passportForm.value.passportProfession : '' };
      this.KYCModifiedData.field_date_of_issue = { value: this.passportForm.value.passportIssueDate['_d'] ? moment(this.passportForm.value.passportIssueDate['_d']).format() : '' };
      this.KYCModifiedData.field_valid_upto = { value: this.passportForm.value.passportValid['_d'] ? moment(this.passportForm.value.passportValid['_d']).format() : '' };
      this.KYCModifiedData.field_place_of_issue = { value: this.passportForm.value.passportIssuePlace ? this.passportForm.value.passportIssuePlace : '' };
      this.KYCModifiedData.field_country_valid_for = { value: this.passportForm.value.passportValidFor ? this.passportForm.value.passportValidFor : '' };
      this.KYCModifiedData.field_serious_illness = { value: this.passportForm.value.passportValidFor ? this.passportForm.value.passportValidFor : '' };
      this.KYCModifiedData.field_no_of_days = { value: this.healthForm.value.daysofIll ? this.healthForm.value.daysofIll : '' };
      this.KYCModifiedData.field_nature_of_illness = { value: this.healthForm.value.natureofIll ? this.healthForm.value.natureofIll : '' };
      this.KYCModifiedData.field_physical_disability = { value: this.healthForm.value.disability ? this.healthForm.value.disability : '' };
      this.KYCModifiedData.field_height = { value: this.healthForm.value.height ? this.healthForm.value.height : '' };
      this.KYCModifiedData.field_weight = { value: this.healthForm.value.weight ? this.healthForm.value.weight : '' };
      this.KYCModifiedData.field_right_eye_power_glass = { value: this.healthForm.value.eyePower.right ? this.healthForm.value.eyePower.right : '' };
      this.KYCModifiedData.field_left_eyepower_glass = { value: this.healthForm.value.eyePower.left ? this.healthForm.value.eyePower.left : '' };

      this.appConfig.setLocalData('personalFormSubmitted', 'true');
      this.appConfig.clearLocalDataOne('personalFormTouched');
      this.appConfig.setLocalData('kycForm', JSON.stringify(this.KYCModifiedData));
      this.appConfig.nzNotification('success', 'Submitted', 'Personal details has been updated');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_EDUCATIONAL_DETAILS);

    } else {
      setTimeout(() => {
        window.scroll(0, 0);
      }, 10);
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');

      this.validateOnSubmit = true;
      this.validateAllFields(this.upToCategoryForm);
      this.validateAllFields(this.presentAddressForm);
      this.validateAllFields(this.permanentAddressForm);
      this.validateAllFields(this.languagesForm);
      this.validateAllFields(this.passportForm);
      this.validateAllFields(this.healthForm);
    }

  }
  // Forms Initialization
  FormsInitialization() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobileRegex: RegExp = /^[1-9][0-9]{9}$/;
    const numberOnly: RegExp = /^[0-9]*$/;
    const numberDecimals: RegExp = /^\d*(\.\d{0,2})?$/;
    // Form 1 UptoCategory
    this.upToCategoryForm = this.fb.group({
      name: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.pattern(emailregex)]],
      mobile: ['', [Validators.required, Validators.pattern(mobileRegex)]],
      gender: ['', [Validators.required]],
      marital: ['', [Validators.required]],
      dobDate: [null, [Validators.required]],
      dobMonth: [null, [Validators.required]],
      dobYear: [null, [Validators.required]],
      nationality: ['', [Validators.required]],
      category: [''],
    }), this.upToCategoryFormPatchvalues();

    // Present Address Form
    this.presentAddressForm = this.fb.group({
      presentAddress1: ['', [Validators.required]],
      presentAddress2: ['', [Validators.required]],
      presentZipCode: ['', [Validators.required]],
      presentState: ['', [Validators.required]],
      presentCity: ['', [Validators.required]],
    }), this.presentAddressPatchValue();

    // Present Address Form
    this.permanentAddressForm = this.fb.group({
      permanentAddress1: ['', [Validators.required]],
      permanentAddress2: ['', [Validators.required]],
      permanentZipCode: ['', [Validators.required]],
      permanentState: ['', [Validators.required]],
      permanentCity: ['', [Validators.required]],
    }), this.permanentAddressPatchValue();


    // Language Form
    this.languagesForm = this.fb.group({
      languageRequired: ['', [Validators.required]],
      firstRead: [''],
      firstWrite: [''],
      firstSpeak: [''],
      languageAdd: this.fb.array([])
    }), this.languageFormPatchValue();

    // Passport Form
    this.passportForm = this.fb.group({
      passportNumber: ['', [Validators.pattern(numberOnly)]],
      passportName: [''],
      passportProfession: [''],
      passportIssueDate: [''],
      // passportValid: ['', [Validators.required, FormCustomValidators.dateValidation()]],
      passportValid: [''],
      passportIssuePlace: [''],
      passportValidFor: [''],
    }), this.passportFormPatchValue();

    // Health Form
    this.healthForm = this.fb.group({
      illness: [''],
      daysofIll: ['', [Validators.pattern(numberDecimals)]],
      natureofIll: [''],
      disability: [''],
      height: ['', [Validators.pattern(numberDecimals)]],
      weight: ['', [Validators.pattern(numberDecimals)]],
      eyePower: this.fb.group({
        left: ['', [Validators.pattern(numberDecimals)]],
        right: ['', [Validators.pattern(numberDecimals)]],
      })
    }), this.healthFormPatchValue();
  }

  removeLanguage(i) {
    this.t.removeAt(i);
  }

  addLanguage() {
    this.t.push(this.createItem());
  }


  upToCategoryFormPatchvalues() {
    const organizeUserDetails = this.KYCModifiedData;

    let dob;
    const dobFormats = organizeUserDetails && organizeUserDetails['field_dob'] && organizeUserDetails['field_dob'] ? organizeUserDetails['field_dob'].value : '';
    if (dobFormats) {
      const split = moment(dobFormats).format('DD/MM/YYYY').split('/');
      dob = {
        date: split[0],
        month: split[1],
        year: split[2],
      };
    } else {
      dob = {
        date: null,
        month: null,
        year: null,
      };
    }
    this.upToCategoryForm.patchValue({

      name: organizeUserDetails && organizeUserDetails['field_name'] && organizeUserDetails['field_name'] ? organizeUserDetails['field_name']['value'] : '',
      mail: organizeUserDetails && organizeUserDetails['field_email'] && organizeUserDetails['field_email'] ? organizeUserDetails['field_email']['value'] : '',
      mobile: organizeUserDetails && organizeUserDetails['field_mobile'] && organizeUserDetails['field_mobile'] ? organizeUserDetails['field_mobile']['value'] : '',
      gender: organizeUserDetails && organizeUserDetails['field_gender'] && organizeUserDetails['field_gender'] ? organizeUserDetails['field_gender']['value'] : '',
      marital: organizeUserDetails && organizeUserDetails['field_mariatal_status'] && organizeUserDetails['field_mariatal_status'] ? organizeUserDetails['field_mariatal_status']['value'] : '',
      dobDate: dob.date,
      dobMonth: dob.month,
      dobYear: dob.year,
      nationality: organizeUserDetails && organizeUserDetails.field_nationality && organizeUserDetails['field_nationality'] ? organizeUserDetails['field_nationality']['value'] : '',
      category: organizeUserDetails && organizeUserDetails.field_category && organizeUserDetails['field_category'] ? organizeUserDetails['field_category']['value'] : '',

      // name: organizeUserDetails && organizeUserDetails.field_name && organizeUserDetails.field_name[0] ? organizeUserDetails.field_name[0].value : '',
      // mail: organizeUserDetails && organizeUserDetails.field_email && organizeUserDetails.field_email[0] ? organizeUserDetails.field_email[0].value : '',
      // mobile: organizeUserDetails && organizeUserDetails.field_mobile && organizeUserDetails.field_mobile[0] ? organizeUserDetails.field_mobile[0].value : '',
      // gender: organizeUserDetails && organizeUserDetails.field_gender && organizeUserDetails.field_gender[0] ? organizeUserDetails.field_gender[0].value : '',
      // marital: organizeUserDetails && organizeUserDetails.field_mariatal_status && organizeUserDetails.field_mariatal_status[0] ? organizeUserDetails.field_mariatal_status[0].value : '',
      // dobDate: dob.date,
      // dobMonth: dob.month,
      // dobYear: dob.year,
      // nationality: organizeUserDetails && organizeUserDetails.field_nationality && organizeUserDetails.field_nationality[0] ? organizeUserDetails.field_nationality[0].value : '',
      // category: organizeUserDetails && organizeUserDetails.field_category && organizeUserDetails.field_category[0] ? organizeUserDetails.field_category[0].value : '',
    });
  }

  presentAddressPatchValue() {
    const organizeUserDetails = this.KYCModifiedData;
    // // Present Address Form
    this.presentAddressForm.patchValue({
      presentAddress1: organizeUserDetails && organizeUserDetails['field_present_line_street_addres'] && organizeUserDetails['field_present_line_street_addres'] ? organizeUserDetails['field_present_line_street_addres']['value'] : '',
      presentAddress2: organizeUserDetails && organizeUserDetails['field_present_line2_street_addre'] && organizeUserDetails['field_present_line2_street_addre'] ? organizeUserDetails['field_present_line2_street_addre']['value'] : '',
      presentZipCode: organizeUserDetails && organizeUserDetails['field_present_zip'] && organizeUserDetails['field_present_zip'] ? organizeUserDetails['field_present_zip']['value'] : '',
      presentCity: organizeUserDetails && organizeUserDetails['field_preset_city'] && organizeUserDetails['field_preset_city'] ? organizeUserDetails['field_preset_city']['value'] : '',
      presentState: organizeUserDetails && organizeUserDetails['field_present_state'] && organizeUserDetails['field_present_state'] ? organizeUserDetails['field_present_state']['value'] : '',

      // presentAddress1: organizeUserDetails && organizeUserDetails.field_present_line_street_addres && organizeUserDetails.field_present_line_street_addres[0] ? organizeUserDetails.field_present_line_street_addres[0].value : '',
      // presentAddress2: organizeUserDetails && organizeUserDetails.field_present_line2_street_addre && organizeUserDetails.field_present_line2_street_addre[0] ? organizeUserDetails.field_present_line2_street_addre[0].value : '',
      // presentZipCode: organizeUserDetails && organizeUserDetails.field_present_zip && organizeUserDetails.field_present_zip[0] ? organizeUserDetails.field_present_zip[0].value : '',
      // presentState: organizeUserDetails && organizeUserDetails.field_present_state && organizeUserDetails.field_present_state[0] ? organizeUserDetails.field_present_state[0].value : '',
      // presentCity: organizeUserDetails && organizeUserDetails.field_preset_city && organizeUserDetails.field_preset_city[0] ? organizeUserDetails.field_preset_city[0].value : '',
    });
  }

  permanentAddressPatchValue() {
    const organizeUserDetails = this.KYCModifiedData;
    // Permanent Address Form
    this.permanentAddressForm.patchValue({
      permanentAddress1: organizeUserDetails && organizeUserDetails['field_permanent_line1_street_add'] && organizeUserDetails['field_permanent_line1_street_add'] ? organizeUserDetails['field_permanent_line1_street_add']['value'] : '',
      permanentAddress2: organizeUserDetails && organizeUserDetails['field_permanent_line2_street_add'] && organizeUserDetails['field_permanent_line2_street_add'] ? organizeUserDetails['field_permanent_line2_street_add']['value'] : '',
      permanentZipCode: organizeUserDetails && organizeUserDetails['field_permanent_zip'] && organizeUserDetails['field_permanent_zip'] ? organizeUserDetails['field_permanent_zip']['value'] : '',
      permanentCity: organizeUserDetails && organizeUserDetails['field_permanent_city'] && organizeUserDetails['field_permanent_city'] ? organizeUserDetails['field_permanent_city']['value'] : '',
      permanentState: organizeUserDetails && organizeUserDetails['field_permanent_state'] && organizeUserDetails['field_permanent_state'] ? organizeUserDetails['field_permanent_state']['value'] : '',

      // permanentAddress1: organizeUserDetails && organizeUserDetails.field_permanent_line1_street_add && organizeUserDetails.field_permanent_line1_street_add[0] ? organizeUserDetails.field_permanent_line1_street_add[0].value : '',
      // permanentAddress2: organizeUserDetails && organizeUserDetails.field_present_line2_street_addre && organizeUserDetails.field_present_line2_street_addre[0] ? organizeUserDetails.field_present_line2_street_addre[0].value : '',
      // permanentZipCode: organizeUserDetails && organizeUserDetails.field_permanent_zip && organizeUserDetails.field_permanent_zip[0] ? organizeUserDetails.field_permanent_zip[0].value : '',
      // permanentState: organizeUserDetails && organizeUserDetails.field_permanent_state && organizeUserDetails.field_permanent_state[0] ? organizeUserDetails.field_permanent_state[0].value : '',
      // permanentCity: organizeUserDetails && organizeUserDetails.field_permanent_city && organizeUserDetails.field_permanent_city[0] ? organizeUserDetails.field_permanent_city[0].value : ''
    });
  }
  languageFormPatchValue() {
    const organizeUserDetails = this.KYCModifiedData;
    this.languagesForm.patchValue(
      {
        languageRequired: organizeUserDetails && organizeUserDetails['field_language_known'] && organizeUserDetails['field_language_known'] ? organizeUserDetails['field_language_known']['value'] : '',

        firstRead: organizeUserDetails && organizeUserDetails['field_read'] && organizeUserDetails['field_read'][0] ? organizeUserDetails['field_read'][0]['value'] : '',
        firstWrite: organizeUserDetails && organizeUserDetails['field_write'] && organizeUserDetails['field_write'][0] ? organizeUserDetails['field_write'][0]['value'] : '',
        firstSpeak: organizeUserDetails && organizeUserDetails['field_speak'] && organizeUserDetails['field_speak'][0] ? organizeUserDetails['field_speak'][0]['value'] : '',

        // languageRequired: organizeUserDetails && organizeUserDetails.field_language_known && organizeUserDetails.field_language_known[0] ? organizeUserDetails.field_language_known[0].value : '',
        // firstRead: organizeUserDetails && organizeUserDetails.field_read && organizeUserDetails.field_read[0] ? organizeUserDetails.field_read[0].value : '',
        // firstWrite: organizeUserDetails && organizeUserDetails.field_write && organizeUserDetails.field_write[0] ? organizeUserDetails.field_write[0].value : '',
        // firstSpeak: organizeUserDetails && organizeUserDetails.field_speak && organizeUserDetails.field_speak[0] ? organizeUserDetails.field_speak[0].value : ''
      });
  }

  passportFormPatchValue() {
    const organizeUserDetails = this.KYCModifiedData;
    this.passportForm.patchValue(
      {
        passportNumber: organizeUserDetails && organizeUserDetails['field_passport_number'] && organizeUserDetails['field_passport_number'] ? organizeUserDetails['field_passport_number']['value'] : '',

        passportName: organizeUserDetails && organizeUserDetails['field_name_as_in_passport'] && organizeUserDetails['field_name_as_in_passport'] ? organizeUserDetails['field_name_as_in_passport']['value'] : '',

        passportProfession: organizeUserDetails && organizeUserDetails['field_profesiona_as_passport'] && organizeUserDetails['field_profesiona_as_passport'] ? organizeUserDetails['field_profesiona_as_passport']['value'] : '',

        passportIssueDate: organizeUserDetails && organizeUserDetails['field_date_of_issue'] && organizeUserDetails['field_date_of_issue'] ? organizeUserDetails['field_date_of_issue']['value'] : '',

        passportValid: organizeUserDetails && organizeUserDetails['field_valid_upto'] && organizeUserDetails['field_valid_upto'] ? organizeUserDetails['field_valid_upto']['value'] : '',

        passportIssuePlace: organizeUserDetails && organizeUserDetails['field_place_of_issue'] && organizeUserDetails['field_place_of_issue'] ? organizeUserDetails['field_place_of_issue']['value'] : '',

        passportValidFor: organizeUserDetails && organizeUserDetails['field_country_valid_for'] && organizeUserDetails['field_country_valid_for'] ? organizeUserDetails['field_country_valid_for']['value'] : '',

        // passportNumber: organizeUserDetails && organizeUserDetails.field_passport_number && organizeUserDetails.field_passport_number[0] ? organizeUserDetails.field_passport_number[0].value : '',
        // passportName: organizeUserDetails && organizeUserDetails.field_name_as_in_passport && organizeUserDetails.field_name_as_in_passport[0] ? organizeUserDetails.field_name_as_in_passport[0].value : '',
        // passportProfession: organizeUserDetails && organizeUserDetails.field_profesiona_as_passport && organizeUserDetails.field_profesiona_as_passport[0] ? organizeUserDetails.field_profesiona_as_passport[0].value : '',
        // passportIssueDate: organizeUserDetails && organizeUserDetails.field_date_of_issue && organizeUserDetails.field_date_of_issue[0] ? organizeUserDetails.field_date_of_issue[0].value : '',
        // passportValid: organizeUserDetails && organizeUserDetails.field_valid_upto && organizeUserDetails.field_valid_upto[0] ? organizeUserDetails.field_valid_upto[0].value : '',
        // passportIssuePlace: organizeUserDetails && organizeUserDetails.field_place_of_issue && organizeUserDetails.field_place_of_issue[0] ? organizeUserDetails.field_place_of_issue[0].value : '',
        // passportValidFor: organizeUserDetails && organizeUserDetails.field_country_valid_for && organizeUserDetails.field_country_valid_for[0] ? organizeUserDetails.field_country_valid_for[0].value : '',
      });
  }

  healthFormPatchValue() {
    const organizeUserDetails = this.KYCModifiedData;
    this.healthForm.patchValue({
      illness: organizeUserDetails && organizeUserDetails['field_serious_illness'] && organizeUserDetails['field_serious_illness'] ? organizeUserDetails['field_serious_illness']['value'] : '',

      daysofIll: organizeUserDetails && organizeUserDetails['field_no_of_days'] && organizeUserDetails['field_no_of_days'] ? organizeUserDetails['field_no_of_days']['value'] : '',

      natureofIll: organizeUserDetails && organizeUserDetails['field_nature_of_illness'] && organizeUserDetails['field_nature_of_illness'] ? organizeUserDetails['field_nature_of_illness']['value'] : '',

      disability: organizeUserDetails && organizeUserDetails['field_physical_disability'] && organizeUserDetails['field_physical_disability'] ? organizeUserDetails['field_physical_disability']['value'] : '',

      height: organizeUserDetails && organizeUserDetails['field_height'] && organizeUserDetails['field_height'] ? organizeUserDetails['field_height']['value'] : '',
      weight: organizeUserDetails && organizeUserDetails['field_weight'] && organizeUserDetails['field_weight'] ? organizeUserDetails['field_weight']['value'] : '',

      eyePower: {
        left: organizeUserDetails && organizeUserDetails['field_left_eyepower_glass'] && organizeUserDetails['field_left_eyepower_glass'] ? organizeUserDetails['field_left_eyepower_glass']['value'] : '',
        right: organizeUserDetails && organizeUserDetails['field_right_eye_power_glass'] && organizeUserDetails['field_right_eye_power_glass'] ? organizeUserDetails['field_right_eye_power_glass']['value'] : '',
      }


      // illness: organizeUserDetails && organizeUserDetails.field_serious_illness && organizeUserDetails.field_serious_illness[0] ? organizeUserDetails.field_serious_illness[0].value : '',

      // daysofIll: organizeUserDetails && organizeUserDetails.field_no_of_days && organizeUserDetails.field_no_of_days[0] ? organizeUserDetails.field_no_of_days[0].value : '',

      // natureofIll: organizeUserDetails && organizeUserDetails.field_nature_of_illness && organizeUserDetails.field_nature_of_illness[0] ? organizeUserDetails.field_nature_of_illness[0].value : '',

      // disability: organizeUserDetails && organizeUserDetails.field_physical_disability && organizeUserDetails.field_physical_disability[0] ? organizeUserDetails.field_physical_disability[0].value : '',

      // height: organizeUserDetails && organizeUserDetails.field_height && organizeUserDetails.field_height[0] ? organizeUserDetails.field_height[0].value : '',

      // weight: organizeUserDetails && organizeUserDetails.field_weight && organizeUserDetails.field_weight[0] ? organizeUserDetails.field_weight[0].value : '',
      // eyePower: {
      //   left: organizeUserDetails && organizeUserDetails.field_left_eyepower_glass && organizeUserDetails.field_left_eyepower_glass[0] ? organizeUserDetails.field_left_eyepower_glass[0].value : '',
      //   right: organizeUserDetails && organizeUserDetails.field_right_eye_power_glass && organizeUserDetails.field_right_eye_power_glass[0] ? organizeUserDetails.field_right_eye_power_glass[0].value : '',
      // }
    });
  }

  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;

    } else {
      return '';
    }
  }

  preventDate(e, datepicker: MatDatepicker<Moment>) {
    datepicker.open();
    e.preventDefault();
    return false;
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = !this.passportForm.get('passportIssueDate').value ? moment() : this.passportForm.get('passportIssueDate').value;
    ctrlValue.year(normalizedYear.year());
    this.passportForm.get('passportIssueDate').setValue(ctrlValue);

  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = !this.passportForm.get('passportIssueDate').value ? moment() : this.passportForm.get('passportIssueDate').value;
    ctrlValue.month(normalizedMonth.month());
    this.passportForm.get('passportIssueDate').setValue(ctrlValue);
    datepicker.close();
  }


  // To get all cities
  cityAPI() {
    this.apiService.getAllCity().subscribe((data) => {
      this.appConfig.hideLoader();
      this.allCities = data;
      this.appConfig.setLocalData('allCities', JSON.stringify(this.allCities));
      this.allPermanentCities = data;

    }, (err) => {
    });
  }

  // To get all cities
  stateAPI() {
    this.apiService.getAllState().subscribe((data) => {
      const stateArr = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const datas = {
            name: data[key],
            state: data[key]
          };
          stateArr.push(datas);
        }
      }
      this.allStates = stateArr;
      this.appConfig.setLocalData('allStates', JSON.stringify(this.allStates));
      this.allPermanentStates = stateArr;

    }, (err) => {
    });
  }


  async onSelectFile(event) {
    if (event.target.files && event.target.files[0].type.includes('image/') && !event.target.files[0].type.includes('svg')) {
      this.showSizeError.size = false;
      if (event.target.files[0].size < 5000000) {
        this.showSizeError.image = false;
        this.selectedImage = event.target.files[0];

        const fd = new FormData();
        fd.append('file', this.selectedImage);
        const file = event.target.files[0];
        const reader = new FileReader();
        let urls;
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event: any) => { // called once readAsDataURL is completed
          urls = event.target.result;
          this.url = urls;
        };
      } else {
        this.showSizeError.size = true;
        this.url = null;
      }
    } else {
      this.showSizeError.image = true;
      this.url = null;
    }
  }

  public delete() {
    this.showSizeError.image = false;
    this.showSizeError.size = false;
    this.url = null;
  }

  validateAllForms() {
    this.validateAllFields(this.upToCategoryForm);
    this.validateAllFields(this.presentAddressForm);
    this.validateAllFields(this.permanentAddressForm);
    this.validateAllFields(this.languagesForm);
    this.validateAllFields(this.passportForm);
    this.validateAllFields(this.healthForm);
  }

  myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
  }
  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    if (formGroup['status'] === 'INVALID') {
      this.appConfig.setLocalData('personalFormSubmitted', 'false');
    }
    Object.keys(formGroup.controls).forEach(field => {

      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }


  // Form Getters

  // convenience getters for easy access to form fields
  get f() { return this.languagesForm.controls; }
  get t() { return this.f.languageAdd as FormArray; }
  get languageRequired() {
    return this.languagesForm.get('languageRequired');
  }
  get firstRead() {
    return this.languagesForm.get('firstRead');
  }
  get firstWrite() {
    return this.languagesForm.get('firstWrite');
  }
  get firstSpeak() {
    return this.languagesForm.get('firstSpeak');
  }

  get name() {
    return this.upToCategoryForm.get('name');
  }
  get mail() {
    return this.upToCategoryForm.get('mail');
  }
  get mobile() {
    return this.upToCategoryForm.get('mobile');
  }
  get gender() {
    return this.upToCategoryForm.get('gender');
  }
  get marital() {
    return this.upToCategoryForm.get('marital');
  }
  get dobDate() {
    return this.upToCategoryForm.get('dobDate');
  }
  get dobMonth() {
    return this.upToCategoryForm.get('dobMonth');
  }
  get dobYear() {
    return this.upToCategoryForm.get('dobYear');
  }
  get nationality() {
    return this.upToCategoryForm.get('nationality');
  }
  get categories() {
    return this.upToCategoryForm.get('category');
  }
  get presentAddress1() {
    return this.presentAddressForm.get('presentAddress1');
  }
  get presentAddress2() {
    return this.presentAddressForm.get('presentAddress2');
  }
  get presentZipCode() {
    return this.presentAddressForm.get('presentZipCode');
  }
  get presentCity() {
    return this.presentAddressForm.get('presentCity');
  }
  get presentState() {
    return this.presentAddressForm.get('presentState');
  }
  get permanentAddress1() {
    return this.permanentAddressForm.get('permanentAddress1');
  }
  get permanentAddress2() {
    return this.permanentAddressForm.get('permanentAddress2');
  }
  get permanentZipCode() {
    return this.permanentAddressForm.get('permanentZipCode');
  }
  get permanentCity() {
    return this.permanentAddressForm.get('permanentCity');
  }
  get permanentState() {
    return this.permanentAddressForm.get('permanentState');
  }

  get passportNumber() {
    return this.passportForm.get('passportNumber');
  }
  get passportName() {
    return this.passportForm.get('passportName');
  }
  get passportProfession() {
    return this.passportForm.get('passportProfession');
  }
  get passportIssueDate() {
    return this.passportForm.get('passportIssueDate');
  }
  get passportValid() {
    return this.passportForm.get('passportValid');
  }
  get passportIssuePlace() {
    return this.passportForm.get('passportIssuePlace');
  }
  get passportValidFor() {
    return this.passportForm.get('passportValidFor');
  }

  get illness() {
    return this.healthForm.get('illness');
  }
  get daysofIll() {
    return this.healthForm.get('daysofIll');
  }
  get natureofIll() {
    return this.healthForm.get('natureofIll');
  }
  get disability() {
    return this.healthForm.get('disability');
  }
  get height() {
    return this.healthForm.get('height');
  }
  get weight() {
    return this.healthForm.get('weight');
  }

  get healthControls() { return this.healthForm.controls; }
  get healthEyePowerGroup() { return this.healthControls.eyePower as FormGroup; }
  get left() {
    return this.healthEyePowerGroup.get('left');
  }
  get right() {
    return this.healthEyePowerGroup.get('right');
  }


  createItem(): FormGroup {
    return this.fb.group({
      language: '',
      read: '',
      write: '',
      speak: ''
    });
  }

  ngOnDestroy() {
    this.appConfig.clearLocalDataOne('personalFormTouched');
    console.log('destroyed');
  }
}
