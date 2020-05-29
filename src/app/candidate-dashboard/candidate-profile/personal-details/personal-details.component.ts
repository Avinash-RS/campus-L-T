import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
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
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

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
export class PersonalDetailsComponent implements OnInit {

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
      name: 'OC',
      caste: 'oc'
    },
  ];
  categoryValue;

  date = [
    { date: '01' }, { date: '02' }, { date: '03' }, { date: '04' }, { date: '05' }, { date: '06' }, { date: '07' }, { date: '08' }, { date: '09' }, { date: '10' }, { date: '11' }, { date: '12' }, { date: '13' }, { date: '14' }, { date: '15' }, { date: '16' }, { date: '17' }, { date: '18' }, { date: '19' }, { date: '20' }, { date: '21' }, { date: '22' }, { date: '23' }, { date: '24' }, { date: '25' }, { date: '26' }, { date: '27' }, { date: '28' }, { date: '29' }, { date: '30' }, { date: '31' }
  ];
  month = [
    { month: '01' }, { month: '02' }, { month: '03' }, { month: '04' }, { month: '05' }, { month: '06' }, { month: '07' }, { month: '08' }, { month: '09' }, { month: '10' }, { month: '11' }, { month: '12' },
  ];
  year = [
    { year: '1985' }, { year: '1986' }, { year: '1987' }, { year: '1988' }, { year: '1989' }, { year: '1990' }, { year: '1991' }, { year: '1992' }, { year: '1993' }, { year: '1994' }, { year: '1995' }, { year: '1996' }, { year: '1997' }, { year: '1998' }, { year: '1999' }, { year: '2000' }, { year: '2001' }, { year: '2002' }
  ];
  dateValue: any;
  monthValue: any;
  yearValue: any;

  // Non-FormControl Fields
  validateOnSubmit = false;

  // State and City
  filteredCities: Observable<any[]>;
  filteredStates: Observable<any[]>;
  permanentfilteredCities: Observable<any[]>;
  permanentfilteredStates: Observable<any[]>;
  openDrop = false;
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

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date();
    this.passportValidminDate = new Date(currentYear - 20, 0, 1);
    this.passportValidmaxDate = new Date();
  }

  ngOnInit() {
    this.cityAPI();
    this.stateAPI();
    this.FormsInitialization();
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

  onSubmit() {
    /* Validate on submit properties
      dateValue: any;
      monthValue: any;
      yearValue: any;
      categoryValue: any;
    */
    if (this.upToCategoryForm.valid && this.presentAddressForm.valid && this.permanentAddressForm.valid
      && this.languagesForm.valid && this.passportForm.valid && this.healthForm.valid && this.dateValue && this.monthValue && this.yearValue && this.categoryValue && (this.languagesForm.value.firstRead || this.languagesForm.value.firstWrite || this.languagesForm.value.firstSpeak)) {
      console.log('passed');
      console.log(this.upToCategoryForm.value);
      console.log(this.presentAddressForm.value);
      console.log(this.permanentAddressForm.value);
      console.log(this.languagesForm.value);
      console.log(this.passportForm.value);
      console.log(this.healthForm.value);
      console.log(this.dateValue, this.monthValue, this.yearValue);
      console.log(this.categoryValue);


    } else {
      this.validateOnSubmit = true;
      this.validateAllFields(this.upToCategoryForm);
      this.validateAllFields(this.presentAddressForm);
      this.validateAllFields(this.permanentAddressForm);
      this.validateAllFields(this.languagesForm);
      this.validateAllFields(this.passportForm);
      this.validateAllFields(this.healthForm);
    }

  }

  autocomplete() {
    // tslint:disable-next-line: no-non-null-assertion
    this.filteredCities = this.presentAddressForm.get('presentCity')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this.city_filter(name, this.allCities) : this.allCities ? this.allCities.slice() : '')
    );

    // tslint:disable-next-line: no-non-null-assertion
    this.filteredStates = this.presentAddressForm.get('presentState')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this.state_filter(name, this.allStates) : this.allStates ? this.allStates.slice() : '')
    );

    // tslint:disable-next-line: no-non-null-assertion
    this.permanentfilteredCities = this.permanentAddressForm.get('permanentCity')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this.permanentcity_filter(name, this.allPermanentCities) : this.allPermanentCities ? this.allPermanentCities.slice() : '')
    );

    // tslint:disable-next-line: no-non-null-assertion
    this.permanentfilteredStates = this.permanentAddressForm.get('permanentState')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this.permanentstate_filter(name, this.allPermanentStates) : this.allPermanentStates ? this.allPermanentStates.slice() : '')
    );


  }

  selectedCode(code) {
    this.categoryValue = code;
  }

  selectedDate(date) {
    this.dateValue = date;
  }
  selectedMonth(month) {
    this.monthValue = month;
  }
  selectedYear(year) {
    this.yearValue = year;
  }


  profile(event: Event) {
    console.log(event.target);
  }


  // Forms Initialization
  FormsInitialization() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobileRegex: RegExp = /^[1-9][0-9]{9}$/;
    // Form 1 UptoCategory
    this.upToCategoryForm = this.fb.group({
      name: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.pattern(emailregex)]],
      mobile: ['', [Validators.required, Validators.pattern(mobileRegex)]],
      gender: ['', [Validators.required]],
      marital: ['', [Validators.required]],
      // dobDate: ['', [Validators.required]],
      // dobMonth: ['', [Validators.required]],
      // dobYear: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      // category: ['', [Validators.required]],
    });

    // Present Address Form
    this.presentAddressForm = this.fb.group({
      presentAddress1: ['', [Validators.required]],
      presentAddress2: [''],
      presentZipCode: ['', [Validators.required]],
      presentState: ['', [Validators.required]],
      presentCity: ['', [Validators.required]],
    });

    // Present Address Form
    this.permanentAddressForm = this.fb.group({
      permanentAddress1: ['', [Validators.required]],
      permanentAddress2: [''],
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
      languageAdd: this.fb.array([this.createItem()])
    });

    // Passport Form
    this.passportForm = this.fb.group({
      passportNumber: ['', [Validators.required]],
      passportName: ['', [Validators.required]],
      passportProfession: ['', [Validators.required]],
      passportIssueDate: ['', [Validators.required]],
      passportValid: ['', [Validators.required, FormCustomValidators.dateValidation()]],
      passportIssuePlace: ['', [Validators.required]],
      passportValidFor: ['', [Validators.required]],
    });

    // Health Form
    this.healthForm = this.fb.group({
      illness: ['', [Validators.required]],
      daysofIll: ['', [Validators.required]],
      natureofIll: ['', [Validators.required]],
      disability: ['', [Validators.required]],
      height: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      eyePower: this.fb.group({
        left: ['', [Validators.required]],
        right: ['', [Validators.required]],
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
  get nationality() {
    return this.upToCategoryForm.get('nationality');
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
      this.allPermanentCities = data;

      // Updating Form control validation
      this.presentAddressForm.controls['presentCity'].setValidators([Validators.required, FormCustomValidators.cityvalueSelected(this.allCities)]);
      this.presentAddressForm.controls['presentCity'].updateValueAndValidity();

      // Updating Form control validation
      this.permanentAddressForm.controls['permanentCity'].setValidators([Validators.required, FormCustomValidators.cityvalueSelected(this.allPermanentCities)]);
      this.permanentAddressForm.controls['permanentCity'].updateValueAndValidity();
      this.autocomplete();

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
      this.allPermanentStates = stateArr;

      // Updating Form control validation
      this.presentAddressForm.controls['presentState'].setValidators([Validators.required, FormCustomValidators.statevalueSelected(this.allStates)]);
      this.presentAddressForm.controls['presentState'].updateValueAndValidity();

      // Updating Form control validation
      this.permanentAddressForm.controls['permanentState'].setValidators([Validators.required, FormCustomValidators.statevalueSelected(this.allPermanentStates)]);
      this.permanentAddressForm.controls['permanentState'].updateValueAndValidity();

    }, (err) => {
    });
  }

  openDropdown(event, trigger: MatAutocompleteTrigger) {
    if (trigger.panelOpen) {
      event.stopPropagation();
      trigger.closePanel();
    } else {
      event.stopPropagation();
      trigger.openPanel();
    }
  }

  citydisplayFn(user): string {
    return user && user.City ? user.City : '';
  }
  statedisplayFn(user): string {
    return user && user.state ? user.state : '';
  }

  permanentcitydisplayFn(user): string {
    return user && user.City ? user.City : '';
  }
  permanentstatedisplayFn(user): string {
    return user && user.state ? user.state : '';
  }


  private city_filter(name: string, paramArrayFromAutoComplete): any[] {
    const filterValue = name.toLowerCase();

    return paramArrayFromAutoComplete.filter(option => option.City.toLowerCase().indexOf(filterValue) === 0);
  }
  private state_filter(name: string, paramArrayFromAutoComplete): any[] {
    const filterValue = name.toLowerCase();

    return paramArrayFromAutoComplete.filter(option => option.state.toLowerCase().indexOf(filterValue) === 0);
  }

  private permanentcity_filter(name: string, paramArrayFromAutoComplete): any[] {
    const filterValue = name.toLowerCase();

    return paramArrayFromAutoComplete.filter(option => option.City.toLowerCase().indexOf(filterValue) === 0);
  }
  private permanentstate_filter(name: string, paramArrayFromAutoComplete): any[] {
    const filterValue = name.toLowerCase();

    return paramArrayFromAutoComplete.filter(option => option.state.toLowerCase().indexOf(filterValue) === 0);
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
