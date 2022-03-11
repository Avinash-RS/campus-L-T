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
    if (this.appConfig.getSelectedCustomerCode() == '#LTTS') {
      let mastersList = this.appConfig.getSelectedDriveDetails();
      // Filter education details baised on customer code
      let filter = mastersList && mastersList.config && mastersList.config.education_master ? mastersList.config.education_master : [];
      let customerCode = this.appConfig.getSelectedCustomerCode();
      let positive_array = filter.filter(value => value.customer_code == customerCode);
      filter = mastersList ? positive_array : [];
      filter.forEach(element => {
        element.checkbox = false;
      });
      return filter;
    } else {
      let mastersList = this.appConfig.getLocalData('masters') ? JSON.parse(this.appConfig.getLocalData('masters')) : [];
      // Filter education details baised on customer code
      let filter = mastersList ? mastersList.education_master : [];
      let customerCode = (this.appConfig.getSelectedCustomerCode() != '#LTTS' && this.appConfig.getSelectedCustomerCode() != '#ADANI') ? '#LTTS' : this.appConfig.getSelectedCustomerCode();
      let positive_array = filter.filter(value => value.customer_code == customerCode);
      filter = mastersList ? positive_array : [];

      filter.forEach(element => {
        element.checkbox = false;
      });
      return filter;
    }
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

  getBacklogsList() {
    return [
      {label: '0', value: 0, checked: false}, {label: '1', value: 1, checked: false}, {label: '2', value: 2, checked: false}, {label: '3', value: 3, checked: false}, {label: '4 & More', value: '4 & more', checked: false}
    ]
  }

  getSpecificBacklogsList() {
    return [
      {label: '0', value: 0, checked: false}, {label: '1', value: 1, checked: false}, {label: '2', value: 2, checked: false}, {label: '3', value: 3, checked: false}, {label: '4 & More', value: '4 & more', checked: false}
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
    return education;
  }

}
