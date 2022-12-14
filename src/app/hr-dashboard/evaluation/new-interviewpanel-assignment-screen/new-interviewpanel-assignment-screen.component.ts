import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter,TemplateRef, OnDestroy } from '@angular/core';
import { MatDialog, MatExpansionPanel, MatAccordion } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { FormBuilder } from '@angular/forms';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ScheduleInterviewPopupComponent } from '../../pages/schedule-interview-popup/schedule-interview-popup.component';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';

@Component({
  selector: 'app-new-interviewpanel-assignment-screen',
  templateUrl: './new-interviewpanel-assignment-screen.component.html',
  styleUrls: ['./new-interviewpanel-assignment-screen.component.scss']
})

export class NewInterviewpanelAssignmentScreenComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatExpansionPanel, {static: false}) pannel?: MatExpansionPanel;
  @ViewChild('firstAccordion', {static: false}) firstAccordion: MatAccordion;
  @Output() enableCriteriaComponent = new EventEmitter<boolean>();
  @ViewChild('withSchedulingConfirmationBox', {static: false}) withSchedulingConfirmationBox: TemplateRef<any>;
  fltractive= false;
  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  selectAllCheckHR;
  notShowReject: boolean = true;
  showDefault = true;
  selectedAssign: any;
  selectedCandidateId: any = [];
  buttonHide;
  displayNoRecords = false;
  urlParsedData: any;
  assessmentName: any;
  selectedShortlistname: any;
  selectedInstitute: any;
  selectedEdu: any;
  selectedStatus: any = 'all';
  selectedHRDiscipline: any;
  allInstitutes: any;
  allDisciplines: any;
  EduLevel = DropdownListForKYC['level'];
  allEducations: any;
  allAssessments: any;
  confirmationValue: any = '1';
  statusList = [
    {
      name: 'All',
      value: 'all'
    },
    {
      name: 'Unassigned',
      value: '0'
    },
    {
      name: 'Assigned',
      value: '1'
    }
  ];
  allHRDisciplines: any;
  userListHR: any;
  selectedUserDetailHR: any;
  public statusBar = {
  statusPanels: [
  // { statusPanel: 'agTotalRowCountComponent', align: 'left'},
  { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
  { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
  { statusPanel: 'agAggregationComponent', align: 'right' },
  ],
  };
  public statusBarHR = {
    statusPanels: [
    // { statusPanel: 'agTotalRowCountComponent', align: 'left'},
    { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
    { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
    { statusPanel: 'agAggregationComponent', align: 'right' },
    ],
    };


  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef:any
  rowData: any = [];
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  gridColumnApi: any;
  isChecked: boolean;

  paginationPageSizeHR = 500;
  cacheBlockSizeHR: any = 500;
  gridApiHR: any;
  columnDefsHR = [];
  defaultColDefHR:any
  rowDataHR: any = [];
  searchBoxHR = false;
  filterValueHR: string;
  quickSearchValueHR = '';
  gridColumnApiHR: any;
  isCheckedHR: boolean;
  panelOpenState = true;


  selectedCandidate = [];
  selectedInterviewer = [];
  attendeesList = [];
  routeAssignedData: any;
  allShortlistNames: any = [];
  scheduleConfirmationPopUp: any;
  buttonLoading = false;
  refreshSubscription: Subscription;
  getParticularCandidatelistSubscription: Subscription;
  getInterviewpanelInstitutesSubscription: Subscription;
  getShortlistNamesSubscription: Subscription;
  getDisciplineSubscription: Subscription;
  getParticularInterviewpanelistSubscription: Subscription;
  assignToHRSubscription: Subscription;
  scheduleRoomsSubscription: Subscription;
  customerCode = this.appConfig.getSelectedCustomerCode();
  constructor(
    public appConfig: AppConfigService,
    private router: Router,
    private adminService: AdminServiceService,
    private fb: FormBuilder,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private glovbal_validators: GlobalValidatorService
  ) {
    this.editRouteParamGetter();
  }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.defaultColDefHR = this.appConfig.agGridWithAllFunc();
    this.tabledefHR();
    this.getShortlistNames();
    this.getInstitute();
    this.getHRDisciplines();
    this.getEducation();
    this.particularInvpanelist(this.selectedHRDiscipline);
    this.refreshOndriveChangeRXJS();
  }

  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['shortlist_name']) {
        this.selectedShortlistname = params['shortlist_name'];
        this.selectedStatus = 'all';
        this.candidateFilterApply();
      } else {
      }
    });
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.getParticularCandidatelistSubscription ? this.getParticularCandidatelistSubscription.unsubscribe() : '';
    this.getInterviewpanelInstitutesSubscription ? this.getInterviewpanelInstitutesSubscription.unsubscribe() : '';
    this.getShortlistNamesSubscription ? this.getShortlistNamesSubscription.unsubscribe() : '';
    this.getDisciplineSubscription ? this.getDisciplineSubscription.unsubscribe() : '';
    this.getParticularInterviewpanelistSubscription ? this.getParticularInterviewpanelistSubscription.unsubscribe() : '';
    this.assignToHRSubscription ? this.assignToHRSubscription.unsubscribe() : '';
    this.scheduleRoomsSubscription ? this.scheduleRoomsSubscription.unsubscribe() : '';
    }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT)) {
        this.clearAllDatas();
        this.getShortlistNames();
        this.getInstitute();
        this.tabledef();
        }
    });
  }

  clearAllDatas() {
    this.quickSearchValue = '';
    this.selectedShortlistname = null;
    this.selectedInstitute = null;
    this.selectedEdu = null;
    this.selectedStatus = 'all';
    this.userList = null;
    this.rowData = null;
    this.fltractive = false;
    this.selectedCandidate = [];
    this.pannel.open();
  }
  ngAfterViewInit() {
     // Hack: Scrolls to top of Page after page view initialized
     let top = document.getElementById('top');
     if (top !== null) {
       top.scrollIntoView();
       top = null;
     }
    }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabledef();
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
    if (event.colDef.field === 'email' && event['data'] && (event['data']['level'] && event['data']['level'] != ' ')) {
        const data = {
          candidate_user_id: event['data'] && event['data']['uid'] ? event['data']['uid'] : '',
          candidateName: event['data'] && event['data']['name'] ? event['data']['name'] : '',
        };
        this.openDialog5(CommonKycProfileViewComponent, data);
    }
  }

  getModel(e) {
    this.gridApi.deselectAll();
    // console.log(e);
    setTimeout(() => {
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Candidate Not Found');
      // this.appConfig.nzNotification('error', 'Candidate Not Found', 'No search results found');
    }
  }, 500);
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Candidate Not Found');
      // this.appConfig.nzNotification('error', 'Candidate Not Found', 'No global search results found');
    }
  }

  WithoutVideoSchedulingColumns() {
    return [
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
        headerName: 'Candidate Email ID', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          if (params['data']['level'] && params['data']['level'] != ' ') {
            return `<span style="border-bottom: solid #1b4e9b 1px; cursor: pointer; color: #1b4e9b;">${params['data']['email']} </span>`;
          } else {
            return `${params['data']['email']}`
          }
        }
      },
      {
        headerName: 'Status', field: 'hr_assign_status',
        filter: 'agSetColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'hr_assign_status',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Assigned Panel Count', field: 'panel_count',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'panel_count',
        valueGetter: (params) => {
          return params && params.data &&  params.data.panel_count ? Number(params.data.panel_count) : 0
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Is KYC Skipped', field: 'kyc_exempted',
        filter: 'agSetColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'kyc_exempted',
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
        getQuickFilterText: (params) => {
          return params.value;
        }
      }
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

  tabledef() {
    if (this.appConfig.getSelectedDrivePermissions().video_assessment) {
      let defaultCol: any = this.WithoutVideoSchedulingColumns();
      let mergeCol = defaultCol.concat(this.WithVideoSchedulingColumns());
      this.gridApi.setColumnDefs(mergeCol);
    } else {
      this.gridApi.setColumnDefs(null);
      this.gridApi.setColumnDefs(this.WithoutVideoSchedulingColumns());
    }
  }

  //  HR
  onGridReadyHR(params: any) {
    this.gridApiHR = params.api;
    this.gridColumnApiHR = params.columnApi;
  }

  sorteventHR(e) {
  }

  customComparatorHR = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClickedHR(event) {
  }

  getModelHR(e) {
    this.gridApiHR.deselectAll();
    // console.log(e);
    setTimeout(() => {
    const filteredArray = this.gridApiHR.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Interview Panel Not Found');
      // this.appConfig.nzNotification('error', 'Interview Panel Not Found', 'No search results found');
    }
  }, 500);
  }

  onQuickFilterChangedHR() {
    this.gridApiHR.setQuickFilter(this.quickSearchValueHR);
    const filteredArray = this.gridApiHR.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Interview Panel Not Found');
      // this.appConfig.nzNotification('error', 'Interview Panel Not Found', 'No global search results found');
    }
  }
  tabledefHR() {
    this.columnDefsHR = [
      {
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        maxWidth: 50,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        suppressMenu: true,
        field: 'is_checkedHR',
        headerName: ''
      },
      {
        headerName: 'Employee name', field: 'employee_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'employee_name',
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
        headerName: 'Email', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
  }


  candidateFilterApply() {
    const apiData = {
      shortlist_name: this.selectedShortlistname ? this.selectedShortlistname : '',
      college_name: this.selectedInstitute ? this.selectedInstitute : '',
      education_level: this.selectedEdu ? this.selectedEdu : '',
      status: this.selectedStatus ? (this.selectedStatus == 'all' ? '' : this.selectedStatus) : ''
    }
    this.buttonLoading = true;
    this.getParticularCandidatelistSubscription = this.adminService.getParticularCandidatelist(apiData).subscribe((data: any) => {
      this.buttonLoading = false;
      const datas = data ? data : [];
      if(!this.pannel) {
        return
     } else {
       datas.length > 0 ? this.pannel.close() : '';
     }
      this.showDefault = false;
      this.routeAssignedData = apiData;
      this.getUsersList(datas);
    }, (err) => {
      this.buttonLoading = false;
    });
  }
  interviewPanelFilterApply(data) {
    this.particularInvpanelist(data);
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
   this.getInterviewpanelInstitutesSubscription = this.adminService.getInterviewpanelInstitutes().subscribe((data: any) => {

      this.allInstitutes = data ? data : [];
    }, (err) => {
    });
  }

  getShortlistNames() {
    this.getShortlistNamesSubscription = this.adminService.getAllShortlistedShortlistNames().subscribe((data: any) => {
      this.allShortlistNames = data ? data : [];
    }, (err) => {
    });
  }

  getHRDisciplines() {
   this.getDisciplineSubscription = this.adminService.getDiscipline().subscribe((data: any) => {

      this.allHRDisciplines = data ? data : [];
    }, (err) => {
    });
  }


  particularInvpanelist(data) {
    const apiData = {
      discipline: data ? data : ''
    }
   this.getParticularInterviewpanelistSubscription = this.adminService.getParticularInterviewpanelist(apiData).subscribe((data: any) => {

      const datas = data ? data : [];
      this.getUsersList1(datas);
    }, (err) => {
    });
  }

  instituteChange() {

  }

  hrDiciplineChange(data) {
  }

  // To get all users
  getUsersList(data) {
      this.userList = data;
      let count = 0;
      this.userList.forEach(element => {
        element['checked'] = false;
        element['hr_assign_status'] = element['hr_assign_status'] == 1 ? 'Assigned' : 'Unassigned';
        element['kyc_exempted'] = element['kyc_exempted'] == 1 ? 'Yes' : 'No';
        count = count + 1;
        element['sid'] = count;
        if (element && element['level'] == 'UG') {
          element['level'] = 'Undergraduate';
        }
        if (element && element['level'] == 'PG') {
          element['level'] = 'Postgraduate';
        }
      });
      this.rowData = this.userList;
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

    // To get all users
    getUsersList1(data) {
      this.userListHR = data ? data : [];
        let count = 0;
        this.userListHR.forEach(element => {
          element['checked'] = false;
          count = count + 1;
          element['uid'] = count;
        });
        this.rowDataHR = this.userListHR;
    }


  assigntoPanel(apiData) {
   this.assignToHRSubscription = this.adminService.assignToHR(apiData).subscribe((data: any) => {

       const datas = {
          iconName: '',
          dataToBeShared: {
            confirmText: `Candidate has been successfully assigned to respective interview panels`,
            type: 'assign-hr',
            identity: 'panel-assign'
          },
          showConfirm: 'Confirm',
          interViwePanelAssign: 'noData',
          showCancel: '',
          showOk: ''
        };
        this.matDialog.closeAll();
        this.openDialog1(ShortlistBoxComponent, datas, this.routeAssignedData);
    }, (err) => {
    });
  }
  scheduleHirerachy(){
    const selectedUserlist = this.gridApi.getSelectedNodes();
    const selectedUserlistHR = this.gridApiHR.getSelectedNodes();
    const candidateID = [];
    const HRID = [];
    selectedUserlist.forEach(element => {
      if (element['data']) {
        candidateID.push(element['data']['email'])
      }
    });

    selectedUserlistHR.forEach(element => {
      if (element['data']) {
        HRID.push(element['data']['email'])
      }
    });
    const apiData = {
      user_email: candidateID,
      hr_email: HRID,
      shortlist_name: this.selectedShortlistname,
      field_user_created_by: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
    };
    this.assigntoPanel(apiData);
  }
  submit() {
    const selectedUserlist = this.gridApi.getSelectedNodes();
    const selectedUserlistHR = this.gridApiHR.getSelectedNodes();
    const candidateID = [];
    const HRID = [];
    selectedUserlist.forEach(element => {
      if (element['data']) {
        candidateID.push(element['data']['email'])
      }
    });

    selectedUserlistHR.forEach(element => {
      if (element['data']) {
        HRID.push(element['data']['email'])
      }
    });
    let data;
    if (candidateID.length > 0 && HRID.length > 0) {
      data = {
        iconName: '',
        dataToBeShared: {
          confirmText: `Are you sure you want to assign these panels?`,
          type: 'assign-hr',
          identity: 'panel-assign'
        },
        showConfirm: 'Confirm',
        interViwePanelAssign: 'assign',
        candidateCount: candidateID.length,
        panel: HRID.length,
        candidate: candidateID.length == 1 ? 'Candidate' : 'Candidates',
        member: HRID.length == 1 ? 'member' : 'members',
        showCancel: 'Cancel',
        showOk: ''
      };
    } else {
      if (candidateID.length < 1 && HRID.length < 1) {
        data = {
          iconName: '',
          dataToBeShared: {
            confirmText: `No candidates and interview panels has been selected`,
            type: 'assign-hr',
            identity: 'panel-assign'
          },
          showConfirm: 'Confirm',
          interViwePanelAssign: 'noData',
          showCancel: '',
          showOk: ''
        };
      } else {
          data = {
            iconName: '',
            dataToBeShared: {
              confirmText: candidateID.length < 1 ? `No candidates has been selected` : HRID.length < 1 ? 'No interview panel has been selected' : '',
              type: 'assign-hr',
              identity: 'panel-assign'
            },
            showConfirm: 'Confirm',
            interViwePanelAssign: 'noData',
            showCancel: '',
            showOk: ''
      }

    }
  }
    const apiData = {
      user_email: candidateID,
      hr_email: HRID,
      shortlist_name: this.selectedShortlistname,
      field_user_created_by: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
    };
    this.openDialog(ShortlistBoxComponent, data, apiData);
  }

  openDialog(component, data, apiData) {
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
        this.assigntoPanel(apiData);
      }
    });
  }

  openDialog1(component, data, apiData) {
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
      this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED, {data: JSON.stringify(this.routeAssignedData)});
    });
  }

  scheduleInterview(){
    if(this.selectedCandidate.length == 0){
      this.appConfig.warningWithTitle('Please select a candidate','');
      return false;
    }
    if(this.selectedCandidate.length > 1 && this.customerCode != '#ADANI'){
      this.appConfig.warningWithTitle('Please select one candidate at a time','');
      return false;
    }
    if(this.selectedInterviewer.length == 0){
      this.appConfig.warningWithTitle('Please select a interviewer','');
      return false;
    }
    this.attendeesList = this.selectedCandidate.concat(this.selectedInterviewer);
    const dialogRef = this.matDialog.open(ScheduleInterviewPopupComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data: {list: this.attendeesList, candidateCount: this.selectedCandidate.length, panelCount: this.selectedInterviewer.length},
      disableClose: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.processAssign) {
        this.scheduleHirerachy();
      }
    });
  }

    onCandidateSelect(e) {
      const selectedRows = e.api.getSelectedRows();
      // tslint:disable-next-line: prefer-const
      let sData = [];
      selectedRows.forEach((d) => {
        d.type = 'candidate'
        sData.push(d);
      });
      this.selectedCandidate = sData;
    }

    onInterviewerSelect(e) {
      const selectedRows = e.api.getSelectedRows();
      // tslint:disable-next-line: prefer-const
      let sData = [];
      selectedRows.forEach((d) => {
        d.type = 'interviewer'
        sData.push(d);
      });
      this.selectedInterviewer = sData;
    }

  togglefltr() {
    this.fltractive = !this.fltractive
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
     return split;
    }
  }

  openConfirmationPopUp() {
    if (this.appConfig.getSelectedDrivePermissions().interview_assignment) {
    this.scheduleConfirmationPopUp = this.matDialog.open(this.withSchedulingConfirmationBox, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirmation-popup'
    });
  } else {
    this.submit();
  }
  }
  confirmConfirmation() {
    this.scheduleConfirmationPopUp.close();
    if (this.confirmationValue == '1') {
      this.scheduleInterview();
    } else {
      this.submit();
    }
  }
  cancelConfirmation() {
    this.scheduleConfirmationPopUp.close();
  }

        // Open dailog
        openDialog5(component, data) {
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
