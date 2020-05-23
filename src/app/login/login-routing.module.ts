import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { RegisterpageComponent } from './registerpage/registerpage.component';
import { OtpComponent } from './otp/otp.component';
import { SignupComponent } from './signup/signup.component';
import { CreateComponent } from './create/create.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CandidateRegisterComponent } from './candidate-register/candidate-register.component';
import { ForgoPasswordComponent } from './forgo-password/forgo-password.component';
import { OtpForgotPasswordComponent } from './otp-forgot-password/otp-forgot-password.component';

import { CONSTANT } from '../../app/constants/app-constants.service';
import { EmailVerifierErrorPageComponent } from './email-verifier-error-page/email-verifier-error-page.component';

const routes: Routes = [
  {
    path: ``, redirectTo: `${CONSTANT.ROUTES.HOME}`
  },
  {
    path: `${CONSTANT.ROUTES.HOME}`, component: HomepageComponent
  },
  {
    path: `${CONSTANT.ROUTES.REGISTER.CORPORATE}`, component: RegisterpageComponent
  },
  {
    path: `${CONSTANT.ROUTES.REGISTER.INSTITUTE}`, component: RegisterpageComponent
  },
  {
    path: `${CONSTANT.ROUTES.REGISTER.CANDIDATE}`, component: CandidateRegisterComponent
  },
  {
    path: `${CONSTANT.ROUTES.VERIFY.EMAIL_ERROR}`, component: EmailVerifierErrorPageComponent
  },
  {
    path: '', component: SignupComponent, children: [
      {
        path: `${CONSTANT.ROUTES.VERIFY.OTP}`, component: OtpComponent
      },
      {
        path: `${CONSTANT.ROUTES.PASSWORD.SETUP}`, component: CreateComponent
      },
      {
        path: `${CONSTANT.ROUTES.PASSWORD.FORGOT}`, component: ForgoPasswordComponent
      },
      {
        path: `${CONSTANT.ROUTES.PASSWORD.RESET}`, component: CreateComponent
      },
      {
        path: `${CONSTANT.ROUTES.VERIFY.OTP_PASSWORD}`, component: OtpForgotPasswordComponent
      },
      {
        path: `${CONSTANT.ROUTES.LOGIN}`, component: LoginpageComponent
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.VERIFY.OTP}`,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
