import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog, MatExpansionPanel, MatAccordion } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-assigned-details',
  templateUrl: './assigned-details.component.html',
  styleUrls: ['./assigned-details.component.scss']
})
export class AssignedDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatExpansionPanel, {static: false}) pannel?: MatExpansionPanel;
  @ViewChild(MatAccordion, {static: false}) accordion?: MatAccordion;

  selectedInstitute: any;
  selectedEdu: any;
  selectedStatus: any = '1';
  allInstitutes: any = [];
  allDisciplines: any = [];
  allShortlistNames: any = [];
  EduLevel = DropdownListForKYC['level'];
  allEducations: any;
  allAssessments: any;
  routedData: any;
  statusList = [
    // {
    //   name: 'All',
    //   value: 'all'
    // },
    // {
    //   name: 'Unassigned',
    //   value: '0'
    // },
    {
      name: 'Assigned',
      value: '1'
    }
  ];

  paginationPageSize = 1000;
  cacheBlockSize: any = 1000;
  gridApi: any;
  gridApi1: any;
  columnDefs = [];
  columnDefs1 = [];
  defaultColDef :any;
  rowData: any;
  searchBox = false;
  filterValue: string;
  reportDetails1: any;
  rowData1: any;
  // quickSearchValue: string;
  quickSearchValue = '';
  quickSearchValue1 = '';
  panelOpenState1 = true;
  selectedShortlistname: any;
  refreshSubscription: Subscription;
  getInsituteSubscription: Subscription;
  getShortlistNameSubscription: Subscription;
  getAlreadyAssignedSubscription: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '002-cv.svg',
        name: 'Panel Assignment',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT
      },
      {
        icon: '002-cv.svg',
        name: 'Assigned Details',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED
      },
      {
        icon: '002-group-1.svg',
        name: 'Bulk Assign',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_RESULTS_UPLOAD
      }

      ];
      this.sharedService.subMenuSubject.next(subWrapperMenus);

    this.editRouteParamGetter();
   }

  ngOnInit() {
    this.getShortlistNames();
    this.getInstitute();
    this.getEducation();
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.refreshOndriveChangeRXJS();
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.ASSIGNED_DETAILS)) {
        this.clearAllDatas();
        this.getShortlistNames();
        this.getInstitute();
        this.go();
        this.tabledef();
      }
    });
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.getInsituteSubscription ? this.getInsituteSubscription.unsubscribe() : '';
    this.getShortlistNameSubscription ? this.getShortlistNameSubscription.unsubscribe() : '';
    this.getAlreadyAssignedSubscription ? this.getAlreadyAssignedSubscription.unsubscribe() : '';
  }

  clearAllDatas() {
    this.quickSearchValue = '';
    this.quickSearchValue1 = '';
    this.selectedShortlistname = null;
    this.selectedInstitute = null;
    this.selectedEdu = null;
    this.selectedStatus = '1';
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
 }

  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['data']) {
        this.routedData = JSON.parse(params['data']);
        // this.selectedInstitute = this.routedData.college_name;
        // this.selectedShortlistname = this.routedData.shortlist_name;
        // this.selectedEdu = this.routedData.education_level;
        this.selectedStatus = '1';
      } else {
      }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.go();
    this.tabledef();
    // this.gridApi.sizeColumnsToFit();
    // this.gridApi.setDatasource(this.dataSources);
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  tabledef() {
    if (this.appConfig.getSelectedDrivePermissions().video_assessment) {
      let defaultCol: any = this.withoutVideoSchedule();
      let mergeCol = defaultCol.concat(this.WithVideoSchedulingColumns());
      this.gridApi.setColumnDefs(mergeCol);
    } else {
      this.gridApi.setColumnDefs(null);
      this.gridApi.setColumnDefs(this.withoutVideoSchedule());
    }
  }

  withoutVideoSchedule() {
    return [
      {
        headerName: 'Candidate Id', field: 'candidate_id',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate name', field: 'name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { 'cursor': 'pointer', color: '#C02222' },
        cellRenderer: (params) => {
          return `<span style="border-bottom: solid #C02222 1px">${params['data']['name']} </span>`;
        }
      },
      {
        headerName: 'Email Id', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Shortlist Name', field: 'shortlist_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'assement_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute name', field: 'institue',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'institue',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Education level', field: 'level',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'level',
        valueGetter: (params) => {
          if (params.data.level == 'UG') {
            return 'Undergraduate';
          } else if (params.data.level == 'PG') {
            return 'Postgraduate';
          } else if (params.data.level == 'Diploma') {
            return 'Diploma';
          } else { return params.data.level; }
        },
      getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Panel assigned', field: 'panel_assigned',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'panel_assigned',
        valueGetter: (params) => {
          return params && params.data &&  params.data.panel_assigned ? params.data.panel_assigned : 'Unassigned'
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      // {
      //   headerName: 'Documents submitted', field: 'document_submit',
      //   filter: true,
      //   floatingFilterComponentParams: { suppressFilterButton: true },
      //   minWidth: 140,
      //   sortable: true,
      //   tooltipField: 'document_submit',
      //   getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
      // {
      //   headerName: 'Status', field: 'total_count',
      //   filter: true,
      //   floatingFilterComponentParams: { suppressFilterButton: true },
      //   sortable: true,
      //   valueGetter: (params) => {
      //     const total = +params.data.total_count;
      //     // console.log(params, total, 'vg');
      //     if (total === +params.data.updated_count + +params.data.success_count) {
      //       return 'All success';
      //     } else if (total === +params.data.duplicate_count + +params.data.existing_count + +params.data.failure_count) {
      //       return 'All failure';
      //     } else { return 'Partial success'; }
      //   },
      //   getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
    ];
  }

  WithVideoSchedulingColumns() {
    return [
      {
        headerName: 'Video Assessment Status', field: 'va_test_status',
        filter: 'agSetColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'va_test_status',
        getQuickFilterText: (params) => {
          return params.value;
          }
      },
      {
        headerName: 'Video Evaluation Status', field: 'va_evaluation_status',
        filter: 'agSetColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'va_evaluation_status',
        getQuickFilterText: (params) => {
          return params.value;
          }
      }
    ]
    }

  onCellClicked(event) {
    if (event.colDef.field === 'name') {
      const param = {
        shortlist_name: event['data'] && event['data']['shortlist_name'] ? event['data']['shortlist_name'] : '',
        cid: event['data'] && event['data']['candidate_id'] ? event['data']['candidate_id'] : '',
        name: event['data'] && event['data']['name'] ? event['data']['name'] : '',
        status: event['data'] && event['data']['evaluation_status'] ? event['data']['evaluation_status'] : '',
        tag: event['data'] && event['data']['tag'] ? event['data']['tag'] : '',
        uid: event['data'] && event['data']['uid'] ? event['data']['uid'] : '',
        email: event['data'] && event['data']['email'] ? event['data']['email'] : '',
        assess: event['data'] && event['data']['assement_name'] ? event['data']['assement_name'] : ''
      }
      this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_PANEL_EVALUATION, { data: param['assess'], id: param['cid'], name: param['name'], status: param['status'], tag: param['tag'], uid: param['uid'], email: param['email'], shortlist_name: param['shortlist_name'] });
    }
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


  instituteChange() {

  }

  getEducation() {
    let Temp = this.EduLevel ? this.EduLevel : [];
    const final = [];
    let ca = {
      name: 'CA',
      label: 'CA',
      checkbox: false,
      percentageFrom: '',
      percentageTo: '',
      yearFrom: '',
      yearTo: '',
      radio: false
    };
    Temp.forEach(element => {
      if (element && element['name'] == 'UG') {
        final.push(element);
      }
      if (element && element['name'] == 'PG') {
        final.push(element);
      }
      if (element && element['name'] == 'Diploma') {
        final.push(element);
      }
    });
    final.push(ca);
    this.allEducations = final ? final : [];
  }

  getInstitute() {
    this.getInsituteSubscription = this.adminService.getInterviewpanelInstitutes().subscribe((data: any) => {

      this.allInstitutes = data ? data : [];
    }, (err) => {
    });
  }

  getShortlistNames() {
    this.getShortlistNameSubscription = this.adminService.getAllShortlistedShortlistNames().subscribe((data: any) => {
      this.allShortlistNames = data ? data : [];
    }, (err) => {
    });
  }

  go() {
    const apiData = {
      shortlist_name: this.selectedShortlistname ? this.selectedShortlistname : '',
      college_name: this.selectedInstitute ? this.selectedInstitute : '',
      education_level: this.selectedEdu ? this.selectedEdu : '',
      status: this.selectedStatus ? (this.selectedStatus == 'all' ? '' : this.selectedStatus) : ''
    }
    this.gridApi.showLoadingOverlay();
    this.getAlreadyAssignedSubscription = this.adminService.getAlreadyAssigned(apiData).subscribe((data: any) => {

      if(!this.pannel) { return } else {this.pannel.close()}
      this.rowData = data ? data : [];
      if (this.appConfig.getSelectedDrivePermissions().video_assessment) {
      this.rowData.forEach(element => {
        if (element) {
        element.va_evaluation_status = element.va_scheduled_status != 1 ? '-' : element.va_evaluation_status;
        element.va_test_status = element.va_scheduled_status != 1 ? '-' : element.va_test_status;
        if (element.va_scheduled_status) {
          element.va_evaluation_status = element.va_evaluation_status ? this.getVideoEvaluationStatus(element.va_evaluation_status) : 'Yet to Evaluate';
          element.va_test_status = element.va_test_status == 'InProgress' ? 'In Progress' : element.va_test_status == 'YetToStart' ? 'Yet to Start' : element.va_test_status;
        }
      }
      });
      }
      }, (err) => {
    });
  }

  getVideoEvaluationStatus(status: any) {
    if (status == 'selected') {
      return 'Selected';
    }
    if (status == 'rejected') {
      return 'Rejected';
    } else {
      return status;
    }
  }

}
