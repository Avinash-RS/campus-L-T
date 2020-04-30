import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  hide = false;

  mobileCodes = [
    {
      codeId: '0',
      code: '+91'
    },
    {
      codeId: '1',
      code: '+92'
    },
    {
      codeId: '2',
      code: '+93'
    },
    {
      codeId: '3',
      code: '+94'
    },
    {
      codeId: '4',
      code: '+95'
    },
    {
      codeId: '5',
      code: '+96'
    }
  ];
  mobileCode = this.mobileCodes[0];
  mobileRegex: RegExp = /^[1-9][0-9]{9}$/;
  mobileNumber = new FormControl('', [Validators.required, Validators.pattern(this.mobileRegex)]);
  otp1 = new FormControl('', Validators.required);
  otp2 = new FormControl('', Validators.required);
  otp3 = new FormControl('', Validators.required);
  otp4 = new FormControl('', Validators.required);
  OTPreSend: boolean;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  sendOTP() {
    if (this.mobileNumber.valid) {
      this.hide = !this.hide;
    } else {
      this.mobileNumber.markAsTouched();
    }
  }

  OTPVerify() {
    if (this.otp1.valid && this.otp2.valid && this.otp3.valid && this.otp4.valid) {
      this.router.navigate(['./signup/create']);
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

  selectedCode(code) {
    this.mobileCode = code;
  }

}
