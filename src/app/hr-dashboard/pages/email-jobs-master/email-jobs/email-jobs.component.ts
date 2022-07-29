import { Component, OnInit, TemplateRef, ViewChild, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-email-jobs',
  templateUrl: './email-jobs.component.html',
  styleUrls: ['./email-jobs.component.scss'],
  providers: [DatePipe],
})
export class EmailJobsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('email', {static: false}) emails: TemplateRef<any>;
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
  emailJobListSubscription: Subscription;
  refreshSubscription: Subscription;
  selectedTemplate: any;
  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private sharedService: SharedServiceService
  ) { }

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
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_EMAIL_JOBS_EMAIL)) {
        this.quickSearchValue = '';
        this.userList = null;
        this.rowData = null;
        setTimeout(() => {
          this.getUsersList();
        }, 100);
      }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getUsersList();
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
    if(event && event.colDef && event.colDef.headerName == 'Details'){
      this.appConfig.routeNavigationWithQueryParamAndParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_EMAIL_JOBS_EMAIL_BATCH, event.data.joblist_id, {name: event.data.template_name});
      }
      if(event && event.colDef && event.colDef.headerName == 'View Template'){
        this.selectedTemplate = {
          template_name: event.data.template_name,
          subject: event.data.email_content.subject_line,
          content: event.data.email_content.body_content
        }
        this.openEmailTemplate()
      }
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
        headerName: 'Batch Job ID', field: 'batch_job_id',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'batch_job_id',
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
      {
        headerName: 'Triggered By', field: 'triggered_by',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'triggered_by',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email Template', field: 'template_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'template_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Count', field: 'count',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'count',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Status', field: 'job_status',
        filter: 'agSetColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'job_status',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Details', field: 'joblist_id',
        filter: false,
        minWidth: 85,
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#004684' },
        cellRenderer: (params) => {
          return `<span style="color: #004684; cursor: pointer; text-decoration: underline;">View Details</span>`;
        }
      },
      {
        headerName: 'View Template', field: 'joblist_id',
        filter: false,
        minWidth: 150,
        maxWidth: 150,
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#004684' },
        cellRenderer: (params) => {
          return `<div style="color: #004684; cursor: pointer;text-align:center"><span class="icon-View"></span> </div>`;
        }
      },
    ];
  }


    // To get all users
    getUsersList() {
      this.gridApi.showLoadingOverlay();
      this.emailJobListSubscription = this.adminService.emailJobList().subscribe((res: any)=> {
          this.userList = res && res.length > 0 ? res : [];
          this.rowData = this.userList;
      }, (err)=> {
        this.rowData = [];
        this.userList = [];
      })
  }

  openEmailTemplate() {
    this.matDialog.open(this.emails, {
      width: '803px',
      panelClass: 'viewtemplatepopover',
    });
  }

  ngOnDestroy() {
    this.emailJobListSubscription ? this.emailJobListSubscription.unsubscribe() : '';
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
  }

}