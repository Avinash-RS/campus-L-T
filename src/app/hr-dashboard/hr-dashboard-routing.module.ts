import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrMasterComponent } from './hr-master.component';
import { CONSTANT } from '../constants/app-constants.service';
import { HrMainDashboardComponent } from './hr-main-dashboard/hr-main-dashboard.component';
import { HrShortlistingComponent } from './hr-shortlisting/hr-shortlisting.component';
import { FirstLevelShortlistComponent } from './hr-shortlisting/first-level-shortlist/first-level-shortlist.component';
import { HrcanloadGuard } from '../guards/canload/hrcanload.guard';
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
import { SecondLevelShortlistedCandidatesReportComponent } from './hr-shortlisting/second-level-shortlist/second-level-shortlisted-candidates-report/second-level-shortlisted-candidates-report.component';
import { HrEvaluationMainScreenComponent } from './evaluation/new-interviewpanel-assigned-details/hr-evaluation-main-screen/hr-evaluation-main-screen.component';
import { NewInterviewpanelAssignmentScreenComponent } from './evaluation/new-interviewpanel-assignment-screen/new-interviewpanel-assignment-screen.component';
import { NewInterviewpanelAssignedDetailsComponent } from './evaluation/new-interviewpanel-assigned-details/new-interviewpanel-assigned-details.component';
import { NewInterviewpanelResultsUploadComponent } from './evaluation/new-interviewpanel-results-upload/new-interviewpanel-results-upload.component';
import { IcAddorListComponent } from './pages/ic-AddorList/ic-addor-list.component';
import { OfferedCandidatesListComponent } from './pages/offered-candidates-list/offered-candidates-list.component';
import { BusinesspanelRouteComponent } from './pages/businesspanel-route/businesspanel-route.component';
import { BulkUploadsComponent } from './hr-user-management/bulk-uploads/bulk-uploads.component';
import { AssignedDetailsComponent } from './evaluation/new-interviewpanel-assigned-details/assigned-details/assigned-details.component';

const routes: Routes = [
  {
    path: '',
    component: HrMasterComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.DASHBOARD}`,
        component: HrMainDashboardComponent, canActivate: [HrcanloadGuard],
        data: {
          breadcrumb: 'Dashboard'
        }
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.SHORTLISTING}`,
        component: HrShortlistingComponent, canActivate: [HrcanloadGuard],
        data: {
          breadcrumb: 'Shortlisting Process'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING}`,
            component: FirstLevelShortlistComponent,
            data: {
              breadcrumb: 'Applicants'
            },
            children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING_LIST}`,
                component: ShortlistedCandidateListComponent,
                data: {
                  breadcrumb: ''
                }
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING_CRITERIA}`,
                component: ApplyCriteriaComponent,
                data: {
                  breadcrumb: 'Filter'
                }
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING}`,
            component: SecondLevelShortlistComponent,
            data: {
              breadcrumb: 'Shortlists'
            },
            children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_LIST}`,
                component: SecondLevelAssessmentListComponent,
                data: {
                  breadcrumb: ''
                }
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST}`,
                component: SecondLevelCandidateListofAssessComponent,
                data: {
                  breadcrumb: 'Candidates List'
                }
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTED_CANDIDATE_REPORT}`,
                component: SecondLevelShortlistedCandidatesReportComponent,
                data: {
                  breadcrumb: 'Shortlisted Report'
                }
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT}`,
        component: HrUserManagementComponent,
        data: {
          breadcrumb: 'User Management'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST}`,
            component: UserListComponent,
            data: {
              breadcrumb: 'User Groups'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_USER_MANAGEMENT_BULK_UPLOAD}`,
            component: BulkUploadsComponent,
            data: {
              breadcrumb: 'Bulk Uploads'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST}`,
            pathMatch: 'full',
          }
        ]
      },

      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.EVALUATION}`,
        component: EvaluationComponent,
        data: {
          breadcrumb: 'Panel Assignment'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT}`,
            component: NewInterviewpanelAssignmentScreenComponent,
            data: {
              breadcrumb: 'Panel Assignment'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED}`,
            component: NewInterviewpanelAssignedDetailsComponent,
            data: {
              breadcrumb: 'Assigned'
            },
            children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.ASSIGNED_DETAILS}`, component: AssignedDetailsComponent,
                data: {
                  breadcrumb: 'Details'
                },
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_PANEL_EVALUATION}`, component: HrEvaluationMainScreenComponent,
                data: {
                  breadcrumb: 'Candidate Details'
                },
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.ASSIGNED_DETAILS}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.NEW_INTERVIEW_PANEL_RESULTS_UPLOAD}`,
            component: NewInterviewpanelResultsUploadComponent,
            data: {
              breadcrumb: 'Bulk Assign'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.REPORTS}`,
        component: HrReportsComponent,
        data: {
          breadcrumb: 'Reports'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRST_LEVEL_REPORTS_LIST}`,
            component: FirstLevelShorlistReportsComponent,
            data: {
              breadcrumb: '1st Level Shortlist Reports'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.REPORTS_LIST}`,
            component: ReportsListComponent,
            data: {
              breadcrumb: 'All Reports'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRST_LEVEL_REPORTS_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_STATUS}`,
        component: HrCandidateStatusComponent,
        data: {
          breadcrumb: 'Status'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_STATUS_PREASSESSMENT}`,
            component: HrPreAssessmentComponent,
            data: {
              breadcrumb: 'PreAssessment'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_STATUS_RECRUITMENT}`,
            component: HrRecruitmentComponent,
            data: {
              breadcrumb: 'Recruitment'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_STATUS_RECRUITMENT}`,
            pathMatch: 'full',
          }
        ]
      },
      // adad
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.BUSINESSROUTE}`,
        component: BusinesspanelRouteComponent,
        data: {
          breadcrumb: "IC's/Business"
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.OfferedCandidatesLIST}`,
            component: OfferedCandidatesListComponent,
            data: {
              breadcrumb: 'Selected Candidates Upload/Assign'
            },
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.IC_ADDorLIST}`,
            component: IcAddorListComponent,
            data: {
              breadcrumb: 'Business Users List/Add'
            },
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.OfferedCandidatesLIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT}`,
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
