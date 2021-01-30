import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatExpansionPanel, MatAccordion } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

@Component({
  selector: 'app-new-interviewpanel-assignment-screen',
  templateUrl: './new-interviewpanel-assignment-screen.component.html',
  styleUrls: ['./new-interviewpanel-assignment-screen.component.scss']
})

export class NewInterviewpanelAssignmentScreenComponent implements OnInit, AfterViewInit {

  @ViewChild(MatExpansionPanel, {static: false}) pannel?: MatExpansionPanel;
  @ViewChild(MatAccordion, {static: false}) accordion?: MatAccordion;
  @Output() enableCriteriaComponent = new EventEmitter<boolean>();
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
  selectedInstitute: any;
  selectedDiscipline: any;
  selectedEdu: any;
  selectedAssessment: any;
  selectedStatus: any = '0';
  selectedHRDiscipline: any;
  allInstitutes: any;
  allDisciplines: any;
  EduLevel = DropdownListForKYC['level'];
  allEducations: any;
  allAssessments: any;
  statusList = [
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

  paginationPageSizeHR = 500;
  cacheBlockSizeHR: any = 500;
  gridApiHR: any;
  columnDefsHR = [];
  defaultColDefHR = {
    flex: 1,
    minWidth: 40,
    resizable: true,
    floatingFilter: true,
    lockPosition: true,
    suppressMenu: true,
    unSortIcon: true,
  };
  rowDataHR: any = [];
  searchBoxHR = false;
  filterValueHR: string;
  quickSearchValueHR = '';
  gridColumnApiHR: any;
  isCheckedHR: boolean;
  panelOpenState = true;

  routeAssignedData: { college_name: any; discipline: any; education_level: any; assement_name: any; status: any; };

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
    //   {
    //     icon: '002-cv.svg',
    //     name: 'Candidate details',
    //     router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS
    //   },
    //   {
    //     icon: '002-cv.svg',
    //     name: 'Interview panel',
    //     router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL,
    //     active: true
    //   },
    {
      icon: '002-cv.svg',
      name: 'Interview panel assign',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT
    },
    {
      icon: '002-cv.svg',
      name: 'Assigned details',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED
    },
    {
      icon: '002-group-1.svg',
      name: 'Bulk assign',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_RESULTS_UPLOAD
    }

    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
    this.tabledef();
    this.tabledefHR();
    this.getInstitute();
    this.getHRDisciplines();
    this.getEducation();
    this.particularInvpanelist(this.selectedHRDiscipline);
    this.appConfig.scrollToTop();
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
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
  }

  getModel(e) {
    // console.log(e);

    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Candidate Not Found');
      // this.appConfig.nzNotification('error', 'Candidate Not Found', 'No search results found');
    }
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Candidate Not Found');
      // this.appConfig.nzNotification('error', 'Candidate Not Found', 'No global search results found');
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
        headerName: 'Candidate name', field: 'name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'discipline', field: 'discipline',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Education level', field: 'level',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'level',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
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
    // console.log(e);

    const filteredArray = this.gridApiHR.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Interview Panel Not Found');
      // this.appConfig.nzNotification('error', 'Interview Panel Not Found', 'No search results found');
    }
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
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'employee_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email', field: 'email',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
  }


  go() {
    const apiData = {
      college_name: this.selectedInstitute ? this.selectedInstitute : '',
      discipline: this.selectedDiscipline ? this.selectedDiscipline : '',
      education_level: this.selectedEdu ? this.selectedEdu : '',
      assement_name: this.selectedAssessment ? this.selectedAssessment : '',
      status: this.selectedStatus ? this.selectedStatus : ''
    }
    this.adminService.getParticularCandidatelist(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      if(!this.pannel) { return } else {this.pannel.close()}
      const datas = data ? data : [];
      this.showDefault = false;
      this.routeAssignedData = apiData;
      this.getUsersList(datas);
    }, (err) => {
    });
  }
  HRgo(data) {
    this.particularInvpanelist(data);
  }

  getEducation() {
    let Temp = this.EduLevel ? this.EduLevel : [];
    const final = [];
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
    this.allEducations = final ? final : [];
  }

  getInstitute() {
    this.adminService.getInterviewpanelInstitutes().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.allInstitutes = data ? data : [];
    }, (err) => {
    });
  }

  getHRDisciplines() {
    this.adminService.getDiscipline().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.allHRDisciplines = data ? data : [];
    }, (err) => {
    });
  }

  getParticularAssessmentAndDiscipline(data) {
    const apiData = {
      institute: data ? data : ''
    }
    this.adminService.getParticularInstituteDiscipline(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.allAssessments = data && data['assement_name'] ? data['assement_name'] : [];
      this.allDisciplines = data && data['discipline_array'] ? data['discipline_array'] : [];
    }, (err) => {
    });
  }

  instituteChangeForDiscipline(data) {
    this.selectedDiscipline = null;
    this.selectedAssessment = null;
    this.getParticularAssessmentAndDiscipline(data);
  }

  particularInvpanelist(data) {
    const apiData = {
      discipline: data ? data : ''
    }
    this.adminService.getParticularInterviewpanelist(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const datas = data ? data : [];
      this.getUsersList1(datas);
    }, (err) => {
    });
  }

  instituteChange() {

  }

  hrDiciplineChange(data) {
  }
  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.urlParsedData = params['data'] ? JSON.parse(params['data']) : '';
      this.getUsersList(this.urlParsedData);
    });
  }

  // To get all users
  getUsersList(data) {
      this.userList = data;
      let count = 0;
      this.userList.forEach(element => {
        element['checked'] = false;
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
    this.adminService.assignToHR(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
       const datas = {
          iconName: '',
          dataToBeShared: {
            confirmText: `Candidates have been successfully assigned to respective interview panels`,
            type: 'assign-hr',
            identity: 'panel-assign'
          },
          showConfirm: 'Confirm',
          interViwePanelAssign: 'noData',
          showCancel: '',
          showOk: ''
        };
        this.openDialog1(ShortlistBoxComponent, datas, this.routeAssignedData);
    }, (err) => {
    });
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

}
