import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { MatAutocompleteTrigger, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-apply-criteria',
  templateUrl: './apply-criteria.component.html',
  styleUrls: ['./apply-criteria.component.scss'],
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
export class ApplyCriteriaComponent implements OnInit {
  // Dates
  minDate: Date;
  maxDate: Date;
  dateFrom = new FormControl('');
  dateTo = new FormControl('');
  endDateValidation: boolean;
  dateValidation: boolean;
  dateFilterShow: boolean;
  dateFromShow;
  dateToShow;

  genderFilter: any[];
  genderFilterShow: boolean;
  disciplineFilter: any[];
  disciplineFilterShow: boolean;
  backlogFilter: any[];
  backlogFilterShow: boolean;

  eduFilter: any[];
  eduFilterShow: boolean;
  yearFrom = new FormControl('');
  yearTo = new FormControl('');
  endYearValidation: boolean;
  yearFromShow;
  yearToShow;
  percentageDecimals = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;

  radioCheck;
  EduLevel = DropdownListForKYC['level'];
  backlogs = DropdownListForKYC['backlogs'];
  genderList = DropdownListForKYC['gender'];
  disciplineList = DropdownListForKYC['discipline'];
  specializationList = DropdownListForKYC['specialization'];
  InstituteNameDropDown: any[];
  InstituteNameSearchControl = new FormControl();
  InstituteNameSelectAllCheck = false;
  InstituteNameFilter: any[];
  InstituteNameShowSelectAll = true;
  InstituteNameDropdownList = [];
  instituteFilterShow: boolean;
  showInstituteTotalCount: number;

  SpecializationNameDropDown: any[];
  SpecializationNameSearchControl = new FormControl();
  SpecializationNameSelectAllCheck = false;
  SpecializationNameFilter: any[];
  SpecializationNameShowSelectAll = true;
  SpecializationNameDropdownList = [];
  specializationFilterShow: boolean;
  showSpecializationTotalCount: number;
  innerHTMLInput: string;
  onlyForEDUFilterArray: any[];
  percentageRegexError: boolean;
  percentageRegexErrorIndex: any;
  percentageToRegexError: boolean;
  percentageToRegexErrorIndex: string;
  totalCandidates: any;
  filteredCandidates: number;

  // @ViewChild('perFromm', {static: false}) redel: ElementRef;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    // const currentYear = new Date().getFullYear();
    // this.minDate = new Date(currentYear - 20, 0, 1);
    // this.maxDate = new Date();
    this.getURLParam();
  }
  ngOnInit() {

    // For Gender
    this.genderNgOnInIt();

    // For Education
    this.EduNgOnInIt();

    // For Institute
    this.InstituteNameNgOnInIt();
    this.InstituteNameCustom();

    // For Discipline
    this.DisciplineNgOnInIt();

    // For Backlogs
    this.BacklogNgOnInIt();

    // For Specialization
    this.SpecializationNameNgOnInIt();
    this.SpecializationNameCustom();

    this.clearAllFilters();
  }

  getURLParam() {
    this.activatedRoute.queryParams.subscribe(params => {

      this.totalCandidates = params && params['data'] ? params['data'] : '';
      this.filteredCandidates = params && params['data'] ? 0 : 0;
      let localUID;
      // if (this.appConfig.getLocalData('shortListCheckedCandidates')) {
      //   localUID = JSON.parse(this.appConfig.getLocalData('shortListCheckedCandidates'));
      //   this.totalCandidates = localUID.length;
      //   this.filteredCandidates = localUID.length;
      // }
    });
  }

  // Clear All Filters
  clearAllFilters() {
    this.clearGenderFilter();
    this.clearDOBFilter();
    this.clearEDUFilter();
    this.clearInstituteFilter();
    this.clearDisciplineFilter();
    this.clearSpecializationFilter();
    this.clearBacklogFilter();
    this.submitFilterNoRedirect();
  }

  // Filter Submit
  submitFilterNoRedirect() {
    const genderAPIData = [];
    const instituteAPIData = [];
    const disciplineAPIData = [];
    const specializationAPIData = [];
    const backlogsAPIData = [];
    const educationData = [];
    let dobAPIData = [];
    let localUID = [];
    this.genderFilter.forEach((element) => {
      if (element.checkbox) {
        genderAPIData.push(element.name);
      }
    });

    this.InstituteNameFilter.forEach((element) => {
      if (element.checkbox) {
        instituteAPIData.push(element.name);
      }
    });

    this.disciplineFilter.forEach((element) => {
      if (element.checkbox) {
        disciplineAPIData.push(element.name);
      }
    });

    this.SpecializationNameFilter.forEach((element) => {
      if (element.checkbox) {
        specializationAPIData.push(element.name);
      }
    });

    this.backlogFilter.forEach((element) => {
      if (element.checkbox) {
        backlogsAPIData.push(element.name);
      }
    });

    if (this.onlyForEDUFilterArray) {
      if (!this.percentageRegexError && !this.percentageToRegexError) {
        this.onlyForEDUFilterArray.forEach(element => {
          if (element.checkbox) {
            const data = {
              educational_level: element['name'],
              percentage_from: element['percentageFrom'],
              percentage_to: element['percentageTo'],
              from: element['yearFrom'] && element['yearFrom']['_d'] ? this.getAPIDateFormat(element['yearFrom']['_d']) : '',
              to: element['yearTo'] && element['yearTo']['_d'] ? this.getAPIDateFormat(element['yearTo']['_d']) : '',
            };
            educationData.push(data);
          }
        });
      } else {
        this.eduFilter.forEach(element => {
          element['checkbox'] = false;
          element['radio'] = false;
        });
      }
    }


    dobAPIData = [{
      from_date: this.getAPIDateFormat(this.dateFromShow),
      to_date: this.getAPIDateFormat(this.dateToShow)
    }];

    // if (this.appConfig.getLocalData('shortListCheckedCandidates')) {
    //   localUID = JSON.parse(this.appConfig.getLocalData('shortListCheckedCandidates'));
    // }

    const apiDatas = {
      user_id: [],
      field_gender: genderAPIData,
      field_institute: instituteAPIData,
      field_discipline: disciplineAPIData,
      field_specification: specializationAPIData,
      field_backlogs: backlogsAPIData,
      field_dob: dobAPIData,
      educational_level: educationData,
      start: '1',
      counts: '50'
    };
    console.log(apiDatas);
    this.adminService.getCandidateListForShortlist(apiDatas).subscribe((data: any) => {
      this.appConfig.hideLoader();
      console.log(data);
      // const apiData = {
      //   user_id: []
      // };
      // if (data) {
      //   data.forEach(element => {
      //     if (element['uuid']) {
      //       apiData['user_id'].push(element['uuid']);
      //     }
      //   });
      // }
      // this.appConfig.setLocalData('shortListCheckedCandidates', JSON.stringify(apiData['user_id']));
      this.filteredCandidates = data[1] ? data[1] : '0';
      console.log('ada', this.filteredCandidates);


    }, (err) => {

    });
  }
  submitFilter() {
    const genderAPIData = [];
    const instituteAPIData = [];
    const disciplineAPIData = [];
    const specializationAPIData = [];
    const backlogsAPIData = [];
    const educationData = [];
    let dobAPIData = [];
    let localUID = [];
    this.genderFilter.forEach((element) => {
      if (element.checkbox) {
        genderAPIData.push(element.name);
      }
    });

    this.InstituteNameFilter.forEach((element) => {
      if (element.checkbox) {
        instituteAPIData.push(element.name);
      }
    });

    this.disciplineFilter.forEach((element) => {
      if (element.checkbox) {
        disciplineAPIData.push(element.name);
      }
    });

    this.SpecializationNameFilter.forEach((element) => {
      if (element.checkbox) {
        specializationAPIData.push(element.name);
      }
    });

    this.backlogFilter.forEach((element) => {
      if (element.checkbox) {
        backlogsAPIData.push(element.name);
      }
    });

    if (this.onlyForEDUFilterArray) {
      if (!this.percentageRegexError && !this.percentageToRegexError) {
        this.onlyForEDUFilterArray.forEach(element => {
          if (element.checkbox) {
            const data = {
              educational_level: element['name'],
              percentage_from: element['percentageFrom'],
              percentage_to: element['percentageTo'],
              from: element['yearFrom'] && element['yearFrom']['_d'] ? this.getAPIDateFormat(element['yearFrom']['_d']) : '',
              to: element['yearTo'] && element['yearTo']['_d'] ? this.getAPIDateFormat(element['yearTo']['_d']) : '',
            };
            educationData.push(data);
          }
        });
      } else {
        this.eduFilter.forEach(element => {
          element['checkbox'] = false;
          element['radio'] = false;
        });
      }
    }


    dobAPIData = [{
      from_date: this.getAPIDateFormat(this.dateFromShow),
      to_date: this.getAPIDateFormat(this.dateToShow)
    }];

    // if (this.appConfig.getLocalData('shortListCheckedCandidates')) {
    //   localUID = JSON.parse(this.appConfig.getLocalData('shortListCheckedCandidates'));
    // }

    const apiDatas = {
      user_id: [],
      field_gender: genderAPIData,
      field_institute: instituteAPIData,
      field_discipline: disciplineAPIData,
      field_specification: specializationAPIData,
      field_backlogs: backlogsAPIData,
      field_dob: dobAPIData,
      educational_level: educationData,
      start: '1',
      counts: '50'
    };
    const query = {
      user_id: [],
      field_gender: genderAPIData,
      field_institute: instituteAPIData,
      field_discipline: disciplineAPIData,
      field_specification: specializationAPIData,
      field_backlogs: backlogsAPIData,
      field_dob: dobAPIData,
      educational_level: educationData
    };
    console.log(apiDatas);
    this.adminService.getCandidateListForShortlist(apiDatas).subscribe((data: any) => {
      // this.appConfig.hideLoader();
      console.log(data);
      // const apiData = {
      //   user_id: []
      // };
      // if (data) {
      //   data.forEach(element => {
      //     if (element['uuid']) {
      //       apiData['user_id'].push(element['uuid']);
      //     }
      //   });
      // }
      this.appConfig.setLocalData('savedQuery', JSON.stringify(query));
      this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.FIRSTSHORTLISTING_LIST, { data: 'filtered' });

    }, (err) => {

    });
  }


  // Date

  preventDate(e, datepicker: MatDatepicker<Moment>) {
    datepicker.open();
    e.preventDefault();
    return false;
  }

  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;

    } else {
      this.dateFilterShow = false;
      return '';
    }
  }

  getAPIDateFormat(date) {
    if (date) {
      const split = moment(date).format('YYYY-MM-DD');
      const output = split;

      return output;

    } else {
      this.dateFilterShow = false;
      return '';
    }
  }


  // Apply Date Filter
  applyDateFilter() {
    // Change Date format to yyyy-mm-dd and date Validation
    if (!this.dateFrom.value && !this.dateTo.value) {
      this.dateFrom.setValue('');
      this.dateTo.setValue('');
      this.dateValidation = false;
      this.endDateValidation = false;
      this.dateFilterShow = false;
    } else {
      if ((this.dateFrom.value && !this.dateTo.value) || (!this.dateFrom.value && this.dateTo.value)) {
        this.endDateValidation = false;
        this.dateValidation = true;
      } else {
        this.dateValidation = false;
        const momentDate = new Date(this.dateFrom.value);
        const startDate = moment(momentDate).format('YYYY-MM-DD');
        const momentDate1 = new Date(this.dateTo.value);
        const endDate = moment(momentDate1).format('YYYY-MM-DD');
        if (momentDate.getTime() > momentDate1.getTime()) {
          this.endDateValidation = true;
        } else {
          this.dateFromShow = this.getDateFormat(this.dateFrom.value);
          this.dateToShow = this.getDateFormat(this.dateTo.value);
          this.dateFilterShow = true;
          this.endDateValidation = false;
        }
      }
    }
  }

  clearDOBFilter() {
    this.dateFrom.setValue('');
    this.dateTo.setValue('');
    this.dateFromShow = '';
    this.dateToShow = '';
    this.dateFilterShow = false;
  }

  // For Education Level
  EduNgOnInIt() {

    this.eduFilter = this.EduLevel;
    let runGenderElse = true;
    this.eduFilter.forEach(element => {
      if (element.checkbox) {
        runGenderElse = false;
        this.eduFilterShow = true;
      } else {
        if (runGenderElse) {
          this.eduFilterShow = false;
        }
      }
    });
  }

  selectedEducationRadio(eduLevel, event) {
    console.log(eduLevel, event);
    this.EduLevel.forEach(element => {
      if (element['name'] === eduLevel['name']) {
        if (element.radio) {
          this.yearFrom.setValue('');
          this.yearTo.setValue('');
          element['yearFrom'] = '';
          element['yearTo'] = '';
          element.radio = false;
        } else {
          element.radio = true;
        }
      } else {
        this.yearFrom.setValue('');
        this.yearTo.setValue('');
        element.radio = false;
      }
    });
  }

  eduCheckboxChange(selectedCheckboxDetails) {
    let runGenderElse = true;
    this.eduFilter.forEach((element, i) => {
      if (element.checkbox) {
        runGenderElse = false;
        // this.eduFilterShow = true;
        return false;
      } else {
        if (this.percentageRegexErrorIndex || this.percentageToRegexErrorIndex) {
          this.percentageRegexError = false;
          this.percentageToRegexError = false;
        }
        element['radio'] = false;
        element['percentageFrom'] = '';
        element['percentageTo'] = '';
        element['yearFrom'] = '';
        element['yearTo'] = '';
        if (runGenderElse) {
          // this.eduFilterShow = false;
        }
      }
    });
  }

  EduFilterBoxChanged(dup) {
    this.eduFilter.forEach(element => {
      this.onlyForEDUFilterArray.forEach(ele => {
        if (element['name'] === dup['name']) {
          element['radio'] = false;
          element['checkbox'] = false;
          element['percentageFrom'] = '';
          element['percentageTo'] = '';
          element['yearFrom'] = '';
          element['yearTo'] = '';
          if (this.radioCheck == dup['name']) {
            this.radioCheck = false;
          }

        }
        if (ele['name'] === dup['name']) {
          if (this.radioCheck == dup['name']) {
            this.radioCheck = false;
          }
          ele['radio'] = false;
          ele['checkbox'] = false;
        }
      });
    });
    console.log(this.eduFilter);
    console.log(this.onlyForEDUFilterArray);

    this.toShowOrNotEducationFilter();
  }

  applyEduYearFilter() {
    this.eduFilter.forEach(element => {
      element['yearFrom'] = '';
      element['yearTo'] = '';
    });
    if (this.yearFrom.value && this.yearTo.value) {
      this.endYearValidation = false;
      const momentDate = new Date(this.yearFrom.value);
      const startDate = moment(momentDate).format('YYYY-MM-DD');
      const momentDate1 = new Date(this.yearTo.value);
      const endDate = moment(momentDate1).format('YYYY-MM-DD');
      if (momentDate.getTime() > momentDate1.getTime()) {
        this.endYearValidation = true;
      } else {
        this.percentageRegexError = false;
        this.percentageToRegexError = false;
        this.eduFilter.forEach((element, i) => {
          if (element['checkbox']) {
            console.log(typeof document.getElementById(`yearFrom${i}`)['value']);
            if (document.getElementById(`yearFrom${i}`)['value']) {
              this.yearFromShow = this.getDateFormat(this.yearFrom.value);
              element['yearFrom'] = this.yearFrom.value;
            }
            if (document.getElementById(`yearTo${i}`)['value']) {
              element['yearTo'] = this.yearTo.value;
              this.yearToShow = this.getDateFormat(this.yearTo.value);
            }

            if (document.getElementById(`perFrom${i}`)['value']) {
              const percentageRegex = this.percentageDecimals.test(document.getElementById(`perFrom${i}`)['value']);
              console.log(percentageRegex);

              if (percentageRegex === false) {
                this.percentageRegexError = true;
                this.percentageRegexErrorIndex = i.toString();
              } else {
                element['percentageFrom'] = document.getElementById(`perFrom${i}`)['value'];
                element['percentageTo'] = document.getElementById(`perTo${i}`)['value'];
              }
            }
            if (document.getElementById(`perTo${i}`)['value']) {
              const percentageToRegex = this.percentageDecimals.test(document.getElementById(`perTo${i}`)['value']);
              console.log(percentageToRegex);
              if (percentageToRegex === false) {
                this.percentageToRegexError = true;
                this.percentageToRegexErrorIndex = i.toString();
              } else {
                element['percentageFrom'] = document.getElementById(`perFrom${i}`)['value'];
                element['percentageTo'] = document.getElementById(`perTo${i}`)['value'];
              }
            }
          }
        });

        if (!this.percentageRegexError || !this.percentageToRegexError) {
          this.onlyForEDUFilterArray = this.eduFilter;
          this.toShowOrNotEducationFilter();
        }
      }
    } else {
      this.percentageRegexError = false;
      this.percentageToRegexError = false;
      this.eduFilter.forEach((element, i) => {
        if (element['checkbox']) {
          console.log(typeof document.getElementById(`yearFrom${i}`)['value']);
          if (document.getElementById(`yearFrom${i}`)['value']) {
            this.yearFromShow = this.getDateFormat(this.yearFrom.value);
            element['yearFrom'] = this.yearFrom.value;
          }
          if (document.getElementById(`yearTo${i}`)['value']) {
            element['yearTo'] = this.yearTo.value;
            this.yearToShow = this.getDateFormat(this.yearTo.value);
          }

          if (document.getElementById(`perFrom${i}`)['value']) {
            const percentageRegex = this.percentageDecimals.test(document.getElementById(`perFrom${i}`)['value']);
            console.log(percentageRegex);

            if (percentageRegex === false) {
              this.percentageRegexError = true;
              this.percentageRegexErrorIndex = i.toString();
            } else {
              element['percentageFrom'] = document.getElementById(`perFrom${i}`)['value'];
              element['percentageTo'] = document.getElementById(`perTo${i}`)['value'];
            }
          }
          if (document.getElementById(`perTo${i}`)['value']) {
            const percentageToRegex = this.percentageDecimals.test(document.getElementById(`perTo${i}`)['value']);
            console.log(percentageToRegex);
            if (percentageToRegex === false) {
              this.percentageToRegexError = true;
              this.percentageToRegexErrorIndex = i.toString();
            } else {
              element['percentageFrom'] = document.getElementById(`perFrom${i}`)['value'];
              element['percentageTo'] = document.getElementById(`perTo${i}`)['value'];
            }
          }
        }
      });

      if (!this.percentageRegexError || !this.percentageToRegexError) {
        this.onlyForEDUFilterArray = this.eduFilter;
        this.toShowOrNotEducationFilter();
      }
    }
    console.log(this.onlyForEDUFilterArray);

  }

  toShowOrNotEducationFilter(event?) {
    let runGenderElse = true;
    this.eduFilter.forEach(element => {
      if (element.checkbox) {
        runGenderElse = false;
        this.eduFilterShow = true;
        return false;
      } else {
        if (runGenderElse) {
          this.eduFilterShow = false;
        }
      }
    });

    if (this.onlyForEDUFilterArray) {
      this.onlyForEDUFilterArray.forEach(element => {
        if (element.checkbox) {
          runGenderElse = false;
          this.eduFilterShow = true;
          return false;
        } else {
          if (runGenderElse) {
            this.eduFilterShow = false;
          }
        }
      });
    }
  }


  clearEDUFilter() {
    if (this.onlyForEDUFilterArray) {
      this.onlyForEDUFilterArray.forEach(element => {
        if (element['name']) {
          element.checkbox = false;
          element.radio = false;
        }
      });
    }
    this.eduFilter.forEach(element => {
      if (element['name']) {
        element.checkbox = false;
        element['percentageFrom'] = '';
        element['percentageTo'] = '';
        element['yearFrom'] = '';
        element['yearTo'] = '';
        element.radio = false;
      }
    });

    this.toShowOrNotEducationFilter();

  }

  // For Gender
  genderNgOnInIt() {
    this.genderFilter = this.genderList;
    let runGenderElse = true;
    this.genderFilter.forEach(element => {
      if (element.checkbox) {
        runGenderElse = false;
        this.genderFilterShow = true;
      } else {
        if (runGenderElse) {
          this.genderFilterShow = false;
        }
      }
    });
  }

  GendercheckboxChanged(genderName) {

    this.genderList.forEach(element => {
      if (element['name'] === genderName['name']) {
        element.checkbox = !element.checkbox;
      }
    });

    this.toShowOrNotGenderFilter();
  }

  toShowOrNotGenderFilter(event?) {
    let runGenderElse = true;
    this.genderFilter.forEach(element => {
      if (element.checkbox) {
        runGenderElse = false;
        this.genderFilterShow = true;
        return false;
      } else {
        if (runGenderElse) {
          this.genderFilterShow = false;
        }
      }
    });
  }

  clearGenderFilter() {
    this.genderList.forEach(element => {
      if (element['name']) {
        element.checkbox = false;
      }
    });
    this.toShowOrNotGenderFilter();
  }

  // For Institute
  InstituteNameNgOnInIt() {
    // const api = {
    //   level: 'PG',
    //   discipline: '',
    //   specification: ''
    // };
    // this.candidateService.getDiplomaList(api).subscribe((data: any) => {
    //   this.appConfig.hideLoader();
    //   const list = data && data[0] ? data[0] : [];
    //   this.InstituteNameDropdownList = list;
    //   // this.InstituteNameDropdownList.forEach(element => {

    //   // });
    //   console.log('eduFIlter', this.eduFilter);

    // }, (err) => {

    // });

    this.InstituteNameDropdownList = DropdownListForKYC['institutes'];
    this.InstituteNameDropDown = this.InstituteNameDropdownList;
    this.InstituteNameFilter = this.InstituteNameDropDown;
    this.toShowOrNotInstituteFilter();
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
  }

  InstituteNameSearch(value: string) {
    this.InstituteNameDropDown = this.InstituteNameDropdownList.filter(
      option => option['name'].toLowerCase().includes(value.toLowerCase())
    );
  }


  InstituteNameCustom() {
    this.InstituteNameSearchControl.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe((term) => {
        if (term.length > 0) {
          this.InstituteNameShowSelectAll = false;
        } else {
          this.InstituteNameShowSelectAll = true;
        }

        this.InstituteNameSearch(term);
      });
  }

  InstituteNameCheckboxChanged(selectedins) {
    this.InstituteNameSearchControl.patchValue('');
    setTimeout(() => {
      if (this.InstituteNameSearchControl.value === '') {
        this.InstituteNameDropDown.forEach((data) => {
          // if (data.item_id === selectedins.item_id) {
          if (data.name === selectedins.name) {
            data.checkbox = !data.checkbox;
          }
        });
      }
      this.toShowOrNotInstituteFilter();
    }, 500);
  }

  toShowOrNotInstituteFilter(event?) {
    let runGenderElse = true;
    const showInstituteCount = [];
    this.InstituteNameFilter.forEach(element => {
      if (element.checkbox) {
        showInstituteCount.push(element);
        runGenderElse = false;
        this.instituteFilterShow = true;
        return false;
      } else {
        if (runGenderElse) {
          this.instituteFilterShow = false;
        }
      }
    });
    this.showInstituteTotalCount = showInstituteCount.length;
  }

  InstituteNameSelectAll(event) {
    this.InstituteNameDropDown.forEach((data) => {
      if (event.target.checked === true) {
        data.checkbox = true;
      }
      if (event.target.checked === false) {
        data.checkbox = false;
      }
    });
    this.toShowOrNotInstituteFilter();
    // this.InstituteNameDropDown = this.InstituteNameFilter;
  }

  clearInstituteFilter() {
    this.InstituteNameDropDown.forEach(element => {
      if (element['name']) {
        element.checkbox = false;
      }
    });
    this.toShowOrNotInstituteFilter();
  }

  // For Discpline
  DisciplineNgOnInIt() {
    this.disciplineFilter = this.disciplineList;

    this.toShowOrNotDisciplineFilter();
  }

  DisciplinecheckboxChanged(disciplineName) {

    this.disciplineList.forEach(element => {
      if (element['name'] === disciplineName['name']) {
        element.checkbox = !element.checkbox;
      }
    });

    this.toShowOrNotDisciplineFilter();
  }

  toShowOrNotDisciplineFilter(event?) {
    let runGenderElse = true;
    this.disciplineFilter.forEach(element => {
      if (element.checkbox) {
        runGenderElse = false;
        this.disciplineFilterShow = true;
        return false;
      } else {
        if (runGenderElse) {
          this.disciplineFilterShow = false;
        }
      }
    });
  }

  clearDisciplineFilter() {
    this.disciplineList.forEach(element => {
      if (element['name']) {
        element.checkbox = false;
      }
    });
    this.toShowOrNotDisciplineFilter();
  }


  // backlogs
  BacklogNgOnInIt() {
    this.backlogFilter = this.backlogs;

    this.toShowOrNotBacklogFilter();
  }

  BacklogcheckboxChanged(backlogName) {

    this.backlogs.forEach(element => {
      if (element['name'] === backlogName['name']) {
        element.checkbox = !element.checkbox;
      }
    });

    this.toShowOrNotBacklogFilter();
  }

  toShowOrNotBacklogFilter(event?) {
    let runGenderElse = true;
    this.backlogFilter.forEach(element => {
      if (element.checkbox) {
        runGenderElse = false;
        this.backlogFilterShow = true;
        return false;
      } else {
        if (runGenderElse) {
          this.backlogFilterShow = false;
        }
      }
    });
  }

  clearBacklogFilter() {
    this.backlogs.forEach(element => {
      if (element['name']) {
        element.checkbox = false;
      }
    });
    this.toShowOrNotBacklogFilter();
  }

  // For Specialization
  SpecializationNameNgOnInIt() {
    this.SpecializationNameDropdownList = this.specializationList;
    this.SpecializationNameDropDown = this.SpecializationNameDropdownList;
    this.SpecializationNameFilter = this.SpecializationNameDropDown;
    this.toShowOrNotSpecializationFilter();
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
  }

  SpecializationNameSearch(value: string) {
    this.SpecializationNameDropDown = this.SpecializationNameDropdownList.filter(
      option => option['name'].toLowerCase().includes(value.toLowerCase())
    );
  }


  SpecializationNameCustom() {
    this.SpecializationNameSearchControl.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe((term) => {
        if (term.length > 0) {
          this.SpecializationNameShowSelectAll = false;
        } else {
          this.SpecializationNameShowSelectAll = true;
        }

        this.SpecializationNameSearch(term);
      });
  }

  SpecializationNameCheckboxChanged(selectedins) {
    this.SpecializationNameSearchControl.patchValue('');
    setTimeout(() => {
      if (this.SpecializationNameSearchControl.value === '') {
        this.SpecializationNameDropDown.forEach((data) => {
          // if (data.item_id === selectedins.item_id) {
          if (data.name === selectedins.name) {
            data.checkbox = !data.checkbox;
          }
        });
      }
      this.toShowOrNotSpecializationFilter();
    }, 500);
  }

  toShowOrNotSpecializationFilter(event?) {
    let runGenderElse = true;
    const showSpecializationCount = [];
    this.SpecializationNameFilter.forEach(element => {
      if (element.checkbox) {
        showSpecializationCount.push(element);
        runGenderElse = false;
        this.specializationFilterShow = true;
        return false;
      } else {
        if (runGenderElse) {
          this.specializationFilterShow = false;
        }
      }
    });
    this.showSpecializationTotalCount = showSpecializationCount.length;
  }

  SpecializationNameSelectAll(event) {
    this.SpecializationNameDropDown.forEach((data) => {
      if (event.target.checked === true) {
        data.checkbox = true;
      }
      if (event.target.checked === false) {
        data.checkbox = false;
      }
    });
    this.toShowOrNotSpecializationFilter();
    // this.InstituteNameDropDown = this.InstituteNameFilter;
  }

  clearSpecializationFilter() {
    this.SpecializationNameDropDown.forEach(element => {
      if (element['name']) {
        element.checkbox = false;
      }
    });
    this.toShowOrNotSpecializationFilter();
  }


}
