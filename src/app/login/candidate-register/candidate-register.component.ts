import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-candidate-register',
  templateUrl: './candidate-register.component.html',
  styleUrls: ['./candidate-register.component.scss']
})
export class CandidateRegisterComponent implements OnInit {

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
    this.candidateForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
    });
  }

  get name() {
    return this.candidateForm.get('name');
  }
  get email() {
    return this.candidateForm.get('email');
  }

  submit() {

    if (this.candidateForm.valid) {
      // API
      const datas = {
        name: [{ value: this.candidateForm.value.name }],
        mail: [{ value: this.candidateForm.value.email }],
        roles: [{ target_id: 'candidate' }],
      };
      console.log('Registration Data which is passed to API', datas);

      this.apiService.RegistrationForm(datas).subscribe((data: any) => {
        this.commonService.success('Form has been Registered Successfully', '');
        this.router.navigate(['/']);
      }, (error) => {
        console.log(error);
        if (error.status === 422) {
          this.commonService.error('Usermail or Username has already taken', '');
        }
        if (error.status === 401) {
          this.commonService.error('Unauthorized', '');
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
