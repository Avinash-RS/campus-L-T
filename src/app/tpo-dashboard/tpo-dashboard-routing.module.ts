import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TpoMasterComponent } from './tpo-master.component';
import { CONSTANT } from '../constants/app-constants.service';
import { TpoUserManagementComponent } from './tpo-user-management/tpo-user-management.component';
import { CandidateUploadsComponent } from './tpo-user-management/candidate-uploads/candidate-uploads.component';
import { UploadedListComponent } from './tpo-user-management/candidate-uploads/uploaded-list/uploaded-list.component';
import { BulkUploadComponent } from './tpo-user-management/candidate-uploads/bulk-upload/bulk-upload.component';


const routes: Routes = [
  {
    path: '', component: TpoMasterComponent,
    children: [
      {
        path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT}`, component: TpoUserManagementComponent, children: [
          {
            path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS}`, component: CandidateUploadsComponent, children: [
              {
                path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`, component: UploadedListComponent
              },
              {
                path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD}`, component: BulkUploadComponent
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT}`,
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TpoDashboardRoutingModule { }
