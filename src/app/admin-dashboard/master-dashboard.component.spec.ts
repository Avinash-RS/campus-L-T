import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDashboardComponent } from './master-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatToolbarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MasterDashboardComponent', () => {
  let component: MasterDashboardComponent;
  let fixture: ComponentFixture<MasterDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, MatSnackBarModule, RouterTestingModule, ReactiveFormsModule,
        HttpClientModule, MatToolbarModule
      ],
      declarations: [ MasterDashboardComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
