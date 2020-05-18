import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { RegisterpageComponent } from './registerpage/registerpage.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { OtpComponent } from './otp/otp.component';
import { SignupComponent } from './signup/signup.component';
import { CreateComponent } from './create/create.component';
import { CandidateRegisterComponent } from './candidate-register/candidate-register.component';
import { ForgoPasswordComponent } from './forgo-password/forgo-password.component';
import { OtpForgotPasswordComponent } from './otp-forgot-password/otp-forgot-password.component';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';


@NgModule({
  declarations: [HomepageComponent, LoginpageComponent, RegisterpageComponent, OtpComponent, SignupComponent, CreateComponent, CandidateRegisterComponent, ForgoPasswordComponent, OtpForgotPasswordComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    MaterialModule
  ],
  entryComponents: [SnackbarComponent]
})
export class LoginModule { }
