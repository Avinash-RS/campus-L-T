import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnauthenticatedRoutingModule } from './unauthenticated-routing.module';
import { VideoAssessEvaluationComponent } from './video-assess-evaluation/video-assess-evaluation.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [VideoAssessEvaluationComponent],
  imports: [
    CommonModule,
    UnauthenticatedRoutingModule,
    SharedModule
  ]
})
export class UnauthenticatedModule { }
