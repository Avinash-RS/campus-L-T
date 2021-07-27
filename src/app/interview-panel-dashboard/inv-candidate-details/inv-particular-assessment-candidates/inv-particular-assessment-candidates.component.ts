import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';

@Component({
  selector: 'app-inv-particular-assessment-candidates',
  templateUrl: './inv-particular-assessment-candidates.component.html',
  styleUrls: ['./inv-particular-assessment-candidates.component.scss']
})
export class InvParticularAssessmentCandidatesComponent implements OnInit {


  @Output() enableCriteriaComponent = new EventEmitter<boolean>();
  selectedUserDetail: any;
  userList: any;
  buttonCheck;
  selectAllCheck;
  assessmentName: any;
  nameOfAssessment: any;
  displayNoRecords = false;
  getSelectedCandidates: any;
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
  rowData: any = [];
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  gridColumnApi: any;
  isChecked: boolean;
  public rowSelection;
  public isRowSelectable;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: 'work.svg',
        name: 'Assigned Candidates',
        router: CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST,
        active: true
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    // this.editRouteParamGetter();
  }

  ngOnInit() {
    this.buttonCheck = false;
    this.getSelectedCandidates = [];
    this.tabledef();
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.assessmentDetails(params['data']);
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
    if (event.colDef.field === 'candidate_name') {
      const data = {
        candidateId: event['data'] && event['data']['uid'] ? event['data']['uid'] : '',
        candidateName: event['data'] && event['data']['candidate_name'] ? event['data']['candidate_name'] : '',
      };
      this.openDialog4(CommonKycProfileViewComponent, data);
    }

    if (event.colDef.field === 'evaluation_btn') {
      if (event['data'] && event['data']['evaluation_status'] != '2') {
        this.submit(event['data']['candidate_id'], event['data']['candidate_name'], event['data']['evaluation_status'], event['data']['tag'], event['data']['uid'], event['data']['email'], event['data']['form_id']);
      }
    }

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
    }
  }
  tabledef() {
    this.columnDefs = [ 
      {
        headerCheckboxSelection: true,
        Width: 50,
        maxWidth:50,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        field: 'is_checked',
        headerName: ''
      }, 
      {
        headerName: 'Candidate Name', field: 'candidate_name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        Width: 170,
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
        headerName: 'CID', field: 'candidate_id',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        Width: 100,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date/Time of Interview', field: 'datetime_Interview',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth:180,
        Width: 180,
        sortable: true,
        tooltipField: 'datetime_Interview'
      },
      {
        headerName: 'Assigned By', field: 'datetime_Interview',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        Width: 120,
        sortable: true,
        tooltipField: 'datetime_Interview'
      },
      {
        headerName: 'Interview Status', field: 'datetime_Interview',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        Width: 170,
        sortable: true,
        tooltipField: 'datetime_Interview'
      },
      {
        headerName: ' ', field: 'evaluation_status_1',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        Width: 120,
        sortable: true,
        tooltipField: 'evaluation_status_1',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: ' ', field: 'evaluation_btn',
        filter: false,
        floatingFilterComponentParams: { suppressFilterButton: false }, 
        Width: 90,
        sortable: false,
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' },
        cellRenderer: (params) => {
          if (params['data'] && params['data']['evaluation_status'] == '2') {
            return `<button class="table-btn agTable disabled-ag" mat-raised-button>Evaluated</button>`;
          } else {
            return `<button class="table-btn agTable" mat-raised-button>Evaluate</button>`;
          }
        },
      }
    ];
    this.rowSelection = 'multiple';
    this.isRowSelectable = function (rowNode) {
      return rowNode.data ? rowNode.data.evaluation_status == '1' : false;
    };
    this.getUsersList();
  }

  assessmentDetails(name) {
    const apidata = {
      shortlist_name: name
    };

    this.adminService.hrEvaluationParticularAssessmentDetailsHeader(apidata).subscribe((data: any) => {
      // this.appConfig.hideLoader();
      this.assessmentName = data;
      this.getUsersList();

    }, (err) => {

    });
  }


  // To get all users
  getUsersList() {

    // const apiData = {
    //   shortlist_name: name,
    // };
    const apiData = {
      inv_id: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
    };

    this.adminService.invSubmittedCandidatesList(apiData).subscribe((datas: any) => {
      this.appConfig.hideLoader();

      const align = datas ? datas : [];
      let counting = 0;
      this.userList = [];
      align.forEach(element => {
        if (element) {
          counting = counting + 1;
          element['counter'] = counting;
          element['evaluation_btn'] = element.evaluation_status;
          if (element.evaluation_status == '1') {
            this.buttonCheck = true;
          }
          element['evaluation_status_1'] = element.evaluation_status && element.evaluation_status == '2' ? 'submitted' : element.evaluation_status == '1' ? 'completed' : 'waiting';
          this.userList.push(element);
        }
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  submit(cid, name, status, tag, uid, email, form) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION, { data: this.nameOfAssessment ? this.nameOfAssessment : '', id: cid ? cid : '', name: name ? name : '', status: status ? status : '', tag: tag ? tag : '', uid: uid ? uid : '', email: email ? email : '', form: form ? form : '' });
  }

  finalSubmit() {

    if(this.gridApi.getSelectedNodes().length > 0) {
      this.getSelectedCandidates = this.gridApi.getSelectedNodes();
      const data = {
        evaluation: 'candidates'
      };
      this.openDialog(ShortlistBoxComponent, data);
    } else {
      this.appConfig.nzNotification('error', 'Not selected', 'No candidates have been selected');
    }
  }
  finalSubmitAPI() {
    const apiData = {
      userid: []
    };
    this.getSelectedCandidates.forEach(element => {
      if (element) {
        apiData['userid'].push(element['data'] && element['data']['uid'] ? element['data']['uid'] : '');
      }
    });
    this.adminService.invSubmittingCandidates(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const datas = {
        iconName: '',
        dataToBeShared: {
          confirmText: `Selected candidates have been submitted successfully`,
          type: 'assign-hr',
          identity: 'panel-assign'
        },
        showConfirm: 'Confirm',
        interViwePanelAssign: 'noData',
        showCancel: '',
        showOk: ''
      };
      this.openDialog(ShortlistBoxComponent, datas);

      // this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_SUBMITTED, { data: this.nameOfAssessment });
    }, (err) => {

    });
  }


  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finalSubmitAPI();
      }
      if (data && data['interViwePanelAssign']) {
        this.ngOnInit();
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
      const dialogRef = this.matDialog.open(component, {
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

}
