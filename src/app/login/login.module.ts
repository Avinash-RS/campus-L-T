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
import { EmailVerifierErrorPageComponent } from './email-verifier-error-page/email-verifier-error-page.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  declarations: [HomepageComponent, LoginpageComponent, RegisterpageComponent, OtpComponent, SignupComponent, CreateComponent, CandidateRegisterComponent, ForgoPasswordComponent, OtpForgotPasswordComponent, EmailVerifierErrorPageComponent, MaintenanceComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    MaterialModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
})
export class LoginModule { }
