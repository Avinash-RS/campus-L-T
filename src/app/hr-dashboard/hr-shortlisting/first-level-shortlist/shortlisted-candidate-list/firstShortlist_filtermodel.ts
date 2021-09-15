import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { MatDialog } from '@angular/material';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Injectable({
  providedIn: 'root'
})

export class firstShortlistFilterModel {
  constructor(private appConfig: AppConfigService,
    private matDialog: MatDialog,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService
    ) {

  }

  getProfileList() {
    let mastersList = localStorage.getItem('masters') ? JSON.parse(localStorage.getItem('masters')) : '';
    let filter = mastersList?.education_master;
    filter.forEach(element => {
      element.checkbox = false;
    });
    return filter;
  }

  getGenderList() {
    return [
      {
        value: 'Male',
        label: 'Male',
        checked: false
      },
      {
        value: 'Female',
        label: 'Female',
        checked: false
      }
    ]
  }

  getDateOfBirthRange() {
    return {
      dateFrom: null,
      dateTo: null
    }
  }

  getBacklogsList() {
    return [
      {value: '0', checked: false}, {value: '1', checked: false}, {value: '2', checked: false}, {value: '3', checked: false}, {value: '4', checked: false}, {value: '5 or More', checked: false}
    ]
  }

  getEducationList() {
    let education = [
      {
        value: 'SSLC',
        label: 'SSLC',
        checked: false
      },
      {
        value: 'HSC',
        label: 'HSC',
        checked: false
      },
      {
        value: 'Diploma',
        label: 'Diploma',
        checked: false
      },
      {
        value: 'UG',
        label: 'Undergraduate',
        checked: false
      },
      {
        value: 'PG',
        label: 'Postgraduate',
        checked: false
      },
    ]
  }

}
