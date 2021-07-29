import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  Router, NavigationStart, NavigationEnd,
  NavigationCancel, NavigationError, Event, ResolveEnd
} from '@angular/router';
import { AppConfigService } from './config/app-config.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ScreenresolutionBoxComponent } from './shared/screenresolution-box/screenresolution-box.component';
import { environment } from 'src/environments/environment';
import { LoaderService } from './services/loader-service.service';

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
    public loadingService: LoaderService,
    private appConfig: AppConfigService,
    private matDialog: MatDialog,
  ) {
    // this.connectionStatusMethod();
    // tslint:disable-next-line: deprecation
    this.appConfig.clearLocalDataOne('personalFormTouched');
    this.appConfig.clearLocalDataOne('educationalFormTouched');
    this.appConfig.clearLocalDataOne('familyFormTouched');
    this.appConfig.clearLocalDataOne('generalFormTouched');

    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
      }
      // On NavigationEnd or NavigationError or NavigationCancel
      // set showLoadingIndicator to false
      if (routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationError ||
        routerEvent instanceof NavigationCancel) {
          if (environment.local != true) {
            // this.commonService.initVersionCheck(environment.versionCheckURL);
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
    if (environment.production) {
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
