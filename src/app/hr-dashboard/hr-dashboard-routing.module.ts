import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrMasterComponent } from './hr-master.component';
import { CONSTANT } from '../constants/app-constants.service';
import { DashboardComponent } from '../admin-dashboard/dashboard/dashboard.component';
import { AdmincanloadGuard } from '../guards/canload/admincanload.guard';
import { UserManagementComponent } from '../admin-dashboard/user-management/user-management.component';
import { UsersListComponent } from '../admin-dashboard/user-management/users-list/users-list.component';
import { AddUserComponent } from '../admin-dashboard/user-management/add-user/add-user.component';
import { HrMainDashboardComponent } from './hr-main-dashboard/hr-main-dashboard.component';
import { HrShortlistingComponent } from './hr-shortlisting/hr-shortlisting.component';
import { FirstLevelShortlistComponent } from './hr-shortlisting/first-level-shortlist/first-level-shortlist.component';
import { HrcanloadGuard } from '../guards/canload/hrcanload.guard';
import { HrUserManagementComponent } from './hr-user-management/hr-user-management.component';
import { BulkUploadComponent } from './hr-user-management/candidate-bulk-upload/bulk-upload/bulk-upload.component';
import { ApplyCriteriaComponent } from './hr-shortlisting/first-level-shortlist/apply-criteria/apply-criteria.component';
import { ShortlistedCandidateListComponent } from './hr-shortlisting/first-level-shortlist/shortlisted-candidate-list/shortlisted-candidate-list.component';
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
import { InterviewpanelDetailsComponent } from './evaluation/interviewpanel-details/interviewpanel-details.component';
import { InterviewpanelSelectComponent } from './evaluation/interviewpanel-select/interviewpanel-select.component';


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
import { SecondLevelShortlistedCandidatesReportComponent } from './hr-shortlisting/second-level-shortlist/second-level-shortlisted-candidates-report/second-level-shortlisted-candidates-report.component';

const routes: Routes = [
  {
    path: '', component: HrMasterComponent,
    children: [
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.DASHBOARD}`, component: HrMainDashboardComponent, canActivate: [HrcanloadGuard]
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.SHORTLISTING}`, component: HrShortlistingComponent, canActivate: [HrcanloadGuard], children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING}`, component: FirstLevelShortlistComponent, children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING_LIST}`, component: ShortlistedCandidateListComponent
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING_CRITERIA}`, component: ApplyCriteriaComponent
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING}`, component: SecondLevelShortlistComponent,
            children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_LIST}`, component: SecondLevelAssessmentListComponent
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.REPORTS_LIST}`, component: ReportsListComponent
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST}`, component: SecondLevelCandidateListofAssessComponent
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTED_CANDIDATE_REPORT}`, component: SecondLevelShortlistedCandidatesReportComponent
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.UPLOAD_TEST_RESULTS}`, component: UploadTestResultsComponent
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT}`, component: HrUserManagementComponent, children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS}`, component: CandidateBulkUploadComponent,
            children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`, component: UploadedListComponent
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD}`, component: BulkUploadComponent
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST}`, component: UserListComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_USER_MANAGEMENT_ADD_USERS}`, component: HrAddUserComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_INTERVIEW_PANEL_UPLOADS}`, component: InterviewPanelBulkUploadComponent,
            children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_INTERVIEW_PANEL_BULK_UPLOAD}`, component: InvpanelBulkuploadComponent
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_INTERVIEW_PANEL_BULK_UPLOAD}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS}`,
            pathMatch: 'full',
          }
        ]
      },

      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.EVALUATION}`, component: EvaluationComponent, children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS}`, component: EvaluationCandidateDetailsComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.ASSESSMENTDETAILS}`, component: AssessmentDetailsComponent
          },

          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.ASSESSMENTCANDIDATEDETAILS}`, component: AssessmentCandidateDetailsComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL}`, component: EvaluationInterviewPanelComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS}`, component: InterviewpanelDetailsComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS_SELECT}`, component: InterviewpanelSelectComponent
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.REPORTS}`, component: HrReportsComponent, children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRST_LEVEL_REPORTS_LIST}`, component: FirstLevelShorlistReportsComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.REPORTS_LIST}`, component: ReportsListComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.BULK_CANDIDATE_UPLOAD_REPORTS_LIST}`, component: BulkUploadReportsComponent
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRST_LEVEL_REPORTS_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_STATUS}`, component: HrCandidateStatusComponent, children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_STATUS_PREASSESSMENT}`, component: HrPreAssessmentComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_STATUS_RECRUITMENT}`, component: HrRecruitmentComponent
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_STATUS_PREASSESSMENT}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.DASHBOARD}`,
        pathMatch: 'full',

      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrDashboardRoutingModule { }
