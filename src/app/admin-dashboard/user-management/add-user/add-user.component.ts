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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SharedServiceService
  ) {
    this.editRouteParamGetter();
  }

  ngOnInit() {
    this.formInitialize();
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
      this.appConfig.hideLoader();
      const userList = data;
      const selectedUser = userList.find((user) => user.uid === this.editUserId);
      this.editDetails = selectedUser;
      this.formInitialize();
    }, (err) => {
    });
  }


  // Edit User --> Form Updating on load
  updateEditForm() {
    console.log(this.editDetails);

    this.addUserForm.patchValue({
      name: this.editDetails.name,
      email: this.editDetails.mail,
      role: this.editDetails.roles_target_id.toLowerCase()
    });
    this.addUserForm.controls['email'].disable();
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.editDetails) {
      this.addUserForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(emailregex)]],
        role: ['', [Validators.required]]
      }), this.updateEditForm();
    } else {
      this.addUserForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(emailregex)]],
        role: ['', [Validators.required]]
      });
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

  submit() {
    if (this.addUserForm.valid) {
      // For add user API
      const addUserDatas = {
        name: [{ value: this.addUserForm.value.name }],
        mail: [{ value: this.editDetails ? this.editDetails.mail : this.addUserForm.value.email }],
        roles: [{ target_id: 'hr' }],
        status: [{ value: '1' }]
      };
      // For edit user API
      const editUserDatas = {
        _links: {
          type: {
            href: `${environment.API_BASE_URL}/rest/type/user/user`
          }
        },
        mail: { value: this.editDetails ? this.editDetails.mail : this.addUserForm.value.email },
        name: { value: this.addUserForm.value.name },
        roles: [{ target_id: this.addUserForm.value.role ? this.addUserForm.value.role : '' }]
      };
      // Data to be shared for modal box components
      const data = {
        iconName: '',
        sharedData: {
          confirmText: `Are you sure you want to ${(this.editDetails ? 'update' : 'add')} this user?`,
          componentData: this.editDetails ? editUserDatas : addUserDatas,
          userId: `${this.editDetails ? this.editUserId : ''}`,
          type: this.editDetails ? 'update' : 'add',
          identity: this.editDetails ? 'user-update' : 'user-add'
        },
        showConfirm: 'Confirm',
        showCancel: 'Cancel',
        showOk: ''
      };
      this.appConfig.openDialog(ModalBoxComponent, data);
    } else {
      this.validateAllFields(this.addUserForm);
    }

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
