import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin,  } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';
import { MatDialog } from '@angular/material';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-batchwise-email-jobs',
  templateUrl: './batchwise-email-jobs.component.html',
  styleUrls: ['./batchwise-email-jobs.component.scss'],
  providers: [DatePipe]
})
export class BatchwiseEmailJobsComponent implements OnInit, AfterViewInit, OnDestroy {
  sideBar = {
    toolPanels: [ 
    {id: 'filters',
    labelDefault: 'Filters',
    labelKey: 'filters',
    iconKey: 'filter',
    toolPanel: 'agFiltersToolPanel',
    }
    ], defaultToolPanel: ''
  };
  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef: any;
  tooltipShowDelay = 0;
  rowData: any;
  quickSearchValue = '';
  rowStyle = { background: '#fcfcfc' };
  userList: any;
  batchemailJobListSubscription: Subscription;
  selectedTemplate: any;
  selectedJobListId: any;
  template_name: any;
  refreshSubscription: Subscription;
  candidateStatus: any;
  batchJob: any;
  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private sharedService: SharedServiceService
  ) {
    this.getRouteParam();
  }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFuncWithSideBar();
    this.tabledef();
    this.refreshOndriveChangeRXJS();
  }

  ngOnChanges() {    
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_EMAIL_JOBS_EMAIL_BATCH)) {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_EMAIL_JOBS_EMAIL);
      }
    });
  }


  getRouteParam() {
    let obs = combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
      map(results => {
        return {
          params: results && results[0] ? results[0]?.id : null,
          queryParams: results && results[1] ? results[1]?.name : null,
          batchJob: results && results[1] ? results[1]?.batchId : null,
        };
      })
    ).subscribe((res)=> {
      console.log('para', res);
    if (res?.params) {
        this.selectedJobListId = res?.params;
        this.template_name = res?.queryParams;
        this.batchJob = res?.batchJob;
        this.getUsersList(this.selectedJobListId);
      } else {
        this.appConfig.warning('Joblist Id Missing');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_EMAIL_JOBS_EMAIL);
      }
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
    if (event.colDef.field === 'name') {
      const data = {
        candidate_user_id: event['data'] && event['data']['user_id'] ? event['data']['user_id'] : '',
        candidateName: event['data'] && event['data']['name'] ? event['data']['name'] : '',
      };
      this.openDialog5(CommonKycProfileViewComponent, data);
    }

  }
    // Open dailog
    openDialog5(component, data) {
      let dialogDetails: any;

      /**
       * Dialog modal window
       */
      // tslint:disable-next-line: one-variable-per-declaration
      const dialogRef = this.dialog.open(component, {
        width: 'auto',
        height: 'auto',
        autoFocus: false,
        data
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      });
  }


  getModel(e) {
    this.gridApi.deselectAll();
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
  tabledef() {

    this.columnDefs = [
      {
        headerName: 'Candidate ID', field: 'candidate_id',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#1b4e9b' },
        cellRenderer: (params) => {
          return `<span style="cursor: pointer"><span class="profileAvatar"><img src="${params["data"]["profile_image"]}"></span> <span class="ml-1">${params["data"]["name"]}</span> </span>`;
        }
      },
      {
        headerName: 'Phone', field: 'phone',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'phone',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return params['data']['phone'] ? `${params['data']['phone']}` : '-';
        }
      },
      {
        headerName: 'College', field: 'college',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'college',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return params['data']['college'] ? `${params['data']['college']}` : '-';
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return params['data']['discipline'] ? `${params['data']['discipline']}` : '-';
        }
      },
      {
        headerName: 'Email Status', field: 'email_status',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 95,
        sortable: true,
        tooltipField: 'email_status',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Sent Date and Time', field: 'triggered_date',
        filter: 'agTextColumnFilter',
        minWidth: 190,
        sortable: true,
        tooltipField: 'triggered_date',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return `<span>${params['data']['triggered_date'] ? this.datePipe.transform(params['data']['triggered_date'], 'dd MMM yyyy') : '-'}</span> <span>${params['data']['triggered_date'] ? this.datePipe.transform(params['data']['triggered_date'], 'HH:mm a') : ''}</span>`;
        }
      },
    ];
  }


    // To get all users
    getUsersList(jobListId: any) {
      const apiData = {
        joblist_id: jobListId
      } 
      this.batchemailJobListSubscription = this.adminService.emailJobListbyId(apiData).subscribe((res: any)=> {
          this.userList = res && res?.candidate_details && res?.candidate_details.length > 0 ? res?.candidate_details : [];
          this.candidateStatus = res && res?.status_counts && res?.status_counts.length > 0 ? res?.status_counts : [];
          this.userList.forEach(element => {
            element["profile_image"] = element["profile_image"] ? element["profile_image"] : 'assets/images/img_avatar2.jpg';
          });  
          this.rowData = this.userList;
      }, (err)=> {
        this.rowData = [];
        this.userList = [];
        this.candidateStatus = [];
      })
  }

  ngOnDestroy() {
    this.batchemailJobListSubscription ? this.batchemailJobListSubscription.unsubscribe() : '';
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
  }

}
