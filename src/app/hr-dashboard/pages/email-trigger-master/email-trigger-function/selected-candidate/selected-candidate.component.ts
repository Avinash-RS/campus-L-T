import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { IsRowSelectable } from 'ag-grid-community';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-selected-candidate',
  templateUrl: './selected-candidate.component.html',
  styleUrls: ['./selected-candidate.component.scss'],
  providers: [DatePipe]
})
export class SelectedCandidateComponent implements OnInit, OnChanges, OnDestroy {
  @Input() stepperIndex: any;
  @Input() loadSelectedCandidatesTrue: any;
  @Output() nextClickEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('viewLog', { static: false }) viewLog: TemplateRef<any>;
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
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  rowStyle = { background: '#fcfcfc' };
  public isRowSelectable: IsRowSelectable;
  userList: any;
  popUpdata: any;
  public statusBar = {
    statusPanels: [
    { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
    { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
    { statusPanel: 'agAggregationComponent', align: 'right' },
    ],
  };


  stagesList = [];
  stagesListSubscription: Subscription;
  selectedValue: any;
  SelectedCandidatesListSubscription: Subscription;
  selectedCandidatePopUp: any;
  communicationLogs: any;
  CommunicationLogsListSubscription: Subscription;

  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFuncWithSideBar();
    this.tabledef();
    this.getStagesList();
  }

  ngOnChanges() {
    if (this.loadSelectedCandidatesTrue) {
      this.getStagesList();
    }
  }

  getStagesList() {
    this.stagesListSubscription = this.adminService.stagesList().subscribe((res: any)=> {
      this.stagesList = res && res?.stages_list && res?.stages_list.length > 0 ? res?.stages_list : [];
      this.selectedValue = this.stagesList[0].stages[0].stage_id;
      this.getUsersList(this.selectedValue);
    }, (err)=> {

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
    if(event && event.colDef && event.colDef.headerName == 'Communication Log'){
      const apiData = {
        candidate_user_id: event['data']['user_id']
      }
      this.selectedCandidatePopUp = event['data'];
      this.viewLogPopup(apiData);
    }
    if (event.colDef.field === 'user_name') {
      const data = {
        candidate_user_id: event['data'] && event['data']['user_id'] ? event['data']['user_id'] : '',
        candidateName: event['data'] && event['data']['user_name'] ? event['data']['user_name'] : '',
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
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        maxWidth: 50,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        suppressMenu: true,
        field: 'is_checked',
        headerName: ''
      },
      {
        headerName: 'Candidate Id', field: 'candidate_id',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'user_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'user_name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#1b4e9b' },
        cellRenderer: (params) => {
          return `<span style="cursor: pointer"><span class="profileAvatar"><img src="${params["data"]["profile_image"]}"></span> <span class="ml-1">${params["data"]["user_name"]}</span> </span>`;
        }
      },
      {
        headerName: 'Email', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
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
        headerName: 'Email Sent', field: 'email_sent',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 95,
        sortable: true,
        tooltipField: 'email_sent',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date & Time', field: 'triggered_date',
        filter: 'agTextColumnFilter',
        minWidth: 190,
        maxWidth: 190,
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
        headerName: 'Communication Log', field: 'log',
        filter: false,
        minWidth: 120,
        sortable: false,
        tooltipField: 'log',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return `<span style="color: #1b4e9b; text-decoration: underline; cursor: pointer">View Log</span>`;
        }
      },
    ];

    this.isRowSelectable = function (rowNode) {
      return rowNode.data ? true : true;
    };
  }

  stageListChange(stageId: any) {
    setTimeout(() => {
      this.getUsersList(this.selectedValue);
    }, 100);
  }
    // To get all users
    getUsersList(stageId: any) {
      const apiData = {
        stage_id: stageId
      };
     this.gridApi.showLoadingOverlay();
     this.SelectedCandidatesListSubscription = this.adminService.getCandidatesBasedonStageId(apiData).subscribe((res: any) => {
        this.userList = res && res.candidate_list && res.candidate_list.length > 0 ? res.candidate_list : [];
        this.userList.forEach(element => {
          element['is_checked'] = false;
          element.log = 'View Log';
          element["profile_image"] = element["profile_image"] ? element["profile_image"] : 'assets/images/img_avatar2.jpg';
        });
        this.rowData = this.userList;
        this.nextClickEmitter.emit();
      }, (err) => {
        this.userList = [];
        this.rowData = [];
    });
  }

  viewLogPopup(apiData) {
    this.dialog.open(this.viewLog, {
      width: '600px',
      height: 'auto',
      id: 'viewLogPopup',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'viewLog-wrapper'
    }).afterOpened().subscribe((res)=> {
      this.communicationLogs = [];
      this.getCommunicationLogs(apiData);
    });
  }

  getCommunicationLogs(apiData: any) {
    this.CommunicationLogsListSubscription = this.adminService.getCommunicationLogsbasedOnCandidateId(apiData).subscribe((res: any) => {
      this.communicationLogs = res && res?.communication_logs && res?.communication_logs.length > 0 ? res?.communication_logs : [];
    }, (err) => {
      this.communicationLogs = [];
  });
  }

  closeBox(id: any, message) {
    // this.matDialogRefTerms.
    let customDialog = this.dialog.getDialogById(id);
    customDialog.close(message);
  }

  ngOnDestroy() {
    this.stagesListSubscription ? this.stagesListSubscription.unsubscribe() : '';
    this.SelectedCandidatesListSubscription ? this.SelectedCandidatesListSubscription.unsubscribe() : '';
    this.CommunicationLogsListSubscription ? this.CommunicationLogsListSubscription.unsubscribe() : '';
  }

}