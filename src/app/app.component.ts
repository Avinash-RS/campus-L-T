import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  Router, NavigationStart, NavigationEnd,
  NavigationCancel, NavigationError, Event, ResolveEnd
} from '@angular/router';
import { ApiServiceService } from './services/api-service.service';
import { AppConfigService } from './config/app-config.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { ConnectionService } from 'ng-connection-service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ScreenresolutionBoxComponent } from './shared/screenresolution-box/screenresolution-box.component';
import { CONSTANT } from './constants/app-constants.service';
import { SharedServiceService } from './services/shared-service.service';
import { ToastrService } from 'ngx-toastr';
import { AdminServiceService } from './services/admin-service.service';
import { CommonService } from './services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'udap-registration';
  showLoadingIndicator = true;
  screenHeight;
  screenWidth;
  maintenanceStatus = false;

  titles = 'connectionDetector';
  status = 'ONLINE';
  screenBoolean = false;
  // Hi
  // initializing as online by default
  isConnected = true;
  isIE = false;
  subscriptions: Subscription[] = [];
  maintenanceMessage: any;


  constructor(
    private router: Router,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private matDialog: MatDialog,
    private commonService: CommonService,
    private connectionService: ConnectionService,
    private toastr: ToastrService
  ) {
    // this.connectionStatusMethod();
    // tslint:disable-next-line: deprecation
    this.appConfig.clearLocalDataOne('personalFormTouched');
    this.appConfig.clearLocalDataOne('educationalFormTouched');
    this.appConfig.clearLocalDataOne('familyFormTouched');
    this.appConfig.clearLocalDataOne('generalFormTouched');

    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        // this.connectionStatusMethod();
      }
      // On NavigationEnd or NavigationError or NavigationCancel
      // set showLoadingIndicator to false
      if (routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationError ||
        routerEvent instanceof NavigationCancel) {
          if (environment.local != true) {
            this.commonService.initVersionCheck(environment.versionCheckURL);
          }
          }
    });
  }

  ngOnInit() {
    this.getScreenSize();
    this.checkIE();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    // if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles') == 'candidate') {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 1000 || this.screenHeight < 400) {
      // this.show = true;
      const data = {
        data: true,
        type: 'resize'
      };
      if (!this.screenBoolean) {
        this.openDialog(ScreenresolutionBoxComponent, data);
          }
    } else {
      const data = false;
      if (this.screenBoolean) {
        this.matDialog.closeAll();
      }
    }
  // }
}

  @HostListener('window:mousemove', ['$event'])
  checkIE(event?) {
    const isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent)
    if (isIEOrEdge) {
      this.isIE = true;
      const data = {
        data: true,
        type: 'browser'
      };
      if (!this.screenBoolean) {
        this.openDialog(ScreenresolutionBoxComponent, data);
      }
    } else {
    }
  }

  connectionStatusMethod() {
    // Get the online/offline status from browser window
        this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      // console.log('coming', this.isConnected);
      if (this.isConnected) {
        // this.status = 'You are back online';
      //  return this.appConfig.warning('You are online');
      } else {
       return this.appConfig.warning('You are offline');
        // this.status = 'You are offline';
      }
      // alert(this.status);
    });
  }

  openDialog(component, data) {
    let dialogDetails: any;


    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    this.screenBoolean = true;
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.screenBoolean = false;
      if (result) {
      }
    });
  }

  getMaintenanceStatus() {
    // if (!this.maintenanceStatus) {
    //   if (!this.appConfig.getLocalData('maintenance')) {
    //     this.apiService.getStatus().subscribe((data: any)=> {
    //       this.appConfig.hideLoader();
    //       console.log('status', data);
    //       if (data && data['status'] == '0') {
    //         this.maintenanceStatus = true;
    //         this.sharedService.maintenanceSubject.next(data && data['message'] ? data['message'] : 'Website under maintenance');
    //         this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.MAINTENANCE);
    //         this.appConfig.setLocalData('maintenance', data && data['message'] ? data['message'] : 'Website under maintenance');
    //         this.maintenanceMessage = data && data['message'] ? data['message'] : 'Website under maintenance';
    //       }
    //     }, (err)=> {
    //     });
    //   } else {
    //     this.sharedService.maintenanceSubject.next(this.appConfig.getLocalData('maintenance'));
    //     this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.MAINTENANCE);
    //   }
    // } else {
    //   if (!this.appConfig.getLocalData('maintenance')) {
    //     this.apiService.getStatus().subscribe((data: any)=> {
    //       this.appConfig.hideLoader();
    //       console.log('status', data);
    //       if (data && data['status'] == '0') {
    //         this.maintenanceStatus = true;
    //         this.sharedService.maintenanceSubject.next(data && data['message'] ? data['message'] : 'Website under maintenance');
    //         this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.MAINTENANCE);
    //         this.appConfig.setLocalData('maintenance', data && data['message'] ? data['message'] : 'Website under maintenance');
    //         this.maintenanceMessage = data && data['message'] ? data['message'] : 'Website under maintenance';
    //       }
    //     }, (err)=> {
    //     });
    //   } else {
    //     this.sharedService.maintenanceSubject.next(this.appConfig.getLocalData('maintenance'));
    //     this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.MAINTENANCE);
    //   }
    // }
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
