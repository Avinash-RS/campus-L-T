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


const routes: Routes = [
  {
    path: 'home', component: HomepageComponent
  },
  {
    path: 'corporate', component: RegisterpageComponent
  },
  {
    path: 'institute', component: RegisterpageComponent
  },
  {
    path: 'candidate', component: CandidateRegisterComponent
  },
  {
    path: 'signup', component: SignupComponent, children: [
      {
        path: 'otp', component: OtpComponent
      },
      {
        path: 'create', component: CreateComponent
      },
      {
        path: 'reset-password', component: CreateComponent
      },
      {
        path: 'login', component: LoginpageComponent
      },
      {
        path: 'forgot-password', component: ForgoPasswordComponent
      },
      {
        path: 'otp-password', component: OtpForgotPasswordComponent
      },
      {
        path: '',
        redirectTo: 'otp',
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
