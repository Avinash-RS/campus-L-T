import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-candidate-register",
  templateUrl: "./candidate-register.component.html",
  styleUrls: ["./candidate-register.component.scss"],
})
export class CandidateRegisterComponent implements OnInit {
  candidateForm: FormGroup;
  toggleVisibility = true;
  capsOn: any;
  getCurrentYear = this.appConfig.getCurrentYear();
  captachaSiteKey = environment.captachaSiteKey;
  recaptchaStr = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService,
    private glovbal_validators: GlobalValidatorService,
  ) {}

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    this.candidateForm = this.fb.group({
      name: [
        null,
        [
          RemoveWhitespace.whitespace(),
          Validators.required,
          this.glovbal_validators.alphaNum100()
        ],
      ],
      email: [
        "",
        [
          RemoveWhitespace.whitespace(),
          Validators.required,
          Validators.maxLength(100),
          this.glovbal_validators.email()
        ],
      ],
    });
  }

  get name() {
    return this.candidateForm.get("name");
  }
  get email() {
    return this.candidateForm.get("email");
  }

  submit(captcha?:any) {
    if (this.candidateForm.valid) {
      // API
      const datas = {
        name: this.candidateForm.value.name,
        email: this.candidateForm.value.email,
        clientResponse: captcha
      };

      // this.apiService.OffCampusCandidateRegistrationForm(datas).subscribe(
      //   (data: any) => {
      //     this.appConfig.success(
      //       `Your registration is successful. Please check your mailbox to complete the email verification process.`,
      //       ""
      //     );
      //     this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
      //   },
      //   (error) => {}
      // );
    } else {
      this.validateAllFields(this.candidateForm);
    }
  }
  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  signIn() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.LOGIN);
  }

  checkCaptchaSignIn(captchaSignIn) {
    if (this.recaptchaStr) {
      captchaSignIn.reset();
    }
    captchaSignIn.execute();
  }
  resolvedSignIn(captchaSignInResponse: string) {
    this.recaptchaStr = captchaSignInResponse;
    if (this.recaptchaStr) {
        this.submit(this.recaptchaStr);
    }
  }

  onError(errorDetails: RecaptchaErrorParameters): void {}
}
