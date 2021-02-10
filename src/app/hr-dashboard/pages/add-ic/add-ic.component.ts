import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-add-ic',
  templateUrl: './add-ic.component.html',
  styleUrls: ['./add-ic.component.scss']
})
export class AddICComponent implements OnInit {

  @Output() tabChange:EventEmitter<any> =new EventEmitter<any>();
  addIcForm: FormGroup;
  icListArr = [
    {
      label: 'Edutech lajlajdlj aldj lajdl ajdl jaldj aldjl ajdl jaldj ',
      value: 'Edutech lajlajdlj aldj lajdl ajdl jaldj aldjl ajdl jaldj'
    },
    {
      label: 'Construction',
      value: 'construction'
    },
    {
      label: 'IDPL',
      value: 'idpl'
    },
    {
      label: 'ECC',
      value: 'ecc'
    }
  ]
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
    const alphaNumericMaxLength: RegExp = /^([a-zA-Z0-9_ ]){0,255}$/;
    const alphaNumericMaxLengthWithSpecialCharacters: RegExp = /^([a-zA-Z0-9_ \-,.();/\r\n|\r|\n/]){0,255}$/;

    this.addIcForm = this.fb.group({
      icName: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.pattern(alphaNumericMaxLengthWithSpecialCharacters), RemoveWhitespace.whitespace()]],
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
    });
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

  submitaddIC() {
    if (this.addIcForm.valid) {
      this.tabChange.emit('0');
    } else {
      this.validateAllFields(this.addIcForm);
    }
  }
  cancel() {
    this.addIcForm.reset();
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
