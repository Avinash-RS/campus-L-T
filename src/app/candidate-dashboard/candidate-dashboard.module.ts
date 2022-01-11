import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateDashboardRoutingModule } from './candidate-dashboard-routing.module';
import { MasterDashboardComponent } from './master-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { CandidateDocumentComponent } from './candidate-document/candidate-document.component';
import { CandidateUploadDocumentComponent } from './candidate-document/candidate-upload-document/candidate-upload-document.component';
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
import { AdaniJoiningContactComponent } from './adani-profile/joining-contact/joining-contact.component';
import { AdaniJoiningDependentComponent } from './adani-profile/joining-dependent/joining-dependent.component';
import { AdaniJoiningEducationComponent } from './adani-profile/joining-education/joining-education.component';
import { AdaniJoiningFormComponent } from './adani-profile/joining-form/joining-form.component';
import { AdaniJoiningPersonalComponent } from './adani-profile/joining-personal/joining-personal.component';
import { AdaniJoiningPreviewComponent } from './adani-profile/joining-preview/joining-preview.component';
import { AdaniJoiningSubmitComponent } from './adani-profile/joining-submit/joining-submit.component';
import { AdaniJoiningUploadComponent } from './adani-profile/joining-upload/joining-upload.component';
import { AdaniJoiningWorkDetailsComponent } from './adani-profile/joining-work-details/joining-work-details.component';


@NgModule({
  declarations: [MasterDashboardComponent, CandidateDocumentComponent, CandidateUploadDocumentComponent, JoiningFormComponent, JoiningPersonalComponent, JoiningContactComponent, JoiningDependentComponent, JoiningEducationComponent, JoiningUploadComponent, JoiningPreviewComponent, JoiningSubmitComponent, JoiningWorkDetailsComponent, CandidateFaqComponent,AdaniJoiningContactComponent,AdaniJoiningDependentComponent,AdaniJoiningEducationComponent,AdaniJoiningFormComponent,AdaniJoiningPersonalComponent,AdaniJoiningPreviewComponent,AdaniJoiningSubmitComponent,AdaniJoiningUploadComponent,AdaniJoiningWorkDetailsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    CandidateDashboardRoutingModule
  ]
})
export class CandidateDashboardModule { }
