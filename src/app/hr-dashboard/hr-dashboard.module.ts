import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrDashboardRoutingModule } from './hr-dashboard-routing.module';
import { HrMasterComponent } from './hr-master.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { HrShortlistingComponent } from './hr-shortlisting/hr-shortlisting.component';
import { FirstLevelShortlistComponent } from './hr-shortlisting/first-level-shortlist/first-level-shortlist.component';
import { HrMainDashboardComponent } from './hr-main-dashboard/hr-main-dashboard.component';
import { HrUserManagementComponent } from './hr-user-management/hr-user-management.component';
import { ShortlistedCandidateListComponent } from './hr-shortlisting/first-level-shortlist/shortlisted-candidate-list/shortlisted-candidate-list.component';
import { HrReportsComponent } from './hr-reports/hr-reports.component';
import { ReportsListComponent } from './hr-reports/reports-list/reports-list.component';
import { FirstLevelShorlistReportsComponent } from './hr-reports/first-level-shorlist-reports/first-level-shorlist-reports.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { UserListComponent } from './hr-user-management/user-list/user-list.component';
import { HrCandidateStatusComponent } from './hr-candidate-status/hr-candidate-status.component';
import { HrPreAssessmentComponent } from './hr-candidate-status/hr-pre-assessment/hr-pre-assessment.component';
import { HrRecruitmentComponent } from './hr-candidate-status/hr-recruitment/hr-recruitment.component';
import { SecondLevelShortlistComponent } from './hr-shortlisting/second-level-shortlist/second-level-shortlist.component';
import { SecondLevelAssessmentListComponent } from './hr-shortlisting/second-level-shortlist/second-level-assessment-list/second-level-assessment-list.component';
import { SecondLevelCandidateListofAssessComponent } from './hr-shortlisting/second-level-shortlist/second-level-assessment-list/second-level-candidate-listof-assess/second-level-candidate-listof-assess.component';
import { SharedSubHeaderSecondLevelShortlistComponent } from './hr-shortlisting/second-level-shortlist/second-level-assessment-list/shared-sub-header-second-level-shortlist/shared-sub-header-second-level-shortlist.component';
import { SecondLevelShortlistedCandidatesReportComponent } from './hr-shortlisting/second-level-shortlist/second-level-assessment-list/second-level-shortlisted-candidates-report/second-level-shortlisted-candidates-report.component';
import { HrEvaluationMainScreenComponent } from './evaluation/new-interviewpanel-assigned-details/hr-evaluation-main-screen/hr-evaluation-main-screen.component';
import { HrSubAssessmentsComponent } from './evaluation/new-interviewpanel-assigned-details/hr-evaluation-main-screen/hr-sub-assessments/hr-sub-assessments.component';
import { HrSubEducationComponent } from './evaluation/new-interviewpanel-assigned-details/hr-evaluation-main-screen/hr-sub-education/hr-sub-education.component';
import { HrSubEmploymentComponent } from './evaluation/new-interviewpanel-assigned-details/hr-evaluation-main-screen/hr-sub-employment/hr-sub-employment.component';
import { SubSharedEvaluationHeaderComponent } from './evaluation/sub-shared-evaluation-header/sub-shared-evaluation-header.component';
import { NewInterviewpanelAssignmentScreenComponent } from './evaluation/new-interviewpanel-assignment-screen/new-interviewpanel-assignment-screen.component';
import { NewInterviewpanelAssignedDetailsComponent } from './evaluation/new-interviewpanel-assigned-details/new-interviewpanel-assigned-details.component';
import { AgGridModule } from 'ag-grid-angular';
import { NewInterviewpanelResultsUploadComponent } from './evaluation/new-interviewpanel-results-upload/new-interviewpanel-results-upload.component';
import { IcAddorListComponent } from './pages/ic-AddorList/ic-addor-list.component';
import { OfferedCandidatesListComponent } from './pages/offered-candidates-list/offered-candidates-list.component';
import { AddICComponent } from './pages/add-ic/add-ic.component';
import { ListofICComponent } from './pages/listof-ic/listof-ic.component';
import { UploadSelectedCandidatesComponent } from './pages/upload-selected-candidates/upload-selected-candidates.component';
import { ListofSelectedCandidatesComponent } from './pages/listof-selected-candidates/listof-selected-candidates.component';
import { UploadSelectedCandidatesErrorReportComponent } from './pages/upload-selected-candidates-error-report/upload-selected-candidates-error-report.component';
import { BusinesspanelRouteComponent } from './pages/businesspanel-route/businesspanel-route.component';
import { SscUploadSectionComponent } from './pages/ssc-upload-section/ssc-upload-section.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ModuleRegistry, AllModules } from '@ag-grid-enterprise/all-modules';
import { BulkUploadsComponent } from './hr-user-management/bulk-uploads/bulk-uploads.component';
import { ClickableStatusBarComponent } from './hr-shortlisting/first-level-shortlist/shortlisted-candidate-list/custom-get-selected-rows-count';
import { ScheduleInterviewPopupComponent } from './pages/schedule-interview-popup/schedule-interview-popup.component';
import { AssignedDetailsComponent } from './evaluation/new-interviewpanel-assigned-details/assigned-details/assigned-details.component';
import { ScheduleVideoAssessComponent } from './hr-shortlisting/second-level-shortlist/hr-video-assess/schedule-video-assess/schedule-video-assess.component';
import { EvaluatorAssignForVideoAssessComponent } from './pages/evaluator-assign-for-video-assess/evaluator-assign-for-video-assess.component';
import { RouteEvaluatorAssignForVideoAssessComponent } from './pages/route-evaluator-assign-for-video-assess/route-evaluator-assign-for-video-assess.component';
import { HrSubInterviewResultsComponent } from './evaluation/new-interviewpanel-assigned-details/hr-evaluation-main-screen/hr-sub-interview-results/hr-sub-interview-results.component';
import { DashboardOverviewComponent } from './pages/HR-Dashboard-Pages/dashboard-overview/dashboard-overview.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MiscellaneousMasterComponent } from './pages/miscellaneous-master/miscellaneous-master.component';
import { MiscCollegesComponent } from './pages/misc-colleges/misc-colleges.component';
import { MiscCandidateNameChangeComponent } from './pages/misc-candidate-name-change/misc-candidate-name-change.component';
import { EmailTriggerMasterComponent } from './pages/email-trigger-master/email-trigger-master.component';
import { EmailTriggerFunctionComponent } from './pages/email-trigger-master/email-trigger-function/email-trigger-function.component';
import { EmailJobsMasterComponent } from './pages/email-jobs-master/email-jobs-master.component';
import { EmailJobsComponent } from './pages/email-jobs-master/email-jobs/email-jobs.component';
import { SelectedCandidateComponent } from './pages/email-trigger-master/email-trigger-function/selected-candidate/selected-candidate.component';
import { ChooseTemplateComponent } from './pages/email-trigger-master/email-trigger-function/choose-template/choose-template.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BatchwiseEmailJobsComponent } from './pages/email-jobs-master/batchwise-email-jobs/batchwise-email-jobs.component';
import { EmailTriggerPreviewComponent } from './pages/email-trigger-master/email-trigger-function/email-trigger-preview/email-trigger-preview.component';
import { EmailTriggerConfirmationComponent } from './pages/email-trigger-master/email-trigger-function/email-trigger-confirmation/email-trigger-confirmation.component';
ModuleRegistry.registerModules(AllModules);

@NgModule({
  declarations: [HrMasterComponent, HrShortlistingComponent, FirstLevelShortlistComponent, HrMainDashboardComponent, HrUserManagementComponent, ShortlistedCandidateListComponent, HrReportsComponent, ReportsListComponent, FirstLevelShorlistReportsComponent, EvaluationComponent, UserListComponent, HrCandidateStatusComponent, HrPreAssessmentComponent, HrRecruitmentComponent, SecondLevelShortlistComponent, SecondLevelAssessmentListComponent, SecondLevelCandidateListofAssessComponent, SharedSubHeaderSecondLevelShortlistComponent, SecondLevelShortlistedCandidatesReportComponent, HrEvaluationMainScreenComponent, HrSubAssessmentsComponent, HrSubEducationComponent, HrSubEmploymentComponent, SubSharedEvaluationHeaderComponent, NewInterviewpanelAssignmentScreenComponent, NewInterviewpanelAssignedDetailsComponent, NewInterviewpanelResultsUploadComponent, IcAddorListComponent, OfferedCandidatesListComponent, AddICComponent, ListofICComponent, UploadSelectedCandidatesComponent, ListofSelectedCandidatesComponent, UploadSelectedCandidatesErrorReportComponent, BusinesspanelRouteComponent, SscUploadSectionComponent, BulkUploadsComponent, ClickableStatusBarComponent, ScheduleInterviewPopupComponent, AssignedDetailsComponent, ScheduleVideoAssessComponent, EvaluatorAssignForVideoAssessComponent, RouteEvaluatorAssignForVideoAssessComponent, HrSubInterviewResultsComponent, DashboardOverviewComponent, MiscellaneousMasterComponent, MiscCollegesComponent, MiscCandidateNameChangeComponent, EmailTriggerMasterComponent, EmailTriggerFunctionComponent, EmailJobsMasterComponent, EmailJobsComponent, SelectedCandidateComponent, ChooseTemplateComponent, BatchwiseEmailJobsComponent, EmailTriggerPreviewComponent, EmailTriggerConfirmationComponent],

  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    HrDashboardRoutingModule,
    AgGridModule.withComponents([ClickableStatusBarComponent]),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxSkeletonLoaderModule,
    AngularFontAwesomeModule,
    AngularEditorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  entryComponents: [ScheduleInterviewPopupComponent]
})
export class HrDashboardModule { }
