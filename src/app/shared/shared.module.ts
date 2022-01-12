import { DateMonthYearDirective } from './../directives/customDateFormats/date-month-year.directive';
import { YearMonthDirective } from './../directives/customDateFormats/year-month.directive';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SignupHeaderComponent } from './signup-header/signup-header.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { MaterialModule } from '../material/material.module';
import { ModalBoxComponent } from './modal-box/modal-box.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// Ant design module
import { NzSelectModule } from 'ng-zorro-antd/select';
// Ant design module
import { CandidateStatusComponent } from './candidate-status/candidate-status.component';
import { ShortlistBoxComponent } from './modal-box/shortlist-box/shortlist-box.component';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { CdkDetailRowDirective } from './helper/cdk-detail-row.directive';
import { CommonKycProfileViewComponent } from './common-kyc-profile-view/common-kyc-profile-view.component';
import { SharedUploadPreviewerComponent } from './shared-upload-previewer/shared-upload-previewer.component';
import { ScreenresolutionBoxComponent } from './screenresolution-box/screenresolution-box.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonSidebarComponent } from './common-sidebar/common-sidebar.component';
import { SharedKycProfileViewComponent } from './shared-kyc-profile-view/shared-kyc-profile-view.component';
import { UserListsComponent } from './user-management/user-lists/user-lists.component';
import { CommonUploadsComponent } from './user-management/common-uploads/common-uploads.component';
import { ModuleRegistry, AllModules } from '@ag-grid-enterprise/all-modules';
import { AgGridModule } from 'ag-grid-angular';
import { SharedReportsSectionComponent } from './user-management/shared-reports-section/shared-reports-section.component';
import { SharedVideoAssessViewComponent } from './shared-video-assess-view/shared-video-assess-view.component';
import { PageNotFoundComponent } from '../unauthenticated-routes/page-not-found/page-not-found.component';
import { JoinInterviewComponent } from '../candidate-dashboard/larsen-module/join-interview/join-interview.component';
import { AdaniJoinInterviewComponent } from '../candidate-dashboard/adani-module/adani-join-interview/join-interview.component';
import { AdaniSharedKycProfileViewComponent } from './adani-shared-kyc-profile-view/adani-shared-kyc-profile-view.component';

ModuleRegistry.registerModules(AllModules);

@NgModule({
  declarations: [SignupHeaderComponent, HomeHeaderComponent, DashboardHeaderComponent, ModalBoxComponent, CandidateStatusComponent, ShortlistBoxComponent, CommonHeaderComponent, CdkDetailRowDirective, CommonKycProfileViewComponent, SharedUploadPreviewerComponent, ScreenresolutionBoxComponent, YearMonthDirective, DateMonthYearDirective, CommonSidebarComponent, JoinInterviewComponent,AdaniJoinInterviewComponent , SharedKycProfileViewComponent, UserListsComponent, CommonUploadsComponent, SharedReportsSectionComponent, SharedVideoAssessViewComponent, PageNotFoundComponent, AdaniSharedKycProfileViewComponent
],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    AgGridModule.withComponents([]),
    PdfViewerModule,
    NgMultiSelectDropDownModule.forRoot(),

    // Ant design Modules
    NzSelectModule
  ],
  exports: [
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    PdfViewerModule,
    SignupHeaderComponent,
    HomeHeaderComponent,
    DashboardHeaderComponent,
    ModalBoxComponent,
    CandidateStatusComponent,
    NgMultiSelectDropDownModule,
    ShortlistBoxComponent,
    CommonHeaderComponent,
    CdkDetailRowDirective,
    CommonKycProfileViewComponent,
    SharedUploadPreviewerComponent,
    ScreenresolutionBoxComponent,
    YearMonthDirective,
    DateMonthYearDirective,
    CommonSidebarComponent,
    JoinInterviewComponent,
    AdaniJoinInterviewComponent,
    SharedKycProfileViewComponent,
    UserListsComponent,
    CommonUploadsComponent,
    SharedReportsSectionComponent,
    SharedVideoAssessViewComponent,
    PageNotFoundComponent,
    AdaniSharedKycProfileViewComponent,
    NzSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedModule { }
