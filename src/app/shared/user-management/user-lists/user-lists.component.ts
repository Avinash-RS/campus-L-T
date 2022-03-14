import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
// import all Enterprise modules
import { ModuleRegistry, AllModules, IDatasource, IGetRowsParams } from '@ag-grid-enterprise/all-modules';
ModuleRegistry.registerModules(AllModules);
import { GridChartsModule } from '@ag-grid-enterprise/charts';
import { userListDefinition } from './userlist.aggrid-definition';
import { ShortlistBoxComponent } from '../../modal-box/shortlist-box/shortlist-box.component';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { ModalBoxComponent } from '../../modal-box/modal-box.component';
import { ActivatedRoute, RouterEvent, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
ModuleRegistry.registerModules([GridChartsModule]);

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  styleUrls: ['./user-lists.component.scss']
})

export class UserListsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('addUser', {static: false}) openAddUserForm: TemplateRef<any>;
  addUserForm: FormGroup;
  interviewPanelDisciplineDropdown: any = [];
  selectedUserlist: any = 'candidate';
  currentRole: any;
  // serverSide Things
  rowSelection: any;
  userList: any = [];
  pageRowCount = 0;

  // Ag grid
  paginationPageSize: any = 100;
  cacheBlockSize: any = 100;
  gridApi: any;
  columnDefs: any;
  defaultColDef: any = this.appConfig.agGridWithServerSideAllFunc();

  rowData: any = [];
  quickSearchValue = '';
  public gridColumnApi;
  public rowModelType;
  public serverSideStoreType;
  addUserdialogRef: any;
  refreshSubscription: Subscription;
  candidateListSubscription: Subscription;
  hruserListSubscription: Subscription;
  instituteListAfterBulkUploadSubscription: Subscription;
  userListSubscription: Subscription;
  commonUserListRefreshSubscription: Subscription;
  tpoBulkMailSentSubscription: Subscription;
  getDisciplineSubscription: Subscription;
  hrAddUserSubscription: Subscription;
  bulkUploadCandidatesSubscription: Subscription;
  selectedDrive: any;
  selectionType: any = '2';
  instructionBox = false;
  totalDriveCount: any;
  constructor(
    private appConfig: AppConfigService,
    private matDialog: MatDialog,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private agGridDefinition: userListDefinition,
    private fb: FormBuilder,
    private router: Router,
    private glovbal_validators: GlobalValidatorService,
    private activatedRoute: ActivatedRoute
  ) {
    this.getSelectedUserlistParam();
    this.currentRole = this.appConfig.getLocalData('roles');
    this.rowSelection = "multiple";
    this.serverSideStoreType = 'full';
    this.rowModelType = 'infinite';
  }

  ngOnInit() {
    this.selectedDrive = this.appConfig.getDriveName();
    this.commonRefresh();
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.candidateListSubscription ? this.candidateListSubscription.unsubscribe() : '';
    this.hruserListSubscription ? this.hruserListSubscription.unsubscribe() : '';
    this.instituteListAfterBulkUploadSubscription ? this.instituteListAfterBulkUploadSubscription.unsubscribe() : '';
    this.userListSubscription ? this.userListSubscription.unsubscribe() : '';
    this.commonUserListRefreshSubscription ? this.commonUserListRefreshSubscription.unsubscribe() : '';
    this.tpoBulkMailSentSubscription ? this.tpoBulkMailSentSubscription.unsubscribe() : '';
    this.getDisciplineSubscription ? this.getDisciplineSubscription.unsubscribe() : '';
    this.hrAddUserSubscription ? this.hrAddUserSubscription.unsubscribe() : '';
    this.bulkUploadCandidatesSubscription ? this.bulkUploadCandidatesSubscription.unsubscribe() : '';
    }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes('user-management/user-list')) {
        this.selectedDrive = this.appConfig.getDriveName();
        if (this.selectedUserlist == 'candidate') {
          this.quickSearchValue = '';
          this.gridApi.purgeInfiniteCache();
        } else {
          this.quickSearchValue = '';
          this.AssignTypesBasesOnRole();
        }
      }
    });
  }

  getSelectedUserlistParam() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['id'] == '2') {
        this.rowData = null;
        this.userList = null;
        this.selectedUserlist = 'institute';
      }
      if (params['id'] == '3') {
        this.rowData = null;
        this.userList = null;
        this.selectedUserlist = 'invPanel';
      }
    });
  }

  AssignTypesBasesOnRole() {
    if (this.selectedUserlist == 'invPanel') {
      this.paginationPageSize = 500;
      this.cacheBlockSize = 500;
      this.defaultColDef = this.appConfig.agGridWithAllFunc();
      this.gridApi.setColumnDefs(this.agGridDefinition.panelList())
      // this.columnDefs = this.agGridDefinition.panelList();
      this.getInterviewPanelUsersList();
    }
    if (this.selectedUserlist == 'institute') {
      this.paginationPageSize = 500;
      this.cacheBlockSize = 500;
      this.defaultColDef = this.appConfig.agGridWithAllFunc();
      this.gridApi.setColumnDefs(this.agGridDefinition.instituteList());
      // this.columnDefs = this.agGridDefinition.instituteList();
      this.getInstituteList();
    }
    if (this.selectedUserlist == 'hr') {
      this.paginationPageSize = 500;
      this.cacheBlockSize = 500;
      this.defaultColDef = this.appConfig.agGridWithAllFunc();
      this.gridApi.setColumnDefs(this.agGridDefinition.hrList());
      // this.columnDefs = this.agGridDefinition.hrList();
      this.getAdminHrAndInvUsersList();
    }
    if (this.selectedUserlist == 'candidate') {
      this.paginationPageSize = 100;
      this.cacheBlockSize = 100;
      this.defaultColDef = this.appConfig.agGridWithServerSideAllFunc();
      let candidateDefinition = this.agGridDefinition.candidateList();
      this.currentRole != 'institute' ? candidateDefinition.pop() && candidateDefinition.shift() : '';
      this.gridApi.setColumnDefs(candidateDefinition);
      // this.columnDefs = this.agGridDefinition.candidateList();
    }

  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.AssignTypesBasesOnRole();
    if (this.selectedUserlist == 'candidate') {
      this.gridColumnApi = params.gridColumnApi;
      this.callApiForCandidateList();
    }
  }

  callApiForCandidateList() {
      var datasource = {
        getRows: (params: IGetRowsParams) => {
        let apiData: any = params;
        apiData.isTpo = this.currentRole == 'institute' ? true : false;
        this.gridApi.showLoadingOverlay();
       this.candidateListSubscription = this.adminService.getCandidatesList(apiData).subscribe((data1: any) => {
          this.gridApi.hideOverlay();
          this.userList = data1 && data1['data'] ? data1['data'] : [];
          if (this.userList.length > 0) {
          let count = params.startRow;
          this.userList.forEach((element, i) => {
            count = count + 1;
            element['counter'] = count;
            element['created_date'] = element['created_date'] ? element['created_date'] : '';
          });
          this.totalDriveCount = data1 && data1['total_candidates_count'] ? data1['total_candidates_count'] : 0;
          this.pageRowCount = data1 && data1['total_count'] ? data1['total_count'] : 0;
          params.successCallback(
            this.userList, this.pageRowCount
          );
        } else {
          params.successCallback(
            this.userList, 0
          );
          this.gridApi.showNoRowsOverlay();
        }
        }, (err) => {
          this.gridApi.hideOverlay();
          params.failCallback();
          params.successCallback(
            this.userList, this.pageRowCount
          );
          this.gridApi.showNoRowsOverlay();
        });
        }
      }
      this.gridApi.setDatasource(datasource);
  }

  paginationChanged(e) {

  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
    // event['data']
    if (this.selectedUserlist == 'invPanel' || this.selectedUserlist == 'hr') {
      if (event.colDef.field === 'uid') {
        let selectedUserDetail = event['data'] ? event['data'] : '';
        this.agGridDefinition.removeUser(selectedUserDetail);
      }
    }
  }


  getModel(e) {
    let filterType = e['filterInstance']['filterNameKey'];
    if (filterType == 'setFilter') {
    setTimeout(() => {
      const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
      if (filteredArray && filteredArray.length === 0) {
        this.appConfig.warning('No search results found');
      }
    }, 1500);
  } else {
    setTimeout(() => {
      const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
      if (filteredArray && filteredArray.length === 0) {
        this.appConfig.warning('No search results found');
      }
    }, 500);
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

  momentForm(date) {
    if (date) {
      const split = moment(date).format('LLL');
      return split;
    }
  }
  selectedListChange(e) {
      this.userList = null;
      this.rowData = null;
      // this.currentRole != 'candidate' ? this.AssignTypesBasesOnRole() : '';
  }

  // Interview panel start
  getInterviewPanelUsersList() {
    this.hruserListSubscription = this.adminService.hruserList().subscribe((data: any) => {
      this.userList = data ? data : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['counter'] = count;
        element.uid = element.user_id;
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  // Institute list start
  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;

    } else {
      return '-';
    }
  }
  // To get all users
  getInstituteList() {
   this.instituteListAfterBulkUploadSubscription = this.adminService.instituteListAfterBulkUpload().subscribe((data1: any) => {
      this.userList = data1 ? data1 : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['counter'] = count;
        element['time'] = element && element['time'] ? element['time'] : '';
        const fn = element && element.field_first_name ? element.field_first_name : '';
        const ln = element && element.field_institute_last_name ? element.field_institute_last_name : '';
        element.field_first_name = fn + ' ' + ln;
        element['field_date'] = element && element['field_date'] ? this.getDateFormat(element['field_date']) : '-';
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  // Admin Hr list view
    // To get all users
    getAdminHrAndInvUsersList() {
     this.userListSubscription = this.adminService.userList().subscribe((data: any) => {

        this.userList = data ? data : [];
        let count = 0;
        this.userList.forEach(element => {
          count = count + 1;
          element['counter'] = count;
        });
        this.rowData = this.userList;
      }, (err) => {
      });
    }



  commonRefresh() {
    this.commonUserListRefreshSubscription = this.sharedService.commonUserListRefresh.subscribe((uid)=> {
      this.deleteRemovedUserFromGrid(uid);
    });
  }

  deleteRemovedUserFromGrid(uid) {
    const rowData = [];
    this.gridApi.forEachNode(function (node) {
      if (node.data.uid !=uid) {
        rowData.push(node.data);
      }
    });
    this.gridApi.setRowData(rowData);
  }

  ngAfterViewInit() {
    // // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  selectionRadioChange(e) {
    if (e.value == 2) {
      this.selectorUnselectAllCheckbox(false, true);
    }
  }

  // Select and Unselect all functions for TPO candidate list
  selectAll(e) {
    this.selectorUnselectAllCheckbox(e);
  }

  selectorUnselectAllCheckbox(condition, isStartIndex?:Boolean) {
    let endIndex = this.gridApi.paginationProxy.bottomDisplayedRowIndex;
    let startIndex = isStartIndex ? 0 : (endIndex - 99);

    this.gridApi.forEachNode((row, index) => {
      if (index >= startIndex && index <= endIndex) {
        this.gridApi.getRowNode(row.id).selectThisNode(condition);
      }
  });
  }

  emailTriggerSeletedNodes() {
    this.selectionType == '2' ? this.selectorUnselectAllCheckbox(false, true) : '';
    const data = {
      bulk_upload: 'tpo-candidate-bulk',
      fullDrive: this.selectionType == '2' ? true : false,
      count: this.selectionType == '2' ? this.totalDriveCount : this.gridApi.getSelectedNodes().length
    };
    this.openDialog(ShortlistBoxComponent, data);
  }

  sendEmail() {
    let selectedCandidates = this.gridApi.getSelectedNodes();
    let apiData: any = {
      id: []
    };
    selectedCandidates.forEach(element => {
      if (element['data']) {
        apiData['id'].push(element['data']['user_id']);
      }
    });
    apiData.emailAllCandidates = false;
    if (this.selectionType == '2') {
      apiData.id = [];
      apiData.emailAllCandidates = true;
    }
    this.tpoBulkMailSentSubscription = this.adminService.tpoBulkMailSent(apiData).subscribe((datas: any) => {
      this.gridApi.deselectAll();
      this.gridApi.purgeInfiniteCache();
      const data = {
        tpo_bulk_upload_ok: 'ok'
      };
      this.openDialog1(ShortlistBoxComponent, data);
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
          this.sendEmail();
        }
      });
    }

    // Open dailog
    openDialog1(component, data) {
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


    // Add users Section
    openUserFormDialog() {
      this.formInitialize();
      this.addUserdialogRef = this.matDialog.open(this.openAddUserForm, {
        width: '400px',
        height: 'auto',
        autoFocus: false,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'popupModalContainerForaddUser'
      });


    }

    closeDialog() {
      this.matDialog.closeAll();
    }

    formInitialize() {
      this.addUserForm = this.fb.group({
        role: [this.currentRole == 'institute' ? 'candidate' : null, [Validators.required]],
        is_skip_kyc: [false],
        name: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
        email: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.email()]],
        tag: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
        employee_id: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
        discipline: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]]
      });
      this.currentRole == 'institute' ? this.addValidation() : '';
  }

  // get discipline dropdown value
  getDiscipline() {
    this.getDisciplineSubscription = this.adminService.getDiscipline().subscribe((data: any) => {
      this.interviewPanelDisciplineDropdown = data ? data : [];
    }, (err) => {
    });
  }


    addValidation() {
      if (this.addUserForm && this.addUserForm.value && this.addUserForm.value.role == 'candidate') {
        this.addUserForm.get('tag').setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]);
        this.addUserForm.get('employee_id').clearValidators();
        this.addUserForm.get('discipline').clearValidators();
        this.addUserForm.controls['tag'].updateValueAndValidity();
        this.addUserForm.controls['employee_id'].updateValueAndValidity();
        this.addUserForm.controls['discipline'].updateValueAndValidity();
      }
      if (this.addUserForm && this.addUserForm.value && this.addUserForm.value.role == 'interview_panel') {
        this.addUserForm.get('employee_id').setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]);
        this.addUserForm.get('discipline').setValidators([Validators.required]);
        this.addUserForm.get('tag').clearValidators();
        this.addUserForm.controls['tag'].updateValueAndValidity();
        this.addUserForm.controls['employee_id'].updateValueAndValidity();
        this.addUserForm.controls['discipline'].updateValueAndValidity();
        this.interviewPanelDisciplineDropdown.length > 0 ? '' : this.getDiscipline();
      }
      if (this.addUserForm && this.addUserForm.value && this.addUserForm.value.role == 'hr') {
        this.addUserForm.get('employee_id').clearValidators();
        this.addUserForm.get('discipline').clearValidators();
        this.addUserForm.get('tag').clearValidators();
        this.addUserForm.controls['tag'].updateValueAndValidity();
        this.addUserForm.controls['employee_id'].updateValueAndValidity();
        this.addUserForm.controls['discipline'].updateValueAndValidity();
      }
    }

    onUserSubmit() {
      if (this.addUserForm.valid) {
        let role = this.addUserForm.value.role;
        const data = {
          iconName: '',
          dataToBeShared: {
            confirmText: `Are you sure you want to add this user as ${role == 'candidate' ? 'Candidate' : role == 'hr' ? 'HR' : 'Interview Panel'}?`,
            type: 'add-tpo',
            identity: 'user-add'
          },
          showConfirm: 'Confirm',
          showCancel: 'Cancel',
          showOk: ''
        };
        this.openAddUserDialog(ModalBoxComponent, data);
      } else {
        this.glovbal_validators.validateAllFields(this.addUserForm);
      }
    }

    tConvert(time) {
      // Check correct time format and split into components
      time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join(''); // return adjusted time or original string
    }

    getDateFormat1(date) {
      if (date) {
        const split = moment(date).format('YYYY-MM-DD');
        const output = split.toUpperCase();
        return output;

      } else {
        return '-';
      }
    }

    AddNewRowData(apiData, response) {
      if (apiData.role == 'interview_panel') {
        if (this.selectedUserlist == 'invPanel') {
          this.getInterviewPanelUsersList();
        } else {
          this.selectedUserlist = 'invPanel';
        }
        // let element = {
        //   email: apiData.email,
        //   field_employee_id: apiData.employee_id,
        //   field_form_name: response.field_form_name ? response.field_form_name : null,
        //   field_panel_discipline: apiData.panel_discipline,
        //   field_uploaded_by: apiData.field_user_created_by,
        //   name: apiData.name,
        //   role: apiData.role,
        //   status: response.status ? response.status : null,
        //   uid: response.user_id ? response.user_id : null,
        //   user_id: response.user_id ? response.user_id : null
        // };
        // const rowData = [];
        // rowData.push(element);
        // this.gridApi.forEachNode(function (node) {
        //   rowData.push(node.data);
        // });
        // this.gridApi.setRowData(rowData);
      }
      if (apiData.role == 'hr') {
        if (this.selectedUserlist == 'hr') {
          this.getAdminHrAndInvUsersList();
        } else {
          this.selectedUserlist = 'hr';
        }
        // let element = {
        //   email: apiData.email,
        //   name: apiData.name,
        //   created_by: response.created_by ? response.created_by : null,
        //   created_date: response.created_date ? response.created_date : null,
        //   uid: response.uid ? response.uid : null,
        // };
        // const rowData = [];
        // rowData.push(element);
        // this.gridApi.forEachNode(function (node) {
        //   rowData.push(node.data);
        // });
        // this.gridApi.setRowData(rowData);
      }

    }
    addUserApi() {
      if (this.addUserForm && this.addUserForm.value && this.addUserForm.value.role != 'candidate') {
        const addUserDatas = {
          name: this.addUserForm.value.name,
          email: this.addUserForm.value.email,
          role: this.addUserForm.value.role,
          field_user_created_by: this.appConfig.getLocalData('userId')
        };
        if (this.addUserForm.value.role == 'interview_panel') {
          addUserDatas['panel_discipline'] = this.addUserForm.value.discipline;
          addUserDatas['employee_id'] = this.addUserForm.value.employee_id;
        }
        this.hrAddUserSubscription = this.adminService.hrAddUser(addUserDatas).subscribe((success: any) => {
          this.addUserForm.reset();
          this.appConfig.success(`User has been added Successfully`, '');
          this.closeDialog();
          this.AddNewRowData(addUserDatas, success);
        }, (error) => {
        });
      } else {
        const date = new Date();
        let minutes;
        if (date.getMinutes().toString().length === 1) {
          minutes = '0' + date.getMinutes().toString();
        } else {
          minutes = date.getMinutes();
        }
        const apiData = [
          {
            tag: this.addUserForm.value.tag,
            name: this.addUserForm.value.name,
            is_skip_kyc: this.addUserForm.value.is_skip_kyc ? true : false,
            email: this.addUserForm.value.email,
            date: this.getDateFormat1(date),
            field_user_created_by: this.appConfig.getLocalData('userId'),
            time: this.tConvert(`${date.getHours()}:${minutes}`)
          }
        ];
        this.bulkUploadCandidatesSubscription = this.adminService.bulkUploadCandidates(apiData).subscribe((data: any) => {
          if (data && data.length > 0) {
            this.appConfig.error(data && data[0] && data[0]['reason'] ? data[0]['reason'] : 'Candidate not added.. Try Again', '');
          } else {
            this.addUserForm.reset();
            this.currentRole == 'institute' ? this.appConfig.successWithTitle('You may now trigger mail to the newly added candidates.', 'Candidate added successfully') : this.appConfig.success('Candidate added successfully', '');
            this.closeDialog();
            if (this.selectedUserlist == 'candidate') {
              this.gridApi.purgeInfiniteCache();
            } else {
              this.selectedUserlist = 'candidate';
            }
          }
        }, (err) => {

        });

      }
    }

    openAddUserDialog(component, data) {
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
          this.addUserApi();
        }
      });
    }

    get name() {
      return this.addUserForm.get('name');
    }
    get email() {
      return this.addUserForm.get('email');
    }
    get role() {
      return this.addUserForm.get('role');
    }
    get tag() {
      return this.addUserForm.get('tag');
    }
    get employee_id() {
      return this.addUserForm.get('employee_id');
    }
    get discipline() {
      return this.addUserForm.get('discipline');
    }


}

