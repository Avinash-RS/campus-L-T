import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnauthenticatedRoutingModule } from './unauthenticated-routing.module';
import { VideoAssessEvaluationComponent } from './video-assess-evaluation/video-assess-evaluation.component';
import { SharedModule } from '../shared/shared.module';
import { OffCampusMasterComponent } from './off-campus-master/off-campus-master.component';
import { OffCampusProfileComponent } from './off-campus-master/off-campus-profile/off-campus-profile.component';


@NgModule({
  declarations: [VideoAssessEvaluationComponent, OffCampusMasterComponent, OffCampusProfileComponent],
  imports: [
    CommonModule,
    UnauthenticatedRoutingModule,
    SharedModule
  ]
})
export class UnauthenticatedModule { }
