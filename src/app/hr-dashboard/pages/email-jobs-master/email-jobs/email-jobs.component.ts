import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { IsRowSelectable } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';

@Component({
  selector: 'app-email-jobs',
  templateUrl: './email-jobs.component.html',
  styleUrls: ['./email-jobs.component.scss']
})
export class EmailJobsComponent implements OnInit {
  @Input() stageWiseDetails: any;
  @Input() stepperIndex: any;
  @Output() nextClickEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('email', {static: false}) emails: TemplateRef<any>;
 emaildialogRef:any;
  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef: any;
  tooltipShowDelay = 0;
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  rowStyle = { background: '#fcfcfc' };
  getRowStyle: any;
  public isRowSelectable: IsRowSelectable;
  userList: any;
  popUpdata: any;
  stagesList = [];
  stagesListSubscription: Subscription;
  selectedValue: any;

  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.tabledef();
    this.GetRowStyle();
    this.getStagesList();
  }

  ngOnChanges() {
    
  }

  getStagesList() {
    this.stagesListSubscription = this.adminService.stagesList().subscribe((res: any)=> {
      this.stagesList = res && res?.stages_list && res?.stages_list.length > 0 ? res?.stages_list : [];
      this.selectedValue = this.stagesList[0].stages[0].stage_id;
    }, (err)=> {

    });
  }

  GetRowStyle() {
    this.getRowStyle = (params) => {
      let rowsArray = params.node.rowModel.rowsToDisplay;
      let rowI = params.node.rowIndex;
      if (rowsArray[rowI].data.decline_status == 'Yes') {
          return {opacity: '0.5'};
      }
  };
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
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_EMAIL_JOBS_EMAIL_BATCH);
      }
      if(event && event.colDef && event.colDef.headerName == 'View Template'){
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
        headerName: 'Batch Job ID', field: 'candidate_id',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'Batch Job ID',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Sent Date and Time', field: 'candidate_name',
        filter: 'agDateColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'Sent Date and Time',
        getQuickFilterText: (params) => {
          return params.value;
        },

      },
      {
        headerName: 'Triggered By', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'Triggered By',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email Template', field: 'mobile_number',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'Email Template',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Count', field: 'institute',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'Count',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Status', field: 'discipline',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'Status',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Details', field: 'mailed',
        filter: 'agTextColumnFilter',
        minWidth: 85,
        sortable: true,
        tooltipField: 'Details',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#004684' },
        cellRenderer: (params) => {
          return `<span style="color: #004684; cursor: pointer; text-decoration: underline;">View Details </span>`;
        }
      },
      {
        headerName: 'View Template', field: 'date_time',
        filter: 'agTextColumnFilter',
        minWidth: 150,
        maxWidth: 150,
        sortable: true,
        tooltipField: 'View Template',
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
      this.rowData = [
        {
          is_checked: false,
          candidate_id: '13133',
          candidate_name: 'Avinash',
          email: 'Avinash@mailinator.com',
          mobile_number: '9865257782',
          institute: 'Seshasayee Institute of Technology',
          discipline: 'Computer Science',
          mailed: 'yes',
          date_time: '24 May 2022 12:00 PM',
          log: 'View Log'
        }
      ];

  }

  openEmailTemplate() {
    this.emaildialogRef = this.matDialog.open(this.emails, {
      width: '803px',
      height: '592px',
      panelClass: 'loginpopover',
    });
  }

  ngOnDestroy() {
    this.stagesListSubscription ? this.stagesListSubscription.unsubscribe() : '';
  }

}