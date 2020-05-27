import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-otp-forgot-password',
  templateUrl: './otp-forgot-password.component.html',
  styleUrls: ['./otp-forgot-password.component.scss']
})
export class OtpForgotPasswordComponent implements OnInit {

  otp1 = new FormControl('', Validators.required);
  otp2 = new FormControl('', Validators.required);
  otp3 = new FormControl('', Validators.required);
  otp4 = new FormControl('', Validators.required);
  OTPreSend: boolean;
  constructor(
    private router: Router,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
  }


  OTPVerify() {
    if (this.otp1.valid && this.otp2.valid && this.otp3.valid && this.otp4.valid) {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.PASSWORD.RESET);
    } else {
      this.otp1.markAsTouched();
      this.otp2.markAsTouched();
      this.otp3.markAsTouched();
      this.otp4.markAsTouched();
    }
  }

  resendOTP() {
    this.OTPreSend = true;
  }

}
