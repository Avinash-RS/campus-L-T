import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnauthenticatedRoutingModule } from './unauthenticated-routing.module';
import { VideoAssessEvaluationComponent } from './video-assess-evaluation/video-assess-evaluation.component';
import { SharedModule } from '../shared/shared.module';
import { OffCampusMasterComponent } from './off-campus-master/off-campus-master.component';
import { OffCampusProfileComponent } from './off-campus-master/off-campus-profile/off-campus-profile.component';
import { OffCampusSubmittedConfirmationComponent } from './off-campus-master/off-campus-submitted-confirmation/off-campus-submitted-confirmation.component';
import { OffCampusEmailConfirmationComponent } from './off-campus-master/off-campus-email-confirmation/off-campus-email-confirmation.component';
import { FormClosedComponent } from './off-campus-master/form-closed/form-closed.component';


@NgModule({
  declarations: [VideoAssessEvaluationComponent, OffCampusMasterComponent, OffCampusProfileComponent, OffCampusSubmittedConfirmationComponent, OffCampusEmailConfirmationComponent, FormClosedComponent],
  imports: [
    CommonModule,
    UnauthenticatedRoutingModule,
    SharedModule
  ]
})
export class UnauthenticatedModule { }
