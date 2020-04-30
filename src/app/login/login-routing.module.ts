import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { RegisterpageComponent } from './registerpage/registerpage.component';
import { OtpComponent } from './otp/otp.component';
import { SignupComponent } from './signup/signup.component';
import { CreateComponent } from './create/create.component';


const routes: Routes = [
  {
    path: 'login', component: LoginpageComponent
  },
  {
    path: 'register', component: RegisterpageComponent
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
        path: '',
        redirectTo: 'otp',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
