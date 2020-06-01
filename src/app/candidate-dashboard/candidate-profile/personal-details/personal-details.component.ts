import { Component, OnInit, ViewChild } from '@angular/core';
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
export class PersonalDetailsComponent extends FormCanDeactivate implements OnInit {

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

  onSubmit(OptA, OptB, OptC, OptD, OptE, OptF) {
    if (this.upToCategoryForm.valid && this.presentAddressForm.valid && this.permanentAddressForm.valid
      && this.languagesForm.valid && this.passportForm.valid && this.healthForm.valid && (this.languagesForm.value.firstRead || this.languagesForm.value.firstWrite || this.languagesForm.value.firstSpeak)) {
      console.log('passed');
      console.log(this.upToCategoryForm.value);
      console.log(this.presentAddressForm.value);
      console.log(this.permanentAddressForm.value);
      console.log(this.languagesForm.value);
      console.log(this.passportForm.value);
      console.log(this.healthForm.value);
      const apiData = {
        type: 'candidate',

        uid: [
          {
            target_id: this.appConfig.getLocalData('userId')
          }
        ],
        field_name: { value: this.upToCategoryForm.value.name ? this.upToCategoryForm.value.name : '' },
        field_email: { value: this.upToCategoryForm.value.mail ? this.upToCategoryForm.value.mail : '' },
        field_mobile: { value: this.upToCategoryForm.value.mobile ? this.upToCategoryForm.value.mobile : '' },
        field_gender: { value: this.upToCategoryForm.value.gender ? this.upToCategoryForm.value.gender : '' },
        field_mariatal_status: { value: this.upToCategoryForm.value.marital ? this.upToCategoryForm.value.marital : '' },
        field_dob: { value: moment(`${this.upToCategoryForm.value.dobYear}-${this.upToCategoryForm.value.dobMonth}-${this.upToCategoryForm.value.dobDate}`).format() },
        field_nationality: { value: this.upToCategoryForm.value.nationality ? this.upToCategoryForm.value.nationality : '' },
        field_category: { value: this.upToCategoryForm.value.category ? this.upToCategoryForm.value.category : '' },
        field_present_line_street_addres: { value: this.presentAddressForm.value.presentAddress1 ? this.presentAddressForm.value.presentAddress1 : '' },
        field_present_line2_street_addre: { value: this.presentAddressForm.value.presentAddress2 ? this.presentAddressForm.value.presentAddress2 : '' },
        field_present_zip: { value: this.presentAddressForm.value.presentZipCode ? this.presentAddressForm.value.presentZipCode : '' },
        field_preset_city: { value: this.presentAddressForm.value.presentCity ? this.presentAddressForm.value.presentCity : '' },
        field_present_state: { value: this.presentAddressForm.value.presentState ? this.presentAddressForm.value.presentState : '' },
        field_permanent_line1_street_add: { value: this.permanentAddressForm.value.permanentAddress1 ? this.permanentAddressForm.value.permanentAddress1 : '' },
        field_permanent_line2_street_add: { value: this.permanentAddressForm.value.permanentAddress2 ? this.permanentAddressForm.value.permanentAddress2 : '' },
        field_permanent_zip: { value: this.permanentAddressForm.value.permanentZipCode ? this.permanentAddressForm.value.permanentZipCode : '' },
        field_permanent_city: { value: this.permanentAddressForm.value.permanentCity ? this.permanentAddressForm.value.permanentCity : '' },
        field_permanent_state: { value: this.permanentAddressForm.value.permanentState ? this.permanentAddressForm.value.permanentState : '' },
        field_language_known: { value: this.languagesForm.value.languageRequired ? this.languagesForm.value.languageRequired : '' },

        field_read: [{ value: this.languagesForm.value.firstRead ? '1' : '0' }],
        field_write: [{ value: this.languagesForm.value.firstWrite ? '1' : '0' }],
        field_speak: [{ value: this.languagesForm.value.firstSpeak ? '1' : '0' }],

        field_passport_number: { value: this.passportForm.value.passportNumber ? this.passportForm.value.passportNumber : '' },
        field_name_as_in_passport: { value: this.passportForm.value.passportName ? this.passportForm.value.passportName : '' },
        field_profesiona_as_passport: { value: this.passportForm.value.passportProfession ? this.passportForm.value.passportProfession : '' },
        field_date_of_issue: { value: this.passportForm.value.passportIssueDate['_d'] ? moment(this.passportForm.value.passportIssueDate['_d']).format() : '' },
        field_valid_upto: { value: this.passportForm.value.passportValid['_d'] ? moment(this.passportForm.value.passportValid['_d']).format() : '' },
        field_place_of_issue: { value: this.passportForm.value.passportIssuePlace ? this.passportForm.value.passportIssuePlace : '' },
        field_country_valid_for: { value: this.passportForm.value.passportValidFor ? this.passportForm.value.passportValidFor : '' },
        field_serious_illness: { value: this.passportForm.value.passportValidFor ? this.passportForm.value.passportValidFor : '' },
        field_no_of_days: { value: this.healthForm.value.daysofIll ? this.healthForm.value.daysofIll : '' },
        field_nature_of_illness: { value: this.healthForm.value.natureofIll ? this.healthForm.value.natureofIll : '' },
        field_physical_disability: { value: this.healthForm.value.disability ? this.healthForm.value.disability : '' },
        field_height: { value: this.healthForm.value.height ? this.healthForm.value.height : '' },
        field_weight: { value: this.healthForm.value.weight ? this.healthForm.value.weight : '' },
        field_right_eye_power_glass: { value: this.healthForm.value.eyePower.right ? this.healthForm.value.eyePower.right : '' },
        field_left_eyepower_glass: { value: this.healthForm.value.eyePower.left ? this.healthForm.value.eyePower.left : '' },
        is_default: [{
          value: '1'
        }]
      };
      console.log('Request', apiData);

      this.candidateService.editUser(apiData).subscribe((data: any) => {
        console.log('success', data);
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_EDUCATIONAL_DETAILS);
        this.appConfig.nzNotification('success', 'Submitted', 'Personal details has been updated');
        // this.appConfig.success('Personal Details updated successfully', '');
        this.appConfig.hideLoader();

      });
    } else {
      setTimeout(() => {
        window.scroll(0, 0);
      }, 10);
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
      console.log(this.upToCategoryForm.value);
      console.log(this.presentAddressForm.value);
      console.log(this.permanentAddressForm.value);
      console.log(this.languagesForm.value);
      console.log(this.passportForm.value);
      console.log(this.healthForm.value);

      this.validateOnSubmit = true;
      this.validateAllFields(this.upToCategoryForm);
      this.validateAllFields(this.presentAddressForm);
      this.validateAllFields(this.permanentAddressForm);
      this.validateAllFields(this.languagesForm);
      this.validateAllFields(this.passportForm);
      this.validateAllFields(this.healthForm);
    }

  }
  upToCategoryFormPatchvalues() {
    this.upToCategoryForm.patchValue({
      name: this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : '',
    });

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
    });

    // Present Address Form
    this.permanentAddressForm = this.fb.group({
      permanentAddress1: ['', [Validators.required]],
      permanentAddress2: ['', [Validators.required]],
      permanentZipCode: ['', [Validators.required]],
      permanentState: ['', [Validators.required]],
      permanentCity: ['', [Validators.required]],
    });


    // Language Form
    this.languagesForm = this.fb.group({
      languageRequired: ['', [Validators.required]],
      firstRead: [''],
      firstWrite: [''],
      firstSpeak: [''],
      languageAdd: this.fb.array([])
    });

    // Passport Form
    this.passportForm = this.fb.group({
      passportNumber: ['', [Validators.required, Validators.pattern(numberOnly)]],
      passportName: [''],
      passportProfession: [''],
      passportIssueDate: [''],
      // passportValid: ['', [Validators.required, FormCustomValidators.dateValidation()]],
      passportValid: [''],
      passportIssuePlace: [''],
      passportValidFor: [''],
    });

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

  removeLanguage(i) {
    this.t.removeAt(i);
  }

  addLanguage() {
    this.t.push(this.createItem());
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
        let reader = new FileReader();
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


  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }


}
