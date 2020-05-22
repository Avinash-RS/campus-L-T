import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnChanges {

  @Input() editDetails;
  addUserForm: FormGroup;
  title: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService,
  ) { }

  ngOnInit() {
    this.formInitialize();
  }

  ngOnChanges() {
    if (this.editDetails) {
      this.title = 'Edit User';
    }
  }

  // Edit User --> Form Updating on load
  updateEditForm() {
    this.addUserForm.patchValue({
      name: this.editDetails.name,
      email: this.editDetails.email,
      role: this.editDetails.role
    });
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
      // API
      const datas = {
        name: [{ value: this.addUserForm.value.name }],
        mail: [{ value: this.addUserForm.value.email }],
      };
      // this.appConfig.consoleLog('Registration Data which is passed to API', datas);

      // this.apiService.RegistrationForm(datas).subscribe((data: any) => {
      //   this.appConfig.success('Form has been Registered Successfully', '');
      //   this.appConfig.routeNavigation('/' + CONSTANT.ROUTES.HOME);
      // }, (error) => {
      // });

      const data = {
        iconName: '',
        sharedData: {
          confirmText: 'Are you sure you want to add this user?',
          componentData: this.addUserForm.value,
          type: 'add',
          identity: 'user-add'
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
    this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.ADMIN_DASHBOARD.HOME}/${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT}/${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST}`);
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
