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

  titles = 'connectionDetector';
  status = 'ONLINE';
  screenBoolean = false;
  // Hi
  // initializing as online by default
  isConnected = true;
  isIE = false;
  subscriptions: Subscription[] = [];


  constructor(
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService,
    private matDialog: MatDialog,
    private connectionService: ConnectionService
  ) {
    this.connectionStatusMethod();
    // tslint:disable-next-line: deprecation
    this.appConfig.clearLocalDataOne('personalFormTouched');
    this.appConfig.clearLocalDataOne('educationalFormTouched');
    this.appConfig.clearLocalDataOne('familyFormTouched');
    this.appConfig.clearLocalDataOne('generalFormTouched');

    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        // this.appConfig.showLoaderManual();
      }
      // On NavigationEnd or NavigationError or NavigationCancel
      // set showLoadingIndicator to false
      if (routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationError ||
        routerEvent instanceof NavigationCancel) {
        // this.appConfig.hideLoaderManual();
      }
    });
  }

  ngOnInit() {
    this.getScreenSize();
    this.checkIE();
    // const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent)
    
    // this.connectionStatusMethod();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
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
      if (this.isConnected) {
        this.status = 'You are back online';
      } else {
        this.status = 'You are offline';
      }
      alert(this.status);
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

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
