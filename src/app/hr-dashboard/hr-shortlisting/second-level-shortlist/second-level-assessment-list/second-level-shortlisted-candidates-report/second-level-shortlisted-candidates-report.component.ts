import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-second-level-shortlisted-candidates-report',
  templateUrl: './second-level-shortlisted-candidates-report.component.html',
  styleUrls: ['./second-level-shortlisted-candidates-report.component.scss']
})
export class SecondLevelShortlistedCandidatesReportComponent implements OnInit, OnDestroy {
  BASE_URL = environment.API_BASE_URL;

  statusHeaderData: any;
  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  assessmentName: any;
  nameOfAssessment: any;
  selectedCandidates: any;
  cutOff: any;
  cutOff1: any;
  cutOff2: any;
  cutOff3: any;
  cutOff4: any;
  displayNoRecords = false;

  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef: any;
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';

  refreshSubscription: Subscription;
  shortlistedCandidatesReportSubscription: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.editRouteParamGetter();
  }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.shortlistedCandidatesReportSubscription ? this.shortlistedCandidatesReportSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTED_CANDIDATE_REPORT)) {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_LIST);
      }
    });
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.tabledef(params['data']);
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
    // event['data']
  }

  getModel(e) {
    setTimeout(() => {
      const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
      if (filteredArray && filteredArray.length === 0) {
        this.appConfig.warning('No search results found');
      }
    }, 500);
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning('No search results found');
      // this.toast.warning('No reuslts found');
    }
  }

  tabledef(apiData) {

    this.columnDefs = [
      {
        headerName: 'S no', field: 'sno',
        filter: 'agNumberColumnFilter',
        sortable: true,
        tooltipField: 'sno',
        filterParams: {
          buttons: ['reset'],
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate', field: 'name',
        filter: 'agTextColumnFilter',
        sortable: true,
        tooltipField: 'name',
        filterParams: {
          buttons: ['reset'],
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate id', field: 'candidate_id',
        filter: 'agTextColumnFilter',
        sortable: true,
        tooltipField: 'candidate_id',
        filterParams: {
          buttons: ['reset'],
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Gender', field: 'gender',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        sortable: true,
        tooltipField: 'gender',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date of birth', field: 'dob',
        filter: 'agDateColumnFilter',
        sortable: true,
        minWidth: 210,
        tooltipField: 'dob',
        comparator: dateComparator,
        filterParams: {
          buttons: ['apply', 'cancel', 'reset'],
          closeOnApply: true,
          // debounceMs: 500,
          comparator: (filterLocalDateAtMidnight, cellValue) => {
            return this.datecomparatorForAgGrid(filterLocalDateAtMidnight, cellValue, null);
        },
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute', field: 'institute',
        filter: 'agTextColumnFilter',
        sortable: true,
        tooltipField: 'institute',
        filterParams: {
          buttons: ['reset'],
        },
      getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Education level', field: 'level',
        filter: 'agSetColumnFilter',
        sortable: true,
        tooltipField: 'level',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Percentage', field: 'percentage',
        filter: 'agNumberColumnFilter',
        sortable: true,
        tooltipField: 'percentage',
        filterParams: {
          buttons: ['reset'],
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'No. of Backlogs', field: 'backlog',
        filter: 'agNumberColumnFilter',
        sortable: true,
        tooltipField: 'backlog',
        filterParams: {
          buttons: ['reset'],
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Year of passing', field: 'dateofpassing',
        filter: 'agTextColumnFilter',
        sortable: true,
        tooltipField: 'dateofpassing',
        minWidth: 210,
        filterParams: {
          buttons: ['reset']
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
    this.getUsersList(apiData);
  }

  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  getMonthFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;

    } else {
      return '-';
    }
  }
  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('MMM YYYY');
      const output = split;
      return output;

    } else {
      return '-';
    }

  }
  getDateFormat1(date) {
    if (date) {
      const split = moment(date).format('YYYY-MM-DD');
      const output = split.toUpperCase();
      return output;

    } else {
      return '-';
    }
  }

  // To get all users
  getUsersList(names) {
    const apiData = {
      shortlist_name: names,
      shortlist: '1'
    };
   this.shortlistedCandidatesReportSubscription = this.adminService.shortlistedCandidatesReport(apiData).subscribe((response: any) => {
      const align = [];
      let sno = 0;
      let notTaken = response['total_no_of_candidates'] - response['exams_taken'];
      this.statusHeaderData = {
        shortlist_name: response && response.shortlist_name ? response.shortlist_name : '-',
        shortlist_status: response && response.shortlist_status ? response.shortlist_status : '',
        total_no_of_candidates: response && response.total_no_of_candidates ? response.total_no_of_candidates : 0,
        available: response && response['exams_taken'] ? response['exams_taken'] - response.shortlisted_count : 0,
        shortlisted: response && response.shortlisted_count ? response.shortlisted_count : 0,
        notTaken: notTaken,
        }

      if (response && response.table_data && response.table_data.length > 0) {
        response.table_data.forEach((element, i) => {
          sno = sno + 1;
          const candidate_id = element && element['candidate_id'] ? element['candidate_id'] : '-';
          const name = element && element['name'] ? element['name'] : '-';
          const gender = element && element['field_gender'] ? element['field_gender'] : '-';
          const dob = element && element['field_dob'] ? this.getMonthFormat(element['field_dob']) : '-';
          let institute = '-';
          let level = '-';
          let percentage = '-';
          let backlog = '-';
          let dateofpassing = '-';
          const checked = false;
          if (element && element['education']) {
            institute = element['education'] && element['education']['field_institute'] ? element['education']['field_institute'] : '-';
            level = element['education'] && element['education']['field_level'] ? element['education']['field_level'] : '-';
            if (level === 'SSLC') {
              level = 'SSLC / 10th';
            }
            if (level === 'HSC') {
              level = 'HSC / 12th';
            }
            if (level === 'UG') {
              level = 'Undergraduate';
            }
            if (level === 'PG') {
              level = 'Postgraduate';
            }
            percentage = element['education'] && element['education']['field_percentage'] ? element['education']['field_percentage'] : '-';
            backlog = element['education'] && element['education']['field_backlogs'] ? element['education']['field_backlogs'] : 0;
            dateofpassing = element['education'] && element['education']['field_year_of_passing'] ? this.getDateFormat(element['education']['field_year_of_passing']) : '-';
          }
          align.push(
            {
              sno,
              candidate_id,
              name,
              gender,
              dob,
              institute,
              level,
              percentage,
              backlog,
              dateofpassing,
            }
          );
        });
      }
      this.userList = align ? align : [];
      this.selectedCandidates = this.userList.length;
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  downloadReport() {
    this.gridApi.exportDataAsExcel();
  }

  datecomparatorForAgGrid (filterLocalDateAtMidnight, cellValue, monthOnly) {
    const dateAsString = cellValue;
    if (dateAsString == null || dateAsString == '-') {
        return 0;
    }

    // In the example application, dates are stored as dd/mm/yyyy
    // We create a Date object for comparison against the filter date
    let convertedDate = this.checkMonth(dateAsString).toString();
    const dateParts = convertedDate.split('-');
    const day = monthOnly ? 28 : Number(dateParts[0]);
    const month = Number(dateParts[1]) - 1;
    const year = Number(dateParts[2]);
    const cellDate = new Date(year, month, day);

    // Now that both parameters are Date objects, we can compare
    if (cellDate < filterLocalDateAtMidnight) {
        return -1;
    } else if (cellDate > filterLocalDateAtMidnight) {
        return 1;
    }
    return 0;
}

  checkMonth(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
      const output = split.toUpperCase();
      return output;
    } else {
      return 0;
    }

  }

}

function dateComparator(date1, date2) {
  date1 = converttoDate(date1).toString();
  date2 = converttoDate(date2).toString();
  var date1Number = monthToComparableNumber(date1);
  var date2Number = monthToComparableNumber(date2);
  if (date1Number === null && date2Number === null) {
    return 0;
  }
  if (date1Number === null) {
    return -1;
  }
  if (date2Number === null) {
    return 1;
  }
  return date1Number - date2Number;
}
function monthToComparableNumber(date) {
  if (date === undefined || date === null || date.length !== 10) {
    return null;
  }
  var yearNumber = date.substring(6, 10);
  var monthNumber = date.substring(3, 5);
  var dayNumber = date.substring(0, 2);
  var result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
  return result;
}

function converttoDate(date) {
  if (date) {
    const split = moment(date).format('DD-MM-YYYY');
    const output = split.toUpperCase();
    return output;
  } else {
    return 0;
  }
}
