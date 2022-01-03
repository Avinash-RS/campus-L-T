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
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CanloadGuard } from './guards/canload/canload.guard';
import { AdmincanloadGuard } from './guards/canload/admincanload.guard';
import { IsLoggedinGuard } from './guards/canload/is-loggedin.guard';
import { AuthGuard } from './guards/auth.guard';
import { HrcanloadGuard } from './guards/canload/hrcanload.guard';
import { ShortlistBoxComponent } from './shared/modal-box/shortlist-box/shortlist-box.component';
import { TpocanloadGuard } from './guards/canload/tpocanload.guard';
import { InvpanelGuard } from './guards/canload/invpanel.guard';
import { CommonKycProfileViewComponent } from './shared/common-kyc-profile-view/common-kyc-profile-view.component';
import { ScreenresolutionBoxComponent } from './shared/screenresolution-box/screenresolution-box.component';
import { ToastrModule } from 'ngx-toastr';

import { NgxChartsModule} from '@swimlane/ngx-charts';
// ag grid enterprise
import 'ag-grid-enterprise';
import { AgGridModule } from 'ag-grid-angular';
import { NgxSpinnerService } from 'ngx-spinner';

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
    NgxChartsModule,
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
    NgxSpinnerService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorsService, multi: true},
     CanloadGuard, AdmincanloadGuard, IsLoggedinGuard, AuthGuard, HrcanloadGuard, TpocanloadGuard, InvpanelGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
