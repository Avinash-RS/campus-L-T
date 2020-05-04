import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SignupHeaderComponent } from './signup-header/signup-header.component';
import { HomeHeaderComponent } from './home-header/home-header.component';


@NgModule({
  declarations: [SignupHeaderComponent, HomeHeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    SignupHeaderComponent,
    HomeHeaderComponent
  ],
})
export class SharedModule { }
