import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateDashboardRoutingModule } from './candidate-dashboard-routing.module';
import { MasterDashboardComponent } from './master-dashboard.component';
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
import { RegistrationCloseComponent } from './registration-close/registration-close.component';
import { JoiningFormComponent } from './candidate-joining-form/joining-form/joining-form.component';
import { JoiningPersonalComponent } from './candidate-joining-form/joining-personal/joining-personal.component';
import { JoiningContactComponent } from './candidate-joining-form/joining-contact/joining-contact.component';
import { JoiningDependentComponent } from './candidate-joining-form/joining-dependent/joining-dependent.component';
import { JoiningEducationComponent } from './candidate-joining-form/joining-education/joining-education.component';
import { JoiningUploadComponent } from './candidate-joining-form/joining-upload/joining-upload.component';
import { JoiningPreviewComponent } from './candidate-joining-form/joining-preview/joining-preview.component';
import { JoiningSubmitComponent } from './candidate-joining-form/joining-submit/joining-submit.component';
import { JoiningWorkDetailsComponent } from './candidate-joining-form/joining-work-details/joining-work-details.component';
import { CandidateFaqComponent } from './candidate-faq/candidate-faq.component';
// import { JoinInterviewComponent } from './join-interview/join-interview.component';


@NgModule({
  declarations: [MasterDashboardComponent, CandidateProfileComponent, PersonalDetailsComponent, EducationalDetailsComponent, FamilyDetailsComponent, GeneralDetailsComponent, ViewDetailsComponent, ConfirmComponent, KycSubmissionPageComponent, CandidateHallticketComponent, CandidateAssignedAssessmentListComponent, CandidateMainDashboardComponent, CandidateDocumentComponent, CandidateUploadDocumentComponent, RegistrationCloseComponent, JoiningFormComponent, JoiningPersonalComponent, JoiningContactComponent, JoiningDependentComponent, JoiningEducationComponent, JoiningUploadComponent, JoiningPreviewComponent, JoiningSubmitComponent, JoiningWorkDetailsComponent, CandidateFaqComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    CandidateDashboardRoutingModule
  ],
  providers: [CanDeactivateGuard]
})
export class CandidateDashboardModule { }
