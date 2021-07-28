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
import * as moment from 'moment'; //in your component

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
    floatingFilter: false,
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
  selectedCount: any = [];
  rejectedCount: any = [];
  scheduleListDetails: any;
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
  }

  ngOnInit() {
    this.buttonCheck = false;
    this.getSelectedCandidates = [];
    this.tabledef();
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

    if (event.colDef.field === 'join_interview') {
      if (event['data'] && event['data']['join_interview'] == 'yes') {
        this.submit(event['data']['candidate_id'], event['data']['candidate_name'], event['data']['evaluation_status'], event['data']['tag'], event['data']['uid'], event['data']['email'], event['data']['form_id']);
        // this.openInterview(event['data']['link']);
      }
    }
  }

  openInterview(link) {
    console.log('link', link);
    const filterLink = link.find(element=> element.type == 'interviewer');
    if (filterLink && filterLink.link) {
      window.open(filterLink && filterLink.link, 'webrtc');
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
        minWidth: 180,
        sortable: true,
        tooltipField: 'candidate_name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#C02222' },
        // cellRenderer: (params) => {
        //   if (params['data'] && params['data']['evaluation_status_1'] == 'completed') {
        //     return `<span class="status completed ">Completed</button>`;
        //   }
        //   if (params['data'] && params['data']['evaluation_status_1'] == 'submitted') {
        //     return `<span class=" status ">Submitted</button>`;
        //   }
        //   else {
        //     return `<span class="status ">Schedule</button>`;
        //   }
        // },

        cellRenderer: (params) => {
          return `<span style="cursor: pointer"><span class="profileAvatar"><img src="${params['data']['profile_image_url']}"></span> <span>${params['data']['candidate_name']}</span> </span>`;
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
        headerName: 'Date/Time of Interview', field: 'startTime',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth:200,
        Width: 200,
        sortable: true,
        tooltipField: 'startTime'
      },
      {
        headerName: 'Assigned By', field: 'assigned_by',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        Width: 100,
        sortable: true,
        tooltipField: 'assigned_by'
      },
      {
        headerName: 'Interview Status', field: 'evaluation_status_1',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 160,
        sortable: true,
        tooltipField: 'evaluation_status_1',
        cellRenderer: (params) => {
          if (params['data'] && params['data']['evaluation_status_1'] == 'completed') {
            return `<span class="status completed ">Completed</button>`;
          }
          if (params['data'] && params['data']['evaluation_status_1'] == 'submitted') {
            return `<span class=" status ">Submitted</button>`;
          }
          else {
            return `<span class="status ">Schedule</button>`;
          }
        },
      },
      {
        headerName: '', field: 'join_interview',
        filter: false,
        floatingFilterComponentParams: { suppressFilterButton: false },
        minWidth: 150,
        sortable: false,
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' },
        cellRenderer: (params) => {
          if (params['data'] && params['data']['join_interview'] == 'yes') {
            return `<button class="join-inter"><em class="icon-Join_Video"></em> Join Interview</button>`;
          } else {
            return `<button class="join-inter disabled"><em class="icon-Join_Video"></em> Time Expired</button>`;
          }
        },
      },
      {
        headerName: '', field: 'evaluation_btn',
        filter: false,
        floatingFilterComponentParams: { suppressFilterButton: false },
        minWidth: 110,
        sortable: false,
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' },
        cellRenderer: (params) => {
          if (params['data'] && (params['data']['evaluation_status'] == '1' || params['data']['evaluation_status'] == '2')) {
            return `<button class=" btn-outline checked"><em class="icon-checked"></em>Evaluated</button>`;
          } else {
            return `<button class=" btn-outline">Evaluate</button>`;
          }
        },
      },
      {
        headerName: 'Status', field: 'interview_status',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 110,
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' },
        cellRenderer: (params) => {
          if (params['data'] && params['data']['interview_status'] == 'Selected') {
            return `<span class="status completed">Selected</span>`;
          }
          if (params['data'] && params['data']['interview_status'] == 'Not Selected') {
            return `<span class="status rejected">Rejected</span>`;
          }
          else {
            if (params['data'] && params['data']['interview_status']) {
              return `<span class="status" >${params['data']['interview_status']}</span>`;
            } else {
              return '';
            }
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


  getInterview(){
    var obj = {
      'userDtl.emailId': this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : ''
    }
    this.adminService.getScheduledList(obj).subscribe((result:any)=>{
      if(result.success){
        this.scheduleListDetails = result.data;
        this.scheduleListDetails.forEach((element, i) => {
          element.assigned_by = element.createdByName ? element.createdByName : '-';
          if (element.userDtl) {
            element.link = element.userDtl && element.userDtl ? element.userDtl : '';
            let candidateData = this.removeInterviewer(element.userDtl);
            element.emailId = candidateData && candidateData.emailId ? candidateData.emailId : '';
          }
        });
        this.mergePhpAndEdgeService(this.scheduleListDetails);
      } else {
        this.rowData = this.userList;
        this.appConfig.hideLoader();
      }
    }, (err)=> {
      this.appConfig.hideLoader();
      this.rowData = this.userList;
    })
  }

  mergePhpAndEdgeService(edgeSeviceData) {
    this.userList.forEach(element => {
      edgeSeviceData.forEach(edgeData => {
        if (element.email == edgeData.emailId) {
          if (element.evaluation_status == '1') {
            this.buttonCheck = true;
          }
          element.startTime = this.momentForm(edgeData.startTime);
          element.endTime = this.momentForm(edgeData.endTime);
          element.join_interview = this.isTimeExpired(edgeData.startTime, edgeData.endTime);
        }
      });
    });

    this.userList = this.userList.filter(element => element.startTime);
    this.rowData = this.userList;
    this.appConfig.hideLoader();
    this.getSummaryCount();
    console.log('usr', this.userList)
  }

  isTimeExpired(startTime, endTime) {
    if (startTime && endTime) {
      let custom = moment(endTime).diff(moment.now(), 'minutes');
      if (custom > 0) {
        return 'yes'; // Not expired
      }
      return 'yes'; // Expired
    }
  }

  removeInterviewer(userDetail) {
   return userDetail.find(element => element.type == 'candidate');
  }

  getSummaryCount() {
    this.selectedCount = [];
    this.rejectedCount = [];
    this.userList.forEach(element => {
      if (element.interview_status == 'Selected' || element.interview_status == 'Not Selected') {
        element.interview_status == 'Selected' ? this.selectedCount.push(element) : this.rejectedCount.push(element);
      }
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

      const align = datas ? datas : [];
      let counting = 0;
      this.userList = [];
      align.forEach(element => {
        if (element) {
          counting = counting + 1;
          element['counter'] = counting;
          element['evaluation_btn'] = element.evaluation_status;
          element['evaluation_status_1'] = element.evaluation_status && element.evaluation_status == '2' ? 'submitted' : element.evaluation_status == '1' ? 'completed' : 'schedule';
          this.userList.push(element);
        }
      });
      this.getInterview();
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

  momentForm(date) {
    if (date) {
      const split = moment(date).format('LLL');
      return split;
    }
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
