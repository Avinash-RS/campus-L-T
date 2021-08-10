import { CommonJoiningFormComponent } from './../../../shared/common-joining-form/common-joining-form.component';
import { MatDialog } from '@angular/material';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { environment } from 'src/environments/environment';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';

@Component({
  selector: 'app-listof-selected-candidates',
  templateUrl: './listof-selected-candidates.component.html',
  styleUrls: ['./listof-selected-candidates.component.scss']
})
export class ListofSelectedCandidatesComponent implements OnInit {
  @ViewChild('matDialog', {static: false}) matDialogRef: TemplateRef<any>;
  BASE_URL = environment.API_BASE_URL;

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

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private dialog: MatDialog,
    private sharedService: SharedServiceService
  ) { }

  ngOnInit() {
    this.tabledef();
    this.GetRowStyle();
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
          candidateId: event['data'] && event['data']['user_id'] ? event['data']['user_id'] : '',
        };
        this.openDialog4(CommonJoiningFormComponent, data);
      } else {
        const data = {
          candidateId: event['data'] && event['data']['user_id'] ? event['data']['user_id'] : '',
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
  tabledef() {

    this.columnDefs = [
      {
        headerCheckboxSelection: true,
        maxWidth: 50,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        suppressMenu: true,
        field: 'is_checked',
        headerName: ''
      },
      {
        headerName: 'Mail', field: 'mailed',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 85,
        maxWidth: 85,
        sortable: true,
        tooltipField: 'mailed',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Form Status', field: 'is_editable',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 95,
        sortable: true,
        tooltipField: 'is_editable',
        getQuickFilterText: (params) => {
          return params.value;
        },
      },
      {
        headerName: 'Candidate id', field: 'candidate_id',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate name', field: 'candidate_name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#C02222' },
        cellRenderer: (params) => {
          return `<span style="border-bottom: solid #C02222 1px; cursor: pointer">${params['data']['candidate_name']} </span>`;
        }
      },
      {
        headerName: 'Candidate Email id', field: 'selected_candidate',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'selected_candidate',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Profile', field: 'selectedpost',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 90,
        sortable: true,
        tooltipField: 'selectedpost',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute', field: 'institute',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'institute',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Specialization', field: 'specialization',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'specialization',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Assigned to', field: 'company',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'company',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploaded by', field: 'uploaded_by',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'uploaded_by',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date & Time of upload', field: 'date_time',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'date_time',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Declined Status', field: 'decline_status',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'decline_status',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Download Documents', field: 'details',
        cellClass: 'agCellStyle',
        // headerTooltip: 'Download documents',
        valueFormatter: this.tooltipFormatter,
        minWidth: 60,
        tooltipValueGetter: (params) => {//This will show valueFormatted if is present, if no just show the value.
          return (params.valueFormatted);
      },
        cellRenderer: (params) => {
            return `<span style="cursor: pointer;" class="material-icons d-flex justify-content-center align-items-center">
            file_download
            </span>`;
        },
        sortable: false,
      },
      {
        headerName: 'Verification Status', field: 'verified',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center' },
        cellRenderer: (params) => {
          if (params.data.is_editable == 'Submitted') {
            if (params.data.verified && params.data.verified == 'Verified') {
              return `<button class="verify verified-clr" mat-raised-button><span class="material-icons check">done</span><span> Verified</span></button>`;
            } else {
              return `<button class="verify verify-clr" mat-raised-button><span>Verify</span></button>`;
            }
          } else {
            if (params.data.verified && params.data.verified == 'Verified') {
              return `<button class="verify disable verify-clr-grey" mat-raised-button><span class="material-icons check">done</span><span> Verified</span></button>`;
            } else {
              return `<button class="verify disable verify-clr-grey" mat-raised-button><span>Verify</span></button>`;
            }
          }
        },
        minWidth: 120,
      },
      {
        headerName: 'Verified/Reverted by', field: 'verifier_name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 170,
        sortable: true,
        tooltipField: 'verifier_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];

    this.isRowSelectable = function (rowNode) {
      return rowNode.data && rowNode.data.decline_status == 'Yes' ? false : true;
    };

    this.getUsersList();
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
    this.adminService.excelExportSelectedCandidates(apiData).subscribe((datas: any)=> {
      if (datas && datas.url) {
        this.gridApi.deselectAll();
        this.appConfig.success('Excel Report downloaded successfully');
        window.open(datas.url, '_blank');
      } else {
        this.appConfig.warning('Please try again later');
      }

      this.appConfig.hideLoader();
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
    this.adminService.documentVerification(apiData).subscribe((data: any)=> {
      this.appConfig.hideLoader();
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
    this.adminService.sendMailOrEditAccess(apiData, this.popUpdata.value).subscribe((data: any)=> {
      this.appConfig.hideLoader();
      this.appConfig.success(this.popUpdata.value == 1 ? 'Mail Sent to the Candidates Successfully' : 'Edit Access given to the Candidates Successfully');
      this.ngOnInit();
    });
  }
  // To get all users
  getUsersList() {
    const role = this.appConfig.getLocalData('roles');
    const apiData = {
      company: role == 'ic' ? this.appConfig.getLocalData('userId') : ''
    }
    this.adminService.SelectedCandidatesList(apiData).subscribe((datas: any) => {
      this.userList = datas ? datas : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['verified'] = element['verified'] == '1' ? 'Verified' : 'Verify';
        element['is_editable'] = element['mailed'] == 'Not Sent' ? '-' : (element['mailed'] == 'Sent' && element['is_editable'] == 'No') ? 'Submitted' : 'Open';
        element['is_checked'] = element['decline_status'] == '1' ? '' : false;
        element['decline_status'] = element['decline_status'] == '1' ? 'Yes' : 'No';
        element['details'] = count;
      });
      this.appConfig.hideLoader();
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
    this.adminService.documentsDownload(sendReq).subscribe((data: any) => {
      this.appConfig.hideLoader();
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
