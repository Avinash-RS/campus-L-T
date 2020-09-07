import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

@Component({
  selector: 'app-interviewpanel-select',
  templateUrl: './interviewpanel-select.component.html',
  styleUrls: ['./interviewpanel-select.component.scss']
})
export class InterviewpanelSelectComponent implements OnInit, AfterViewInit {

  appConstant = CONSTANT.ENDPOINTS;
  displayedColumns: any[] = ['uid', 'field_employee_id', 'field_panel_discipline', 'name', 'email', 'formName', 'checked'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Output() enableCriteriaComponent = new EventEmitter<boolean>();
  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  selectedAssign: any;
  selectedFormData: any = [];
  selectedCandidate: any = [];
  defaultFormSelecterHrPanel: any = [];
  buttonHide;
  displayNoRecords = false;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '002-cv.svg',
        name: 'Candidate details',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS
      },
      {
        icon: '002-cv.svg',
        name: 'Interview panel',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS_SELECT
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
    this.selectedAssign = JSON.parse(this.appConfig.getLocalData('hrEvalutionInterviewPanel'));
    this.selectedFormData = JSON.parse(this.appConfig.getLocalData('selectedFormId')) != null ? JSON.parse(this.appConfig.getLocalData('selectedFormId')) : [];
    this.selectedCandidate = JSON.parse(this.appConfig.getLocalData('hrEvaluationInterviewSelectedCandidate'));
    this.getUsersList();

  }

  // To get all users
  getUsersList() {
    this.adminService.getInterviewPanelDetails().subscribe((datas: any) => {
      this.appConfig.hideLoader();

      const align = datas;
      this.userList = align ? align : [];
      this.toShoworNotShowFilter();
      let count = 0;
      this.userList.forEach(element => {
        element['checked'] = false;
        count = count + 1;
        element['uid'] = count;
        element['field_form_name'] = element.field_form_name == 'default' ? 1 : element.field_form_name;
        element['formName'] = element.field_form_name == 1 ? 'Default' : element.field_form_name == 2 ? 'Ev1' : element.field_form_name;
      });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.checkHrPanel();
    }, (err) => {
    });
  }

  selectAllCheckbox(checked) {

    if (checked['checked']) {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.user_id === ele.user_id) {
            element.checked = true;
          }
        });
      });
    } else {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.user_id === ele.user_id) {
            element.checked = false;
          }
        });
      });
    }
    this.getSelectedData();
    this.toShoworNotShowFilter();
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
    // if (this.userList.length === pushNotChecked.length) {
    //   this.selectAllCheck = false;
    // }
  }


  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // check search data is available or not
    if(this.dataSource.filteredData.length==0){
      this.displayNoRecords=true;
    }else{
      this.displayNoRecords=false;

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectedUser(userDetail) {

    this.userList.forEach(element => {
      if (element.user_id === userDetail.user_id) {
        element.checked = !element.checked;
      }
    });
    this.selectedUserDetail = userDetail;

    this.getSelectedData();
    this.toShoworNotShowFilter();
    this.unselectSelectALL();
  }

  //check hr interview panel when select form
  checkHrPanel() {
    if (this.selectedFormData.length != 0) {
      this.selectedFormData.forEach(data => {
        this.userList.forEach(element => {
          if (element.user_id === data.hr_id) {
            element.field_form_name = data.frm_id;
          }
        });
      })
    }
  }

  submit(event) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS_SELECT, '1');
  }

  sendInEvalutionFormPage(selectedForm) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL_FORM, { id: selectedForm.user_id ? selectedForm.user_id : 'none' });
  }

  // getSelected data
  getSelectedData() {
    this.defaultFormSelecterHrPanel = [];
    this.userList.forEach(element => {
      if (element['checked']) {
        let tempObj = {
          'hr_id': element.user_id,
          'frm_id': element.field_form_name
        }
        this.defaultFormSelecterHrPanel.push(tempObj);
      }
    });
  }

  //assign panel to selected candidate
  assignPanel() {
    let assignData = {
      'uid': this.selectedCandidate,
      'hr_id': this.defaultFormSelecterHrPanel
    }
    this.adminService.assignCandidateTOPanel(assignData).subscribe((datas: any) => {
      this.appConfig.hideLoader();

      this.appConfig.success(`Interview panel has been assigned Successfully`, '');

      localStorage.removeItem('selectedFormId');
      this.ngOnInit();

    }, (err) => {
    });
  }

  submitDialog() {
    // if (this.addUserForm.valid) {
    const data = {
      iconName: '',
      dataToBeShared: {
        confirmText: `Are you sure you want to assign this panel?`,
        type: 'assign-hr',
        identity: 'panel-assign'
      },
      showConfirm: 'Confirm',
      interViwePanelAssign: 'assign',
      candidateCount: this.selectedCandidate.length,
      panel: this.defaultFormSelecterHrPanel.length,
      showCancel: 'Cancel',
      showOk: ''
    };
    let assignData = {
      'uid': this.selectedCandidate,
      'hr_id': this.defaultFormSelecterHrPanel
    }

    this.openDialog(ShortlistBoxComponent, data);
    // } else {
    //   this.validateAllFields(this.addUserForm);
    // }

  }

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
        this.assignPanel();
      }
    });
  }

}
