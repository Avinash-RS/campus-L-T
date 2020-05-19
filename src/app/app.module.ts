import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorsService } from './config/interceptors.service';

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
    NgxSpinnerModule
  ],
  // providers: [],
  entryComponents: [SnackbarComponent],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorsService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
