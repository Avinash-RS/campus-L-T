import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SignupHeaderComponent } from './signup-header/signup-header.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [SignupHeaderComponent, HomeHeaderComponent, SnackbarComponent, DashboardHeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MaterialModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    SignupHeaderComponent,
    HomeHeaderComponent,
    SnackbarComponent,
    DashboardHeaderComponent
  ],
})
export class SharedModule { }
