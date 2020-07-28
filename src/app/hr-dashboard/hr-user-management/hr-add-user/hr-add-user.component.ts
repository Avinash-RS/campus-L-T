import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

@Component({
  selector: 'app-hr-add-user',
  templateUrl: './hr-add-user.component.html',
  styleUrls: ['./hr-add-user.component.scss']
})
export class HrAddUserComponent implements OnInit {

  editDetails: any;
  addUserForm: FormGroup;
  title: string;
  editUserId: any;
  showInterviewPanel = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SharedServiceService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.formInitialize();
  }


  formInitialize() {
    
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
      role: ['', [Validators.required]],
      employee_id: [''],
      discipline: ['']
    })
  }
  addValidation(){
    if(this.showInterviewPanel){
      this.addUserForm.get('employee_id').setValidators(Validators.required)
      this.addUserForm.get('discipline').setValidators(Validators.required)
    }else{
      this.addUserForm.get('employee_id').clearValidators()
      this.addUserForm.get('discipline').clearValidators()
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

  submit() {
    if (this.addUserForm.valid) {
      // For add user API
      const addUserDatas = {
        name: this.addUserForm.value.name,
        email: this.addUserForm.value.email,
        role: this.addUserForm.value.role,
        field_user_created_by: this.appConfig.getLocalData('userId')

      };
      if(this.addUserForm.value.role == 'interview_panel'){
        addUserDatas['panel_discipline'] = this.addUserForm.value.discipline;
        addUserDatas['employee_id'] = this.addUserForm.value.employee_id;
      }
      
      this.adminService.hrAddUser(addUserDatas).subscribe((success: any) => {
        this.appConfig.hideLoader();
        this.addUserForm.reset();
        this.appConfig.success(`User has been added Successfully`, '');
      }, (error) => {
      });
    } else {
      this.validateAllFields(this.addUserForm);
    }

  }

  submitDialog(){
    if(this.addUserForm.valid){
      const data = {
        iconName: '',
        dataToBeShared: {
          confirmText: `Are you sure you want to add this user?`,
          type: 'add-tpo',
          identity: 'user-add'
        },
        showConfirm: 'Confirm',
        interViwePanelAdd: 'add',
        userName: this.addUserForm.value.name,
        showCancel: 'Cancel',
        showOk: ''
      };
  
      this.openDialog(ShortlistBoxComponent, data);
    }else{
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
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST);
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
