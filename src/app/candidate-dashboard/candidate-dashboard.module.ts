import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateDashboardRoutingModule } from './candidate-dashboard-routing.module';
import { MasterDashboardComponent } from './master-dashboard.component';
import { CandidateDashboardHeaderComponent } from './candidate-dashboard-header/candidate-dashboard-header.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { PersonalDetailsComponent } from './candidate-profile/personal-details/personal-details.component';
import { EducationalDetailsComponent } from './candidate-profile/educational-details/educational-details.component';
import { FamilyDetailsComponent } from './candidate-profile/family-details/family-details.component';
import { GeneralDetailsComponent } from './candidate-profile/general-details/general-details.component';
import { ViewDetailsComponent } from './candidate-profile/view-details/view-details.component';
import { ConfirmComponent } from './candidate-profile/confirm/confirm.component';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';
import { KycSubmissionPageComponent } from './kyc-submission-page/kyc-submission-page.component';
import { CandidateHallticketComponent } from './candidate-hallticket/candidate-hallticket.component';
import { CandidateAssignedAssessmentListComponent } from './candidate-hallticket/candidate-assigned-assessment-list/candidate-assigned-assessment-list.component';
import { CandidateMainDashboardComponent } from './candidate-main-dashboard/candidate-main-dashboard.component';
import { CandidateDocumentComponent } from './candidate-document/candidate-document.component';
import { CandidateUploadDocumentComponent } from './candidate-document/candidate-upload-document/candidate-upload-document.component';


@NgModule({
  declarations: [MasterDashboardComponent, CandidateDashboardHeaderComponent, CandidateProfileComponent, PersonalDetailsComponent, EducationalDetailsComponent, FamilyDetailsComponent, GeneralDetailsComponent, ViewDetailsComponent, ConfirmComponent, KycSubmissionPageComponent, CandidateHallticketComponent, CandidateAssignedAssessmentListComponent, CandidateMainDashboardComponent, CandidateDocumentComponent, CandidateUploadDocumentComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    CandidateDashboardRoutingModule
  ],
  providers: [CanDeactivateGuard]
})
export class CandidateDashboardModule { }
