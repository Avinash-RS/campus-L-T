import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorsService } from './config/interceptors.service';
import { ModalBoxComponent } from './shared/modal-box/modal-box.component';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { AdmincanloadGuard } from './guards/canload/admincanload.guard';
import { IsLoggedinGuard } from './guards/canload/is-loggedin.guard';
import { HrcanloadGuard } from './guards/canload/hrcanload.guard';
import { ShortlistBoxComponent } from './shared/modal-box/shortlist-box/shortlist-box.component';
import { TpocanloadGuard } from './guards/canload/tpocanload.guard';
import { InvpanelGuard } from './guards/canload/invpanel.guard';
import { CommonKycProfileViewComponent } from './shared/common-kyc-profile-view/common-kyc-profile-view.component';
import { ScreenresolutionBoxComponent } from './shared/screenresolution-box/screenresolution-box.component';
import { ToastrModule } from 'ngx-toastr';

// ag grid enterprise
import 'ag-grid-enterprise';
import { AgGridModule } from 'ag-grid-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { LarsenComponentsAuthGuard } from './guards/canload/candidate_components_authguards/larsen_components_auth.guard';
import { AdaniGuard } from './guards/canload/candidate_components_authguards/adani.guard';
import { CandidateCanloadGuard } from './guards/canload/candidate_canload.guard';
import { AdaniComponentsAuthGuard } from './guards/canload/candidate_components_authguards/adani_components_auth.guards';
import { LarsenGuard } from './guards/canload/candidate_components_authguards/larsen.guard';
import { GeneralProfileGuard } from './guards/canload/candidate_components_authguards/general-profile.guard';
import { GeneralProfileComponentGuard } from './guards/canload/candidate_components_authguards/general-profile-component.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      maxOpened: 1,
      preventDuplicates: true,
      autoDismiss: true
    }),
    AgGridModule.withComponents([])
    ],
  // providers: [],
  entryComponents: [ModalBoxComponent, ShortlistBoxComponent, CommonKycProfileViewComponent, ScreenresolutionBoxComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    NgxSpinnerService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorsService, multi: true},
    CandidateCanloadGuard, AdmincanloadGuard, IsLoggedinGuard,LarsenGuard, AdaniGuard, GeneralProfileGuard, GeneralProfileComponentGuard, LarsenComponentsAuthGuard,AdaniComponentsAuthGuard, HrcanloadGuard, TpocanloadGuard, InvpanelGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
