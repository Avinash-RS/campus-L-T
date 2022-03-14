import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatDialog } from '@angular/material';
import { ModalBoxComponent } from '../modal-box/modal-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {

  username: any;
  logoURL: any;
  BASE_URL = environment.API_BASE_URL;
  currentRole = this.appConfig.getLocalData('roles');

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.username = this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : 'NA';
    this.logoURL = this.appConfig.logoBasedOnCustomer();
  }

  goToHome() {
    // this.logOut();
  }

  openManual() {
    if (this.currentRole == 'candidate') {
      const candidatePDF = `${this.BASE_URL}/sites/default/files/candidate-userguide.pdf`;
      const newWin = window.open(candidatePDF, 'redirection');
      // add a load listener to the window so that the title gets changed on page load
      newWin.addEventListener("load", function() {
        newWin.document.title = 'User Manual';
    });
    }
    if (this.currentRole == 'institute') {
      const tpoPDF = `${this.BASE_URL}/sites/default/files/tpo-userguide.pdf`;
      const newWin = window.open(tpoPDF, 'redirection');
        // add a load listener to the window so that the title gets changed on page load
        newWin.addEventListener("load", function() {
          newWin.document.title = 'User Manual';
      });
    }
  }

  logOut() {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Are you sure you want to logout?',
        componentData: '',
        type: 'delete',
        identity: 'logout'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
    this.openDialog(ModalBoxComponent, data);
  }

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    dialogDetails = {
      iconName: data.iconName,
      showCancel: data.showCancel,
      showConfirm: data.showConfirm,
      showOk: data.showOk,
      dataToBeShared: data.sharedData,
    };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const token = this.appConfig.getLocalData('logout-token');
        this.apiService.logout(token).subscribe((data: any) => {
          this.appConfig.clearLocalData();

          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
        }, (err) => {
        });
        // this.appConfig.consoleLog('resultlogout', result);
      }
    });
  }

}
