import { Component, OnInit, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
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
import { delay, filter } from 'rxjs/operators';

import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey('CompanyName=LARSEN & TOUBRO LIMITED,LicensedGroup=L&T EduTech,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=3,LicensedProductionInstancesCount=3,AssetReference=AG-017299,ExpiryDate=15_July_2022_[v2]_MTY1NzgzOTYwMDAwMA==d6a472ece2e8481f35e75c20066f8e49');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
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
  loading: boolean = true;
  selectedDriveId: number;

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

    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (
        event.id === 1 &&
        event.url === event.urlAfterRedirects
      ) {
      this.appConfig.clearLocalDataOne('profileData');
      //  ..... // here your code when page is refresh
      }
    })
    // this.router.events.subscribe((routerEvent: Event) => {
    //   if (routerEvent instanceof NavigationStart) {
    //   }
    //   // On NavigationEnd or NavigationError or NavigationCancel
    //   // set showLoadingIndicator to false
    //   if (routerEvent instanceof NavigationEnd ||
    //     routerEvent instanceof NavigationError ||
    //     routerEvent instanceof NavigationCancel) {
    //       if (environment.local != true) {
    //         // this.commonService.initVersionCheck(environment.versionCheckURL);
    //       }
    //       }
    // });
  }

  ngOnInit() {
    this.getScreenSize();
    this.checkIE();
    this.listenToLoading();
    this.selectedDriveId = this.appConfig.getDriveId() ? Number(this.appConfig.getDriveId()) : null;
  }

  checkNavigation() {
        this.router.events.subscribe((routerEvent: Event) => {
          if (this.appConfig.getDriveId() == this.selectedDriveId) {
            this.router.routeReuseStrategy.shouldReuseRoute = () => true;
            this.router.onSameUrlNavigation = 'ignore';
          } else {
            this.selectedDriveId = this.appConfig.getDriveId() ? Number(this.appConfig.getDriveId()) : null;
          }
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
  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
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

     /**
   * Listen and display the loading spinner.
   */
  listenToLoading(): void {
    this.loadingService.isLoadingSub.pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
