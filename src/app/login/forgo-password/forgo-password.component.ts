import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-forgo-password',
  templateUrl: './forgo-password.component.html',
  styleUrls: ['./forgo-password.component.scss']
})
export class ForgoPasswordComponent implements OnInit {

  candidateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobileRegex: RegExp = /^[1-9][0-9]{9}$/;
    this.candidateForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(mobileRegex)]],
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
    });
  }

  get mobile() {
    return this.candidateForm.get('mobile');
  }
  get email() {
    return this.candidateForm.get('email');
  }

  submit() {

    if (this.candidateForm.get('mobile').valid || this.candidateForm.get('email').valid) {
      let data;
      if (this.candidateForm.get('mobile').valid) {
        data = {
          mobile: [{ value: this.candidateForm.value.mobile }],
        };
      }
      if (this.candidateForm.get('email').valid) {
        data = {
          mail: this.candidateForm.value.email
        };
      }
      if (this.candidateForm.get('mobile').valid && this.candidateForm.get('email').valid) {
        data = {
          mail: this.candidateForm.value.email
        };
      }
      console.log('Registration Data which is passed to API', data);
      // API

      this.apiService.forgotPassword(data).subscribe((success: any) => {
        console.log(success);
        this.commonService.success('Email with temporary credentials has been sent Successfully', '');
        this.router.navigate(['/signup/reset-password']);
      }, (error) => {
        console.log(error);
        if (error.status === 422) {
          return this.commonService.error('Usermail or Username has already taken', '');
        }
        if (error.error === 'This account is blocked or has not been activated yet.') {
          return this.commonService.error(error.error ? error.error : '400 bad request', '');
        }
        if (error.status === 400) {
          return this.commonService.error(error.error ? error.error.message : '400 bad request', '');
        }
        if (error.status === 401) {
          return this.commonService.error('Unauthorized', '');
        } else {
          this.commonService.error(!error.error ? 'Something went wrong' :
            error.error.message ? error.error.message : 'Something went wrong.. Please try again', '');
        }
      });
    } else {
      this.validateAllFields(this.candidateForm);
    }

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
