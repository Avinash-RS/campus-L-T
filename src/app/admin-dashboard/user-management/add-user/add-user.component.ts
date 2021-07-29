import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  editDetails: any;
  addUserForm: FormGroup;
  title: string;
  editUserId: any;
  showInterviewPanel = false;
  disciplineDropdown: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SharedServiceService,
    private matDialog: MatDialog
  ) {
    this.editRouteParamGetter();
  }

  ngOnInit() {
    this.formInitialize();
    this.getDiscipline();
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.paramMap.subscribe(params => {
      this.editUserId = params.get('eid');
      if (this.editUserId) {
        this.getUsersList();
      }
    });
  }

  // To find the selected user to edit from all users
  getUsersList() {
    this.adminService.userList().subscribe((data: any) => {

      const userList = data;
      const selectedUser = userList.find((user) => user.uid === this.editUserId);
      this.editDetails = selectedUser;
      this.formInitialize();
    }, (err) => {
    });
  }

  // get discipline dropdown value
  getDiscipline() {
    this.adminService.getDiscipline().subscribe((data: any) => {

      this.disciplineDropdown = data;
    }, (err) => {
    });
  }

  // Edit User --> Form Updating on load
  updateEditForm() {

    this.addUserForm.patchValue({
      name: this.editDetails.name,
      email: this.editDetails.mail,
      role: this.editDetails.roles_target_id.toLowerCase(),
      employee_id: this.editDetails.employee_id,
      discipline: this.editDetails.discipline
    });
    this.addUserForm.controls['email'].disable();
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.editDetails) {
      this.addUserForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(emailregex)]],
        role: ['', [Validators.required]],
        employee_id: [''],
        discipline: ['']
      }), this.updateEditForm();
    } else {
      this.addUserForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(emailregex)]],
        role: ['', [Validators.required]],
        employee_id: [''],
        discipline: ['']
      });
    }
  }

  addValidation() {
    if (this.showInterviewPanel) {
      this.addUserForm.get('employee_id').setValidators(Validators.required);
      this.addUserForm.get('discipline').setValidators(Validators.required);
    } else {
      this.addUserForm.get('employee_id').clearValidators();
      this.addUserForm.get('discipline').clearValidators();
    }
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
  get employee_id() {
    return this.addUserForm.get('employee_id');
  }
  get discipline() {
    return this.addUserForm.get('discipline');
  }

  // submit() {
  //   if (this.addUserForm.valid) {
  //     // For add user API
  //     const addUserDatas = {
  //       name: [{ value: this.editDetails ? this.editDetails.mail : this.addUserForm.value.email }],
  //       field_user_name: [{value: this.addUserForm.value.name}],
  //       mail: [{ value: this.editDetails ? this.editDetails.mail : this.addUserForm.value.email }],
  //       roles: [{ target_id: 'hr' }],
  //       status: [{ value: '1' }]
  //     };
  //     // For edit user API
  //     const editUserDatas = {
  //       _links: {
  //         type: {
  //           href: `${environment.API_BASE_URL}/rest/type/user/user`
  //         }
  //       },
  //       mail: { value: this.editDetails ? this.editDetails.mail : this.addUserForm.value.email },
  //       field_user_name: [{value: this.addUserForm.value.name}],
  //       name: { value: this.editDetails ? this.editDetails.mail : this.addUserForm.value.email },
  //       roles: [{ target_id: this.addUserForm.value.role ? this.addUserForm.value.role : '' }]
  //     };
  //     // Data to be shared for modal box components
  //     const data = {
  //       iconName: '',
  //       sharedData: {
  //         confirmText: `Are you sure you want to ${(this.editDetails ? 'update' : 'add')} this user?`,
  //         componentData: this.editDetails ? editUserDatas : addUserDatas,
  //         userId: `${this.editDetails ? this.editUserId : ''}`,
  //         type: this.editDetails ? 'update' : 'add',
  //         identity: this.editDetails ? 'user-update' : 'user-add'
  //       },
  //       showConfirm: 'Confirm',
  //       showCancel: 'Cancel',
  //       showOk: ''
  //     };
  //     this.appConfig.openDialog(ModalBoxComponent, data);
  //   } else {
  //     this.validateAllFields(this.addUserForm);
  //   }

  // }
  submit() {
    if (this.addUserForm.valid) {
      // For add user API
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

      this.adminService.hrAddUser(addUserDatas).subscribe((success: any) => {

        this.addUserForm.reset();
        this.appConfig.success(`User has been added Successfully`, '');
      }, (error) => {
      });
    } else {
      this.validateAllFields(this.addUserForm);
    }

  }

  submitDialog() {
    if (this.addUserForm.valid) {
      const data = {
        iconName: '',
        dataToBeShared: {
          confirmText: `Are you sure you want to add this user?`,
          type: 'add-tpo',
          identity: 'user-add'
        },
        showConfirm: 'Confirm',
        interViwePanelAdd: 'add',
        role: this.addUserForm.value.role == 'interview_panel' ? 'interview panel' : 'hr',
        userName: this.addUserForm.value.name,
        showCancel: 'Cancel',
        showOk: ''
      };

      this.openDialog(ShortlistBoxComponent, data);
    } else {
      this.validateAllFields(this.addUserForm);
    }

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
        this.submit();
      }
    });
  }

  cancel() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST);
  }

  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

}
