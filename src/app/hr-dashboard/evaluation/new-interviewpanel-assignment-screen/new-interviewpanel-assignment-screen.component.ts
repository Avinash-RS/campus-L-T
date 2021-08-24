import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter,TemplateRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatExpansionPanel, MatAccordion } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import moment from 'moment';

@Component({
  selector: 'app-new-interviewpanel-assignment-screen',
  templateUrl: './new-interviewpanel-assignment-screen.component.html',
  styleUrls: ['./new-interviewpanel-assignment-screen.component.scss']
})

export class NewInterviewpanelAssignmentScreenComponent implements OnInit, AfterViewInit {

  @ViewChild(MatExpansionPanel, {static: false}) pannel?: MatExpansionPanel;
  @ViewChild('firstAccordion', {static: false}) firstAccordion: MatAccordion;
  @Output() enableCriteriaComponent = new EventEmitter<boolean>();
  @ViewChild('schedulePopup', {static: false}) schedulePopup: TemplateRef<any>;
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


  //ScheduleForm
  scheduleForm: FormGroup;
  minDate;
  maxDate;
  selectedCandidate = [];
  selectedInterviewer = [];
  attendeesList = [];
  objList;
  routeAssignedData: any;
  toggleVisibility = true;
  allShortlistNames: any = [];

  constructor(
    public appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private fb: FormBuilder,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private glovbal_validators: GlobalValidatorService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
    {
      icon: '002-cv.svg',
      name: 'Panel Assignment',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT
    },
    {
      icon: '002-cv.svg',
      name: 'Assigned Details',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED
    },
    {
      icon: '002-group-1.svg',
      name: 'Bulk Assign',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_RESULTS_UPLOAD
    }

    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.defaultColDefHR = this.appConfig.agGridWithAllFunc();
    this.tabledef();
    this.tabledefHR();
    this.getShortlistNames();
    this.getInstitute();
    this.getHRDisciplines();
    this.getEducation();
    this.particularInvpanelist(this.selectedHRDiscipline);
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
        }
      },
      {
        headerName: 'discipline', field: 'discipline',
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
      status: this.selectedStatus ? this.selectedStatus : ''
    }
    this.adminService.getParticularCandidatelist(apiData).subscribe((data: any) => {

      if(!this.pannel) { return } else {this.pannel.close()}
      const datas = data ? data : [];
      this.showDefault = false;
      this.routeAssignedData = apiData;
      this.getUsersList(datas);
    }, (err) => {
    });
  }
  interviewPanelFilterApply(data) {
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

      this.allInstitutes = data ? data : [];
    }, (err) => {
    });
  }

  getShortlistNames() {
    this.adminService.getAllShortlistedShortlistNames().subscribe((data: any) => {
      this.allShortlistNames = data ? data : [];
    }, (err) => {
    });
  }

  getHRDisciplines() {
    this.adminService.getDiscipline().subscribe((data: any) => {

      this.allHRDisciplines = data ? data : [];
    }, (err) => {
    });
  }


  particularInvpanelist(data) {
    const apiData = {
      discipline: data ? data : ''
    }
    this.adminService.getParticularInterviewpanelist(apiData).subscribe((data: any) => {

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

  scheduleformInitialize() {
    this.scheduleForm = this.fb.group({
      title: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      password: [null, [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(1000)]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      type: ['1', [Validators.required]]
    })
  }

  scheduleInterview(){
    if(this.selectedCandidate.length == 0){
      this.appConfig.warningWithTitle('Please select a candidate','');
      return false;
    }
    if(this.selectedCandidate.length > 1){
      this.appConfig.warningWithTitle('Please select one candidate at a time','');
      return false;
    }
    if(this.selectedInterviewer.length == 0){
      this.appConfig.warningWithTitle('Please select a interviewer','');
      return false;
    }
    this.minDate = new Date();
    this.attendeesList = this.selectedCandidate.concat(this.selectedInterviewer);
    this.scheduleformInitialize();
    const dialogRef = this.matDialog.open(this.schedulePopup, {
      // width: '55%',
      // height: '70%',
      panelClass: 'custom-modalbox'
    });
  }

  dateChange(){
    this.minDate = new Date();
  }
  closePopup(){
    this.matDialog.closeAll();
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

  checkIsValidDate() {
    if (moment(this.scheduleForm.value.endTime).isSameOrBefore(this.scheduleForm.value.startTime)) {
      this.appConfig.warning('End Date Time should not go beyond State Date Time')
      return false;
    }
    if (moment(this.scheduleForm.value.startTime).isSameOrAfter(this.scheduleForm.value.endTime)) {
      this.appConfig.warning('Start Date Time should not go beyond End Date Time')
      return false;
    }
    return true;
  }

  scheduleRoom(){
    if (this.scheduleForm.valid && this.checkIsValidDate()) {
      let userDetails = [];
      this.attendeesList.forEach((value)=>{
        const vl = {
          'emailId': value.email,
          'userFullName':value?.name ? value.name : value.employee_name,
          'type':value.type,
        }
        userDetails.push(vl)
      })
      var obj = {
        'roomId':Math.floor(Math.random() * 10000000).toString(),
        'password': this.scheduleForm.value.password,
        'roomName':this.scheduleForm.value.title,
        'startTime': this.scheduleForm.value.startTime,
        'endTime': this.scheduleForm.value.endTime,
        "userDtl": userDetails,
        "createdByID" : this.appConfig.getLocalData('userEmail'),
        "createdByName": this.appConfig.getLocalData('username'),
        "type": this.scheduleForm.value.type == '1' ? 'webrtc' : 'teams'
      }
      this.objList = obj;
      this.adminService.scheduleRooms(this.objList).subscribe((result:any)=>{
        if(result.success){
          this.scheduleHirerachy();
        } else {
          this.appConfig.warningWithTitle('Something went wrong','');
        }
      })
    } else {
      this.scheduleForm.valid ? '' : this.appConfig.warning('Form is Invalid');
      this.glovbal_validators.validateAllFields(this.scheduleForm);
    }
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

  // FormControls
  get title() {
    return this.scheduleForm.get('title');
  }
  get password1() {
    return this.scheduleForm.get('password');
  }
  get startTime() {
    return this.scheduleForm.get('startTime');
  }
  get endTime() {
    return this.scheduleForm.get('endTime');
  }
  get type() {
    return this.scheduleForm.get('type');
  }

}
