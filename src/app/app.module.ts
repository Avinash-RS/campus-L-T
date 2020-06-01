import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorsService } from './config/interceptors.service';
import { ModalBoxComponent } from './shared/modal-box/modal-box.component';
import { FormsModule } from '@angular/forms';
import en from '@angular/common/locales/en';
import { NgZorroAntdModule, NZ_I18N, en_US, NZ_ICONS } from 'ng-zorro-antd';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

registerLocaleData(en);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

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
    NgxSpinnerModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
  ],
  // providers: [],
  entryComponents: [SnackbarComponent, ModalBoxComponent],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorsService, multi: true},
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
