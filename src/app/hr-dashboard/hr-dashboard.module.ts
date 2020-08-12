import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrDashboardRoutingModule } from './hr-dashboard-routing.module';
import { HrMasterComponent } from './hr-master.component';
import { HrHeaderComponent } from './hr-header/hr-header.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { HrShortlistingComponent } from './hr-shortlisting/hr-shortlisting.component';
import { FirstLevelShortlistComponent } from './hr-shortlisting/first-level-shortlist/first-level-shortlist.component';
import { HrMainDashboardComponent } from './hr-main-dashboard/hr-main-dashboard.component';
import { HrUserManagementComponent } from './hr-user-management/hr-user-management.component';
import { ApplyCriteriaComponent } from './hr-shortlisting/first-level-shortlist/apply-criteria/apply-criteria.component';
import { ShortlistedCandidateListComponent } from './hr-shortlisting/first-level-shortlist/shortlisted-candidate-list/shortlisted-candidate-list.component';
import { BulkUploadComponent } from './hr-user-management/candidate-bulk-upload/bulk-upload/bulk-upload.component';
import { UploadedListComponent } from './hr-user-management/candidate-bulk-upload/uploaded-list/uploaded-list.component';
import { HrReportsComponent } from './hr-reports/hr-reports.component';
import { ReportsListComponent } from './hr-reports/reports-list/reports-list.component';
import { FirstLevelShorlistReportsComponent } from './hr-reports/first-level-shorlist-reports/first-level-shorlist-reports.component';
import { BulkUploadReportsComponent } from './hr-reports/bulk-upload-reports/bulk-upload-reports.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { EvaluationCandidateDetailsComponent } from './evaluation/evaluation-candidate-details/evaluation-candidate-details.component';
import { EvaluationInterviewPanelComponent } from './evaluation/evaluation-interview-panel/evaluation-interview-panel.component';
import { AssessmentDetailsComponent } from './evaluation/assessment-details/assessment-details.component';
import { AssessmentCandidateDetailsComponent } from './evaluation/assessment-candidate-details/assessment-candidate-details.component';
import { UserListComponent } from './hr-user-management/user-list/user-list.component';
import { HrAddUserComponent } from './hr-user-management/hr-add-user/hr-add-user.component';
import { HrCandidateStatusComponent } from './hr-candidate-status/hr-candidate-status.component';
import { HrPreAssessmentComponent } from './hr-candidate-status/hr-pre-assessment/hr-pre-assessment.component';
import { HrRecruitmentComponent } from './hr-candidate-status/hr-recruitment/hr-recruitment.component';
import { CandidateBulkUploadComponent } from './hr-user-management/candidate-bulk-upload/candidate-bulk-upload.component';
import { InterviewPanelBulkUploadComponent } from './hr-user-management/interview-panel-bulk-upload/interview-panel-bulk-upload.component';
import { InvpanelBulkuploadComponent } from './hr-user-management/interview-panel-bulk-upload/invpanel-bulkupload/invpanel-bulkupload.component';
import { UploadTestResultsComponent } from './hr-shortlisting/upload-test-results/upload-test-results.component';
import { SecondLevelShortlistComponent } from './hr-shortlisting/second-level-shortlist/second-level-shortlist.component';
import { SecondLevelAssessmentListComponent } from './hr-shortlisting/second-level-shortlist/second-level-assessment-list/second-level-assessment-list.component';
import { SecondLevelCandidateListofAssessComponent } from './hr-shortlisting/second-level-shortlist/second-level-candidate-listof-assess/second-level-candidate-listof-assess.component';
import { SharedSubHeaderSecondLevelShortlistComponent } from './hr-shortlisting/second-level-shortlist/shared-sub-header-second-level-shortlist/shared-sub-header-second-level-shortlist.component';
import { ShortlistedCandidateListSecondLevelComponent } from './hr-shortlisting/second-level-shortlist/shortlisted-candidate-list-second-level/shortlisted-candidate-list-second-level.component';
import { SecondLevelShortlistedCandidatesReportComponent } from './hr-shortlisting/second-level-shortlist/second-level-shortlisted-candidates-report/second-level-shortlisted-candidates-report.component';
import { InterviewpanelDetailsComponent } from './evaluation/interviewpanel-details/interviewpanel-details.component';
import { InterviewpanelSelectComponent } from './evaluation/interviewpanel-select/interviewpanel-select.component';
import { SecondLevelAssessmentReportsComponent } from './hr-shortlisting/second-level-shortlist/second-level-assessment-reports/second-level-assessment-reports.component';
import { SharedEvaluationSubHeaderComponent } from './evaluation/shared-evaluation-sub-header/shared-evaluation-sub-header.component';
import { EvalutionInterviewpanelFormComponent } from './evaluation/evalution-interviewpanel-form/evalution-interviewpanel-form.component';
import { HrEvaluationMainScreenComponent } from './evaluation/hr-evaluation-main-screen/hr-evaluation-main-screen.component';
import { HrSubAssessmentsComponent } from './evaluation/hr-evaluation-main-screen/hr-sub-assessments/hr-sub-assessments.component';
import { HrSubEducationComponent } from './evaluation/hr-evaluation-main-screen/hr-sub-education/hr-sub-education.component';
import { HrSubEmploymentComponent } from './evaluation/hr-evaluation-main-screen/hr-sub-employment/hr-sub-employment.component';
import { SubSharedEvaluationHeaderComponent } from './evaluation/sub-shared-evaluation-header/sub-shared-evaluation-header.component';
import { InvpanelBulkUploadReportComponent } from './hr-reports/invpanel-bulk-upload-report/invpanel-bulk-upload-report.component';


@NgModule({
  declarations: [HrMasterComponent, HrHeaderComponent, HrShortlistingComponent, FirstLevelShortlistComponent, HrMainDashboardComponent, HrUserManagementComponent, BulkUploadComponent, ApplyCriteriaComponent, ShortlistedCandidateListComponent, UploadedListComponent, HrReportsComponent, ReportsListComponent, FirstLevelShorlistReportsComponent, BulkUploadReportsComponent, EvaluationComponent, EvaluationCandidateDetailsComponent, EvaluationInterviewPanelComponent, AssessmentDetailsComponent, AssessmentCandidateDetailsComponent, UserListComponent, HrAddUserComponent, HrCandidateStatusComponent, HrPreAssessmentComponent, HrRecruitmentComponent, CandidateBulkUploadComponent, InterviewPanelBulkUploadComponent, InvpanelBulkuploadComponent, UploadTestResultsComponent, SecondLevelShortlistComponent, SecondLevelAssessmentListComponent, SecondLevelCandidateListofAssessComponent, SharedSubHeaderSecondLevelShortlistComponent, ShortlistedCandidateListSecondLevelComponent, SecondLevelShortlistedCandidatesReportComponent, InterviewpanelDetailsComponent, InterviewpanelSelectComponent, SecondLevelAssessmentReportsComponent, EvalutionInterviewpanelFormComponent, SharedEvaluationSubHeaderComponent, HrEvaluationMainScreenComponent, HrSubAssessmentsComponent, HrSubEducationComponent, HrSubEmploymentComponent, SubSharedEvaluationHeaderComponent, InvpanelBulkUploadReportComponent],

  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    HrDashboardRoutingModule,
  ]
})
export class HrDashboardModule { }
