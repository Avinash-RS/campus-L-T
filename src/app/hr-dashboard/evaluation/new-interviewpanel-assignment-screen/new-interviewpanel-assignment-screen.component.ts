import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
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

  // displayedColumns: any[] = ['uid', 'user_name', 'candidate_id', 'email', 'level', 'discipline', 'documents_submitted', 'interview_status', 'checked'];
  displayedColumns: any[] = ['checked', 'name', 'discipline', 'level'];
  displayedColumns1: any[] = ['checked', 'employee_name', 'discipline', 'email'];
  dataSource: MatTableDataSource<any>;
  dataSourceHR: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('paginatorHR', { static: true }) paginatorHR: MatPaginator;
  @ViewChild('sortHR', { static: true }) sortHR: MatSort;
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
      name: 'Interview panel Assign',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT
    },
    {
      icon: '002-cv.svg',
      name: 'Assigned details',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED
    }

    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
    this.getInstitute();
    this.getHRDisciplines();
    this.getEducation();
    this.particularInvpanelist(this.selectedHRDiscipline);
  }

  go() {
    this.selectAllCheck = false;
    const apiData = {
      college_name: this.selectedInstitute ? this.selectedInstitute : '',
      discipline: this.selectedDiscipline ? this.selectedDiscipline : '',
      education_level: this.selectedEdu ? this.selectedEdu : '',
      assement_name: this.selectedAssessment ? this.selectedAssessment : '',
      status: this.selectedStatus ? this.selectedStatus : ''
    }
    this.adminService.getParticularCandidatelist(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();      
      const datas = data ? data : [];
      this.showDefault = false;
      this.routeAssignedData = apiData;
      this.getUsersList(datas);
    }, (err) => {
    });
  }
  HRgo(data) {
    this.selectAllCheckHR = false;
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

  // particularCandidatepanelist(data) {
  //   const apiData = {
  //     discipline: data ? data : ''
  //   }
  //   this.adminService.getParticularInterviewpanelist(apiData).subscribe((data: any) => {
  //     this.appConfig.hideLoader();
  //     const datas = data ? data : [];
  //     this.getUsersList1(datas);
  //   }, (err) => {
  //   });
  // }

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
      this.toShoworNotShowFilter();
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
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }

    // To get all users
    getUsersList1(data) {
        this.userListHR = data ? data : [];
        this.toShoworNotShowFilterHR();
        let count = 0;
        this.userListHR.forEach(element => {
          element['checked'] = false;
          count = count + 1;
          element['uid'] = count;
        });
        this.dataSourceHR = new MatTableDataSource(this.userListHR);
        this.dataSourceHR.paginator = this.paginatorHR;
        this.dataSourceHR.sort = this.sortHR;
    }
  

  selectAllCheckbox(checked) {

    if (checked['checked']) {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.uid === ele.uid) {
            element.checked = true;
          }
        });
      });
    } else {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.uid === ele.uid) {
            element.checked = false;
          }
        });
      });
    }
    this.toShoworNotShowFilter();
  }

  selectAllCheckboxHR(checked) {

    if (checked['checked']) {
      this.userListHR.forEach(element => {
        this.dataSourceHR.filteredData.forEach(ele => {
          if (element.employee_id === ele.employee_id) {
            element.checked = true;
          }
        });
      });
    } else {
      this.userListHR.forEach(element => {
        this.dataSourceHR.filteredData.forEach(ele => {
          if (element.employee_id === ele.employee_id) {
            element.checked = false;
          }
        });
      });
    }
    this.toShoworNotShowFilterHR();
  }


  toShoworNotShowFilter() {
    let runElse = true;
    let selectedCount = 0;
    this.userList.forEach(element => {
      if (element.checked) {
        selectedCount += 1;
        this.buttonHide = false;
        runElse = false;
      } else {
        if (runElse) {
          this.buttonHide = true;
        }
      }
    });
  }

  toShoworNotShowFilterHR() {
    let runElse = true;
    let selectedCount = 0;
    this.userListHR.forEach(element => {
      if (element.checked) {
        selectedCount += 1;
        this.buttonHide = false;
        runElse = false;
      } else {
        if (runElse) {
          this.buttonHide = true;
        }
      }
    });
  }

  unselectSelectALL() {

    this.selectAllCheck = false;
    const pushChecked = [];
    const pushNotChecked = [];
    this.userList.forEach(element => {
      if (element.checked) {
        pushChecked.push(element);
      } else {
        pushNotChecked.push(element);
      }
    });

    if (this.userList.length === pushChecked.length) {
      this.selectAllCheck = true;
    }
  }
  unselectSelectALLHR() {

    this.selectAllCheckHR = false;
    const pushChecked = [];
    const pushNotChecked = [];
    this.userListHR.forEach(element => {
      if (element.checked) {
        pushChecked.push(element);
      } else {
        pushNotChecked.push(element);
      }
    });

    if (this.userListHR.length === pushChecked.length) {
      this.selectAllCheckHR = true;
    }
  }


  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    if (this.dataSourceHR) {
      this.dataSourceHR.paginator = this.paginatorHR;
      this.dataSourceHR.sort = this.sortHR;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // check search data is available or not
    if (this.dataSource.filteredData.length == 0) {
      this.displayNoRecords = true;
    } else {
      this.displayNoRecords = false;

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterHR(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceHR.filter = filterValue.trim().toLowerCase();

    // check search data is available or not
    if (this.dataSourceHR.filteredData.length == 0) {
      this.displayNoRecords = true;
    } else {
      this.displayNoRecords = false;
    }

    if (this.dataSourceHR.paginator) {
      this.dataSourceHR.paginator.firstPage();
    }
  }


  selectedUser(userDetail) {

    this.userList.forEach(element => {
      if (element.uid === userDetail.uid) {
        element.checked = !element.checked;
      }
    });
    this.selectedUserDetail = userDetail;

    this.toShoworNotShowFilter();
    this.unselectSelectALL();
  }

  selectedUserHR(userDetail) {

    this.userListHR.forEach(element => {
      if (element.employee_id === userDetail.employee_id) {
        element.checked = !element.checked;
      }
    });
    this.selectedUserDetailHR = userDetail;

    this.toShoworNotShowFilterHR();
    this.unselectSelectALLHR();
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
    const candidateID = [];
    const HRID = [];
    this.userList.forEach(element => {
      if (element['checked']) {
        candidateID.push(element['uid'])
      }
    });

    this.userListHR.forEach(element => {
      if (element['checked']) {
        HRID.push(element['uid'])
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
      uid: candidateID,
      hr_id: HRID,
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
