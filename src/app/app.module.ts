import { CommonJoiningFormComponent } from './shared/common-joining-form/common-joining-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorsService } from './config/interceptors.service';
import { ModalBoxComponent } from './shared/modal-box/modal-box.component';
import { FormsModule } from '@angular/forms';
import en from '@angular/common/locales/en';
import { NgZorroAntdModule, NZ_I18N, en_US, NZ_ICONS, NzConfig, NZ_CONFIG } from 'ng-zorro-antd';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { KycSnackbarComponent } from './shared/kyc-snackbar/kyc-snackbar.component';
import { CanloadGuard } from './guards/canload/canload.guard';
import { AdmincanloadGuard } from './guards/canload/admincanload.guard';
import { IsLoggedinGuard } from './guards/canload/is-loggedin.guard';
import { AuthGuard } from './guards/auth.guard';
import { KycthanksGuard } from './guards/canload/kycthanks.guard';
import { HrcanloadGuard } from './guards/canload/hrcanload.guard';
import { ShortlistedCandidateListComponent } from './hr-dashboard/hr-shortlisting/first-level-shortlist/shortlisted-candidate-list/shortlisted-candidate-list.component';
import { ShortlistBoxComponent } from './shared/modal-box/shortlist-box/shortlist-box.component';
import { TpocanloadGuard } from './guards/canload/tpocanload.guard';
import { InvpanelGuard } from './guards/canload/invpanel.guard';
import { CommonKycProfileViewComponent } from './shared/common-kyc-profile-view/common-kyc-profile-view.component';
import { ScreenresolutionBoxComponent } from './shared/screenresolution-box/screenresolution-box.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DragScrollModule } from 'ngx-drag-scroll';
import { NgxChartsModule} from '@swimlane/ngx-charts';
// import { AgGridModule } from 'ag-grid-angular';

registerLocaleData(en);

const ngZorroConfig: NzConfig = {
  notification: { nzMaxStack: 1 }
};

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@NgModule({
  declarations: [
    AppComponent,
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
    DragScrollModule,
    NgxChartsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      maxOpened: 1,
      preventDuplicates: true,
      autoDismiss: true
    }),
    // AgGridModule.withComponents([])
    ],
  // providers: [],
  entryComponents: [SnackbarComponent, ModalBoxComponent, KycSnackbarComponent, ShortlistBoxComponent, CommonKycProfileViewComponent, ScreenresolutionBoxComponent, CommonJoiningFormComponent],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorsService, multi: true},
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    CanDeactivateGuard, CanloadGuard, AdmincanloadGuard, IsLoggedinGuard, AuthGuard, KycthanksGuard, HrcanloadGuard, TpocanloadGuard, InvpanelGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
