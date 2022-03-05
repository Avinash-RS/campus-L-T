import { MatDialog } from '@angular/material';
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { environment } from 'src/environments/environment';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listof-selected-candidates',
  templateUrl: './listof-selected-candidates.component.html',
  styleUrls: ['./listof-selected-candidates.component.scss']
})
export class ListofSelectedCandidatesComponent implements OnInit, OnDestroy {
  @ViewChild('matDialog', {static: false}) matDialogRef: TemplateRef<any>;
  BASE_URL = environment.API_BASE_URL;

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
  public isRowSelectable;
  userList: any;
  popUpdata: any;

  refreshSubscription: Subscription;
  excelExportSelectedCandidatesSubscription: Subscription;
  documentVerificationSubscription: Subscription;
  sendMailOrEditAccessSubscription: Subscription;
  SelectedCandidatesListSubscription: Subscription;
  documentsDownloadSubscription: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private dialog: MatDialog,
    private sharedService: SharedServiceService
  ) { }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.tabledef();
    this.GetRowStyle();
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.excelExportSelectedCandidatesSubscription ? this.excelExportSelectedCandidatesSubscription.unsubscribe() : '';
    this.documentVerificationSubscription ? this.documentVerificationSubscription.unsubscribe() : '';
    this.sendMailOrEditAccessSubscription ? this.sendMailOrEditAccessSubscription.unsubscribe() : '';
    this.SelectedCandidatesListSubscription ? this.SelectedCandidatesListSubscription.unsubscribe() : '';
    this.documentsDownloadSubscription ? this.documentsDownloadSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.OfferedCandidatesLIST)) {
        this.quickSearchValue = '';
        this.getUsersList();
        this.GetRowStyle();
        }
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
    if (event.colDef.field === 'details') {
      this.downloadExcel(event['data']);
    }

    if (event.colDef.field === 'verified') {
      if (event['data']['is_editable'] == 'Submitted') {
        let index = event.rowIndex;
        let user_id = event['data']['user_id'];
        let status = event['data']['verified'] == 'Verified' ? '0' : '1';
        this.documentverify(index, user_id, status);
      }
    }

    if (event.colDef.field === 'candidate_name') {
      if (event['data']['mailed'] == 'Sent' && event['data']['is_editable'] == 'Submitted') {
        const data = {
          candidate_user_id: event['data'] && event['data']['user_id'] ? event['data']['user_id'] : '',
        };
        this.openDialog4(CommonKycProfileViewComponent, data);
      } else {
        const data = {
          candidate_user_id: event['data'] && event['data']['user_id'] ? event['data']['user_id'] : '',
          candidateName: event['data'] && event['data']['candidate_name'] ? event['data']['candidate_name'] : '',
        };
        this.openDialog5(CommonKycProfileViewComponent, data);
      }
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

      // Open dailog
      openDialog4(component, data) {
        let dialogDetails: any;

        /**
         * Dialog modal window
         */
        // tslint:disable-next-line: one-variable-per-declaration
        const dialogRef = this.dialog.open(component, {
          width: 'auto',
          height: 'auto',
          autoFocus: false,
          closeOnNavigation: true,
          disableClose: true,
          panelClass: 'common-joining-form',
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
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate Name', field: 'candidate_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#1b4e9b' },
        cellRenderer: (params) => {
          return `<span style="border-bottom: solid #1b4e9b 1px; cursor: pointer">${params['data']['candidate_name']} </span>`;
        }
      },
      {
        headerName: 'Candidate Email Id', field: 'selected_candidate',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'selected_candidate',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Profile', field: 'selectedpost',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 110,
        sortable: true,
        tooltipField: 'selectedpost',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Mail', field: 'mailed',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 95,
        sortable: true,
        tooltipField: 'mailed',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Joining Form Status', field: 'is_editable',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 130,
        sortable: true,
        tooltipField: 'is_editable',
        getQuickFilterText: (params) => {
          return params.value;
        },
      },
      {
        headerName: 'Institute', field: 'institute',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'institute',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Specialization', field: 'specialization',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'specialization',
        getQuickFilterText: (params) => {
          return params.value;
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
        }
      },
      {
        headerName: 'Assigned to', field: 'company',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'company',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploaded by', field: 'uploaded_by',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'uploaded_by',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date & Time of Upload', field: 'date_time',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'date_time',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Declined Status', field: 'decline_status',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'decline_status',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Download Documents', field: 'details',
        filter: false,
        // headerTooltip: 'Download documents',
        valueFormatter: this.tooltipFormatter,
        minWidth: 125,
        tooltipValueGetter: (params) => {//This will show valueFormatted if is present, if no just show the value.
          return (params.valueFormatted);
      },
      cellStyle: {'justify-content': 'center !important'},
      cellClass: 'ag-icon-custom',
      cellRenderer: (params) => {
            return `<span class="icon-download ag-icon-color pointer ag-icon-font-size-20"></span>`;
        },
        sortable: false,
      },
      {
        headerName: 'Verification Status', field: 'verified',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        sortable: true,
        cellClass: 'ag-button-cellClass',
        cellRenderer: (params) => {
          if (params.data.is_editable == 'Submitted') {
            if (params.data.verified && params.data.verified == 'Verified') {
              return `<button class="ag-grid-buttons-icon completed-color" mat-raised-button><span class="icon-Tick ag-icon-font-size-14 mr-2"></span><span> Verified</span></button>`;
            } else {
              return `<button class="ag-grid-buttons-icon inprogress1-color" mat-raised-button><span>Verify</span></button>`;
            }
          } else {
            if (params.data.verified && params.data.verified == 'Verified') {
              return `<button class="ag-grid-buttons-icon disabled completed-color" mat-raised-button><span class="icon-Tick mr-2"></span><span> Verified</span></button>`;
            } else {
              return `<button class="ag-grid-buttons-icon disabled not-scheduled-white-color" mat-raised-button><span>Verify</span></button>`;
            }
          }
        },
        minWidth: 125,
      },
      {
        headerName: 'Verified/Reverted by', field: 'verifier_name',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 170,
        sortable: true,
        tooltipField: 'verifier_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];

    const LarsenSpecificColumns = [{
      headerName: 'Offer Status', field: 'offer_status',
      filter: 'agSetColumnFilter',
      minWidth: 120,
      sortable: true,
      tooltipField: 'offer_status',
      getQuickFilterText: (params) => {
        return params.value;
      }
    },
    {
      headerName: 'Medical Status', field: 'fitness_status',
      filter: 'agSetColumnFilter',
      minWidth: 120,
      sortable: true,
      tooltipField: 'fitness_status',
      getQuickFilterText: (params) => {
        return params.value;
      }
    }];

    if (this.appConfig.getSelectedCustomerCode() == '#LTTS') {
      this.columnDefs.splice(6, 0 , LarsenSpecificColumns[0]);
      this.columnDefs.splice(8, 0 , LarsenSpecificColumns[1]);
    }

    this.isRowSelectable = function (rowNode) {
      return rowNode.data && rowNode.data.decline_status == 'Yes' ? false : true;
    };
  }

  tooltipFormatter(params) {
    return "Download documents";
  }

  excelExport() {
    if (this.gridApi.getSelectedNodes() && this.gridApi.getSelectedNodes().length > 0) {
      const apiData = [];

      const selectedUserlist = this.gridApi.rowModel.rowsToDisplay;
      selectedUserlist.forEach(element => {
        if (element && element.selected) {
          let api = {
            // email: element['data']['selected_candidate'],
            // company: element['data']['company'],
            user_id: element['data']['user_id'],
            // name: element['data']['candidate_name']
          }
          apiData.push(api);
        }
      });
      this.excelApi(apiData);
    } else {
      let data = [];
      this.excelApi(data);
    }
  }

  excelApi(data) {
    const role = this.appConfig.getLocalData('roles');
    let apiData = {
      uid: role == 'ic' ? this.appConfig.getLocalData('userId') : '',
      users: data
    };
    this.excelExportSelectedCandidatesSubscription = this.adminService.excelExportSelectedCandidates(apiData).subscribe((datas: any)=> {
      if (datas && datas.url) {
        this.gridApi.deselectAll();
        this.appConfig.success('Excel Report downloaded successfully');
        window.open(datas.url, '_blank');
      } else {
        this.appConfig.warning('Please try again later');
      }
    });
  }
  getAllNodes() {
    let rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  documentverify(selectedIndex, uid, status) {
    const apiData = {
      user_id: uid,
      doc_verify: status,
      verifier: this.appConfig.getLocalData('userId')
    }
   this.documentVerificationSubscription = this.adminService.documentVerification(apiData).subscribe((data: any)=> {
      this.appConfig.success(status == '0' ? 'Verification Reverted' : 'Documents Verified Successfully');
      this.rowData[selectedIndex].verified = this.rowData[selectedIndex].verified == 'Verified' ? 'Verify' : 'Verified';
      this.rowData[selectedIndex].verifier_name = this.appConfig.getLocalData('username');
      this.gridApi.applyTransaction({ update: this.rowData});
    }, (err)=> {

    });
  }
  openMatDialog(data) {
    if (data) {
      this.popUpdata = {
        value: 1,
        text: `Confirm to trigger an email for the selected ${this.gridApi.getSelectedNodes().length} ${(this.gridApi.getSelectedNodes().length) == 1 ? 'candidate' : 'candidates'}.`,
      }
    } else {
      this.popUpdata = {
        value: 0,
        text: `Confirm to give Edit Access to Joining Form for the selected ${this.gridApi.getSelectedNodes().length} ${(this.gridApi.getSelectedNodes().length) == 1 ? 'candidate' : 'candidates'}.`
      }
    }
    const dialogRef = this.dialog.open(this.matDialogRef, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForForms'
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  saveDialog() {
    this.dialog.closeAll();
    const apiData = [];
    const selectedUserlist = this.gridApi.getSelectedNodes();
    selectedUserlist.forEach(element => {
      let api = {
        email: element['data']['selected_candidate'],
        company: element['data']['company'],
        user_id: element['data']['user_id'],
        name: element['data']['candidate_name']
      }
      apiData.push(api);
    });
    this.sendMailOrEditAccessSubscription = this.adminService.sendMailOrEditAccess(apiData, this.popUpdata.value).subscribe((data: any)=> {

      this.appConfig.success(this.popUpdata.value == 1 ? 'Mail Sent to the Candidates Successfully' : 'Edit Access given to the Candidates Successfully');
      this.gridApi.deselectAll();
      this.getUsersList();
      this.GetRowStyle();
    });
  }
  // To get all users
  getUsersList() {
    const role = this.appConfig.getLocalData('roles');
    const apiData = {
      company: role == 'ic' ? this.appConfig.getLocalData('userId') : ''
    }
   this.gridApi.showLoadingOverlay();
   this.SelectedCandidatesListSubscription = this.adminService.SelectedCandidatesList(apiData).subscribe((datas: any) => {
      this.userList = datas ? datas : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['verified'] = element['verified'] == '1' ? 'Verified' : 'Verify';
        element['is_editable'] = element['mailed'] == 'Not Sent' ? '-' : (element['mailed'] == 'Sent' && element['is_editable'] == 'No') ? 'Submitted' : 'Open';
        element['is_checked'] = element['decline_status'] == '1' ? '' : false;
        element['offer_status'] = element['offer_status'] ? element['offer_status'] : '--';
        element['fitness_status'] = element['fitness_status'] ? element['fitness_status'] : '--';
        element['decline_status'] = element['decline_status'] == '1' ? 'Yes' : 'No';
        element['details'] = count;
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  downloadExcel(element) {
    let sendReq = {
      uid: element?.user_id ? element?.user_id : '',
      uname: this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : '',
      email: this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : ''
    }
    this.documentsDownloadSubscription = this.adminService.documentsDownload(sendReq).subscribe((data: any) => {

      if (data?.url) {
        const documents = `${this.BASE_URL}/${data?.url}`;
        window.open(documents, '_blank');
      } else {
        this.appConfig.warning('No Documents Available');
      }

      // const excel = data && data.file ? data.file : '';
      // window.open(excel, '_blank');

    }, (err) => {
    });
  }

}
