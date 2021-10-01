import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-ic',
  templateUrl: './add-ic.component.html',
  styleUrls: ['./add-ic.component.scss']
})
export class AddICComponent implements OnInit, OnDestroy {

  @Output() tabChange: EventEmitter<any> = new EventEmitter<any>();
  addIcForm: FormGroup;
  icLists: any;
  refreshSubscription: Subscription;
  listOfICsSubscription: Subscription;
  addICSubscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.formInitialize();
    this.listOfIcs();
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.listOfICsSubscription ? this.listOfICsSubscription.unsubscribe() : '';
    this.addICSubscription ? this.addICSubscription.unsubscribe() : '';
    }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.IC_ADDorLIST)) {
        this.formInitialize();
        this.listOfIcs();
      }
    });
  }

  listOfIcs() {
    this.listOfICsSubscription = this.adminService.listOfICs().subscribe((datas: any)=> {

      this.icLists = datas ? datas : [];
    });
  }
  apiData() {
      this.addUsers();
  }
  formInitialize() {
    this.addIcForm = this.fb.group({
      icName: ['', [Validators.required]],
      addUser: new FormArray([]) // Declaring form array
    }), this.apiData(); // For updating the api values (patch), if no values are there, will go as empty.
  }

  addUsers(data?: any) {
    // If data parameter has value then it will patch the values else will be passing empty array.
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const alphaNumericMaxLength: RegExp = /^([a-zA-Z0-9_ ]){0,255}$/;
    const alphaNumericMaxLengthWithSpecialCharacters: RegExp = /^([a-zA-Z0-9_ \-,.();/\r\n|\r|\n/]){0,255}$/;
    if (data) {
      const group = this.fb.group({
        userName: [data?.name, [Validators.required, Validators.pattern(alphaNumericMaxLengthWithSpecialCharacters), RemoveWhitespace.whitespace()]],
        email: [data?.email, [Validators.required, Validators.pattern(emailregex)]],
      });
      this.addUser.push(group);
    } else {
      const group = this.fb.group({
        userName: ['', [Validators.required, Validators.pattern(alphaNumericMaxLengthWithSpecialCharacters), RemoveWhitespace.whitespace()]],
        email: ['', [Validators.required, Validators.pattern(emailregex)]],
      });
      this.addUser.push(group);
    }
  }
  removeUser(index: any) {
    this.addUser.removeAt(Number(index));
  }
  // Declaring as addUser as formarray
  get addUser() {
    return this.addIcForm.get('addUser') as FormArray;
  }
  get icName() {
    return this.addIcForm.get('icName');
  }
  get userName() {
    return this.addIcForm.get('userName');
  }
  get email() {
    return this.addIcForm.get('email');
  }

  submitUsers(data) {
   this.addICSubscription = this.adminService.addIC(data).subscribe((datas: any)=> {

      this.appConfig.success('Users added successfully');
      this.addIcForm.reset();
      this.tabChange.emit('0');
  });
  };

  submitaddIC() {
    if (this.addIcForm.valid) {
        const company = this.addIcForm.value.icName;
        const arr = this.addIcForm.value.addUser;
        const dup = [];
        const data = {
          business: company,
          ic_panel: [
          ]
        };
        arr.forEach(element => {
          data.ic_panel.push(
            {
              name: element.userName,
              email: element.email,
              company: company
            }
          )
          dup.push(element.email);
        });
        const companyName = this.icLists.find((element) => element.company_id == company);
        if (!this.checkForDuplicates(dup)) {
          const datas = {
            iconName: '',
            showConfirm: 'Confirm',
            dataParse: data,
            ic: 'add',
            role: companyName['company_name'],
            showCancel: 'Cancel',
            showOk: ''
          };

          this.openDialog(ShortlistBoxComponent, datas);
      } else {
        this.appConfig.warning('Duplicate email id entries found. Please remove it and try again.');
      }
    } else {
      this.validateAllFields(this.addIcForm);
      this.validateAllFormArrays(this.addIcForm.get('addUser') as FormArray);
    }
  }

  checkForDuplicates(array) {
    return new Set(array).size !== array.length
  }
  cancel() {
    // this.addUsers();
    this.addIcForm.reset();
    this.addUser.clear();
    this.addUsers();
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
        this.submitUsers(result?.dataParse);
      }
    });
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

  // To validate all fields after submit
  validateAllFormArrays(formArray: FormArray) {
    formArray.controls.forEach(formGroup => {
      Object.keys(formGroup['controls']).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFields(control);
        }
      });

    });
  }


}
