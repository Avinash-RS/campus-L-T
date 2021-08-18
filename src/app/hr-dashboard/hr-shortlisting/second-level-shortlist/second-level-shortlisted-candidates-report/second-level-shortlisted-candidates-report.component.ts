import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-second-level-shortlisted-candidates-report',
  templateUrl: './second-level-shortlisted-candidates-report.component.html',
  styleUrls: ['./second-level-shortlisted-candidates-report.component.scss']
})
export class SecondLevelShortlistedCandidatesReportComponent implements OnInit {
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
  defaultColDef = {
    flex: 1,
    minWidth: 40,
    resizable: true,
    floatingFilter: true,
    lockPosition: true,
    suppressMenu: true,
    unSortIcon: true,
  };
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.assessmentDetails(params['data']);
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
    // console.log(e);

    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning('No search results found');
    }
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
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 140,
        sortable: true,
        tooltipField: 'sno',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate', field: 'name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 140,
        sortable: true,
        tooltipField: 'name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate id', field: 'candidate_id',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Gender', field: 'gender',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 140,
        sortable: true,
        tooltipField: 'gender',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date of birth', field: 'dob',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 100,
        sortable: true,
        tooltipField: 'dob',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute', field: 'institute',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 140,
        sortable: true,
        tooltipField: 'institute',
      getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Education level', field: 'level',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 140,
        sortable: true,
        tooltipField: 'level',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Percentage', field: 'percentage',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 140,
        sortable: true,
        tooltipField: 'percentage',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Backlog', field: 'backlog',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 140,
        sortable: true,
        tooltipField: 'backlog',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date of passing', field: 'dateofpassing',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        // minWidth: 140,
        sortable: true,
        tooltipField: 'dateofpassing',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
    this.getUsersList(apiData);
  }

  assessmentDetails(name) {
    const apidata = {
      shortlist_name: name
    };
    this.adminService.assessmentDetailsOfSecond(apidata).subscribe((data: any) => {
      let response = data && data[0] ? data[0] : '';
      this.statusHeaderData = {
        shortlist_name: response && response.shortlist_name ? response.shortlist_name : '',
        shortlist_status: response && response.status ? response.status : '',
        total_no_of_candidates: response && response.no_of_candidate ? response.no_of_candidate : 0,
        selectedCandidates: response && response.no_of_candidate ? response.no_of_candidate : 0,
      }
    }, (err) => {

    });
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
    this.adminService.shortlistedCandidatesReport(apiData).subscribe((datas: any) => {
      const align = [];
      let sno = 0;
      datas.forEach((element, i) => {
        if (element && i == '0') {
          this.cutOff = element && element['domain_percentage_shortlist'] ? element['domain_percentage_shortlist'] : '-';
          this.cutOff1 = element && element['verbal_percentage_shortlist'] ? element['verbal_percentage_shortlist'] : '-';
          this.cutOff2 = element && element['analytical_percentage_shortlist'] ? element['analytical_percentage_shortlist'] : '-';
          this.cutOff3 = element && element['quantitative_percentage_shortlist'] ? element['quantitative_percentage_shortlist'] : '-';
          this.cutOff4 = element && element['marks_valid_shortlist'] ? element['marks_valid_shortlist'] : '-';
        }
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
          backlog = element['education'] && element['education']['field_backlogs'] ? element['education']['field_backlogs'] : '-';
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
      this.userList = align ? align : [];
      this.selectedCandidates = this.userList.length;
      this.rowData = this.userList;

    }, (err) => {
    });
  }

  downloadReport() {
    const excel = `${this.BASE_URL}/sites/default/files/upload_excel_error/secondlevel.csv`;
    window.open(excel, '_blank');
  }

}

