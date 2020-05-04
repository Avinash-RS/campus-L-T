import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { RegisterpageComponent } from './registerpage/registerpage.component';
import { OtpComponent } from './otp/otp.component';
import { SignupComponent } from './signup/signup.component';
import { CreateComponent } from './create/create.component';
import { HomepageComponent } from './homepage/homepage.component';


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
    path: 'signup', component: SignupComponent, children: [
      {
        path: 'otp', component: OtpComponent
      },
      {
        path: 'create', component: CreateComponent
      },
      {
        path: 'login', component: LoginpageComponent
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
