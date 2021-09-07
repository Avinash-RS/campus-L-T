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
import { ApplyCriteriaComponent } from './hr-shortlisting/first-level-shortlist/apply-criteria/apply-criteria.component';
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
import { SecondLevelCandidateListofAssessComponent } from './hr-shortlisting/second-level-shortlist/second-level-candidate-listof-assess/second-level-candidate-listof-assess.component';
import { SharedSubHeaderSecondLevelShortlistComponent } from './hr-shortlisting/second-level-shortlist/shared-sub-header-second-level-shortlist/shared-sub-header-second-level-shortlist.component';
import { SecondLevelShortlistedCandidatesReportComponent } from './hr-shortlisting/second-level-shortlist/second-level-shortlisted-candidates-report/second-level-shortlisted-candidates-report.component';
import { HrEvaluationMainScreenComponent } from './evaluation/hr-evaluation-main-screen/hr-evaluation-main-screen.component';
import { HrSubAssessmentsComponent } from './evaluation/hr-evaluation-main-screen/hr-sub-assessments/hr-sub-assessments.component';
import { HrSubEducationComponent } from './evaluation/hr-evaluation-main-screen/hr-sub-education/hr-sub-education.component';
import { HrSubEmploymentComponent } from './evaluation/hr-evaluation-main-screen/hr-sub-employment/hr-sub-employment.component';
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
ModuleRegistry.registerModules(AllModules);

@NgModule({
  declarations: [HrMasterComponent, HrShortlistingComponent, FirstLevelShortlistComponent, HrMainDashboardComponent, HrUserManagementComponent, ApplyCriteriaComponent, ShortlistedCandidateListComponent, HrReportsComponent, ReportsListComponent, FirstLevelShorlistReportsComponent, EvaluationComponent, UserListComponent, HrCandidateStatusComponent, HrPreAssessmentComponent, HrRecruitmentComponent, SecondLevelShortlistComponent, SecondLevelAssessmentListComponent, SecondLevelCandidateListofAssessComponent, SharedSubHeaderSecondLevelShortlistComponent, SecondLevelShortlistedCandidatesReportComponent, HrEvaluationMainScreenComponent, HrSubAssessmentsComponent, HrSubEducationComponent, HrSubEmploymentComponent, SubSharedEvaluationHeaderComponent, NewInterviewpanelAssignmentScreenComponent, NewInterviewpanelAssignedDetailsComponent, NewInterviewpanelResultsUploadComponent, IcAddorListComponent, OfferedCandidatesListComponent, AddICComponent, ListofICComponent, UploadSelectedCandidatesComponent, ListofSelectedCandidatesComponent, UploadSelectedCandidatesErrorReportComponent, BusinesspanelRouteComponent, SscUploadSectionComponent, BulkUploadsComponent, ClickableStatusBarComponent],

  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    HrDashboardRoutingModule,
    AgGridModule.withComponents([ClickableStatusBarComponent]),
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class HrDashboardModule { }
