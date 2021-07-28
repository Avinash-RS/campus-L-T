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
import { InterviewpanelDetailsComponent } from './evaluation/interviewpanel-details/interviewpanel-details.component';
import { InterviewpanelSelectComponent } from './evaluation/interviewpanel-select/interviewpanel-select.component';
import { EvalutionInterviewpanelFormComponent } from './evaluation/evalution-interviewpanel-form/evalution-interviewpanel-form.component';
import { HrAssingAssessmentComponent } from './hr-assing-assessment/hr-assing-assessment.component';
import { SchedulingAssessmentComponent } from './hr-assing-assessment/scheduling-assessment/scheduling-assessment.component';


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
import { SecondLevelAssessmentReportsComponent } from './hr-shortlisting/second-level-shortlist/second-level-assessment-reports/second-level-assessment-reports.component';
import { HrEvaluationMainScreenComponent } from './evaluation/hr-evaluation-main-screen/hr-evaluation-main-screen.component';
import { HrSubAssessmentsComponent } from './evaluation/hr-evaluation-main-screen/hr-sub-assessments/hr-sub-assessments.component';
import { HrSubEducationComponent } from './evaluation/hr-evaluation-main-screen/hr-sub-education/hr-sub-education.component';
import { HrSubEmploymentComponent } from './evaluation/hr-evaluation-main-screen/hr-sub-employment/hr-sub-employment.component';
import { InvpanelBulkUploadReportComponent } from './hr-reports/invpanel-bulk-upload-report/invpanel-bulk-upload-report.component';
import { from } from 'rxjs';
import { HrUploadTestReportComponent } from './hr-reports/hr-upload-test-report/hr-upload-test-report.component';
import { NewInterviewpanelAssignmentScreenComponent } from './evaluation/new-interviewpanel-assignment-screen/new-interviewpanel-assignment-screen.component';
import { NewInterviewpanelAssignedDetailsComponent } from './evaluation/new-interviewpanel-assigned-details/new-interviewpanel-assigned-details.component';
import { NewInterviewpanelResultsUploadComponent } from './evaluation/new-interviewpanel-results-upload/new-interviewpanel-results-upload.component';
import { InvBulkAssignReportsComponent } from './hr-reports/inv-bulk-assign-reports/inv-bulk-assign-reports.component';
import { IcAddorListComponent } from './pages/ic-AddorList/ic-addor-list.component';
import { OfferedCandidatesListComponent } from './pages/offered-candidates-list/offered-candidates-list.component';
import { BusinesspanelRouteComponent } from './pages/businesspanel-route/businesspanel-route.component';

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
          breadcrumb: 'Shortlist'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING}`,
            component: FirstLevelShortlistComponent,
            data: {
              breadcrumb: '1st Level Shortlist'
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
              breadcrumb: '2nd Level Shortlist'
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
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_REPORTS}`,
                component: SecondLevelAssessmentReportsComponent,
                data: {
                  breadcrumb: 'Reports'
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
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.UPLOAD_TEST_RESULTS}`,
            component: UploadTestResultsComponent,
            data: {
              breadcrumb: 'Upload Test Results'
            }
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
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS}`,
            component: CandidateBulkUploadComponent,
            data: {
              breadcrumb: 'Candidate Details'
            },
            children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`,
                component: UploadedListComponent,
                data: {
                  breadcrumb: ''
                }
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD}`,
                component: BulkUploadComponent,
                data: {
                  breadcrumb: 'Upload Candidate Details'
                }
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST}`,
            component: UserListComponent,
            data: {
              breadcrumb: 'Panel Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_USER_MANAGEMENT_ADD_USERS}`,
            component: HrAddUserComponent,
            data: {
              breadcrumb: 'Add User'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_INTERVIEW_PANEL_UPLOADS}`,
            component: InterviewPanelBulkUploadComponent,
            data: {
              breadcrumb: 'Interview Panel Upload'
            },
            children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_INTERVIEW_PANEL_BULK_UPLOAD}`,
                component: InvpanelBulkuploadComponent,
                data: {
                  breadcrumb: ''
                }
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
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.EVALUATION}`,
        component: EvaluationComponent,
        data: {
          breadcrumb: 'Panel Assignment'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS}`,
            component: EvaluationCandidateDetailsComponent,
            data: {
              breadcrumb: 'Candidate Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.ASSESSMENTDETAILS}`,
            component: AssessmentDetailsComponent,
            data: {
              breadcrumb: 'Assessment Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_PANEL_EVALUATION}`, component: HrEvaluationMainScreenComponent,
            data: {
              breadcrumb: 'Candidate Details'
            },
            children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SUB_ASSESSMENTS}`, component: HrSubAssessmentsComponent,
                data: {
                  breadcrumb: 'Assessment Details'
                }
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SUB_EDUCATION}`, component: HrSubEducationComponent,
                data: {
                  breadcrumb: 'Education Details'
                }
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.SUB_EMPLOYMENT}`, component: HrSubEmploymentComponent,
                data: {
                  breadcrumb: 'Employment Documents'
                }
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.SUB_ASSESSMENTS}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL}`,
            component: EvaluationInterviewPanelComponent,
            data: {
              breadcrumb: 'Interview panel'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS}`,
            component: InterviewpanelDetailsComponent,
            data: {
              breadcrumb: 'Interview panel details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS_SELECT}`,
            component: InterviewpanelSelectComponent,
            data: {
              breadcrumb: 'Interview panel selected'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL_FORM}`,
            component: EvalutionInterviewpanelFormComponent,
            data: {
              breadcrumb: 'Interview panel list'
            }
          },
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
              breadcrumb: 'Assigned Details'
            }
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
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.BULK_CANDIDATE_UPLOAD_REPORTS_LIST}`,
            component: BulkUploadReportsComponent,
            data: {
              breadcrumb: 'Candidate Bulk Upload Reports'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.BULK_INV_UPLOAD_REPORTS_LIST}`,
            component: InvpanelBulkUploadReportComponent,
            data: {
              breadcrumb: 'Interview Panel Bulk Upload Reports'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.TEST_UPLOAD_REPORTS_LIST}`,
            component: HrUploadTestReportComponent,
            data: {
              breadcrumb: 'Test Upload Reports'
            }
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.INV_BULK_ASSIGN_REPORTS_LIST}`,
            component: InvBulkAssignReportsComponent,
            data: {
              breadcrumb: 'Panel Bulk Assign Reports'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.REPORTS_LIST}`,
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
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_ASSING_ASSESSMENT}`,
        component: HrAssingAssessmentComponent,
        data: {
          breadcrumb: 'Assigning Assessment'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_SCHEDULING_ASSESSMENT}`,
            component: SchedulingAssessmentComponent,
            data: {
              breadcrumb: 'Scheduling Assessment'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.HR_SCHEDULING_ASSESSMENT}`,
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
