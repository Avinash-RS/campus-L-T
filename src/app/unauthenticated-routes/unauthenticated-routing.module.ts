import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANT } from '../constants/app-constants.service';
import { VideoAssessEvaluationComponent } from './video-assess-evaluation/video-assess-evaluation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: `${CONSTANT.ROUTES.UNAUTHENTICATED.VIDEO_ASSESS}`,
    component: VideoAssessEvaluationComponent,
    data: {
      breadcrumb: 'Video Assessment Evaluation'
    }
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
