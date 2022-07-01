import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANT } from '../constants/app-constants.service';
import { VideoAssessEvaluationComponent } from './video-assess-evaluation/video-assess-evaluation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OffCampusMasterComponent } from './off-campus-master/off-campus-master.component';
import { OffCampusProfileComponent } from './off-campus-master/off-campus-profile/off-campus-profile.component';
import { OffCampusSubmittedConfirmationComponent } from './off-campus-master/off-campus-submitted-confirmation/off-campus-submitted-confirmation.component';
import { OffCampusEmailConfirmationComponent } from './off-campus-master/off-campus-email-confirmation/off-campus-email-confirmation.component';


const routes: Routes = [
  {
    path: `${CONSTANT.ROUTES.UNAUTHENTICATED.VIDEO_ASSESS}`,
    component: VideoAssessEvaluationComponent,
    data: {
      breadcrumb: 'Video Assessment Evaluation'
    }
  },
  {
    path: `${CONSTANT.ROUTES.UNAUTHENTICATED.OFF_CAMPUS}`,
    component: OffCampusMasterComponent,
    data: {
      breadcrumb: 'Off-Campus'
    },
    children: [
      {
        path: `${CONSTANT.ROUTES.UNAUTHENTICATED.OFF_CAMPUS_PROFILE}`,
        component: OffCampusProfileComponent,
        data: {
          breadcrumb: 'Profile'
        }
      },
      {
        path: `${CONSTANT.ROUTES.UNAUTHENTICATED.OFF_CAMPUS_THANKS}`,
        component: OffCampusSubmittedConfirmationComponent,
        data: {
          breadcrumb: 'Thanks'
        }
      },
      {
        path: `${CONSTANT.ROUTES.UNAUTHENTICATED.OFF_CAMPUS_EMAIL}`,
        component: OffCampusEmailConfirmationComponent,
        data: {
          breadcrumb: 'Email Confirmation'
        }
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.UNAUTHENTICATED.OFF_CAMPUS_PROFILE}`,
        pathMatch: 'full',
      }
    ],
  },
  {
    path: `error`,
    pathMatch: 'full',
    component: PageNotFoundComponent
  },
  {
    path: '',
    redirectTo: `error`,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnauthenticatedRoutingModule { }
