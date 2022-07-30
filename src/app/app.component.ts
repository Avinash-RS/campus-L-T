import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event,
  ResolveEnd,
  ActivatedRoute,
} from "@angular/router";
import { AppConfigService } from "./config/app-config.service";
import { Observable, Subscription, fromEvent } from "rxjs";
import { MatDialog, MatDialogRef } from "@angular/material";
import { ScreenresolutionBoxComponent } from "./shared/screenresolution-box/screenresolution-box.component";
import { environment } from "src/environments/environment";
import { LoaderService } from "./services/loader-service.service";
import { delay, filter } from "rxjs/operators";

import { LicenseManager } from "ag-grid-enterprise";
import { NgIdleService } from "./services/session-handling.service";
import { ApiServiceService } from "./services/api-service.service";
import { CONSTANT } from "./constants/app-constants.service";
import { SharedServiceService } from "./services/shared-service.service";
declare var gtag;
LicenseManager.setLicenseKey(
  "CompanyName=LARSEN & TOUBRO LIMITED,LicensedGroup=L&T EduTech,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=3,LicensedProductionInstancesCount=3,AssetReference=AG-017299,ExpiryDate=15_July_2022_[v2]_MTY1NzgzOTYwMDAwMA==d6a472ece2e8481f35e75c20066f8e49"
);

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [NgIdleService],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("sessionDialog", { static: false }) sessionDialogRef: TemplateRef<
    any
  >;
  title = "udap-registration";
  screenHeight;
  screenWidth;
  screenBoolean = false;
  isIE = false;
  subscriptions: Subscription[] = [];
  loading: boolean = true;
  secondTimerLeft: string;
  sessionDialogRefPopup: any;
  constructor(
    private ngIdle: NgIdleService,
    private router: Router,
    public loadingService: LoaderService,
    private appConfig: AppConfigService,
    private matDialog: MatDialog,
    private apiService: ApiServiceService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedServiceService
  ) {
    if (environment.production) {
    const gaScript = document.createElement("script");
    gaScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'UA-177278337-1');
    `;
    document.head.appendChild(gaScript);
    }
    // tslint:disable-next-line: deprecation
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe((event) => {
        if (environment.production) {
          const titledat = this.getChild(this.activatedRoute);
          titledat.data.subscribe((data) => {
            let user_id = null;
            user_id = this.appConfig.getLocalData("userId")
              ? this.appConfig.getLocalData("userId")
              : null;
            gtag("event", "page_view", {
              page_title: data?.title,
              page_location: window.location.href,
              page_path: this.router.url,
              user_id: user_id,
              // send_to: '<GA_MEASUREMENT_ID>'
            });
          });
        }

        if (event.id === 1 && event.url === event.urlAfterRedirects) {
          this.appConfig.clearLocalDataOne("profileData");
          //  ..... // here your code when page is refresh
        }
        console.log('eve', event);
        this.getScreenSize(event.url.includes('/candidate/'));
        this.checkIE();    
      });
  }

  ngOnInit() {
    this.listenToLoading();
    let token = this.appConfig.getLocalData("csrf-login");
    // token ? this.initSessionTimer() : '';
    // this.sessionTimeStartRxjs();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById("top");
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  sessionTimeStartRxjs() {
    this.sharedService.sessionTimeStartSubject.subscribe(
      (data: any) => {
        data && data == "start"
          ? this.initSessionTimer()
          : this.sessionHandlingDisabled();
      },
      (err) => {}
    );
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    if (this.appConfig.getLocalData("roles")) {
      if ((this.appConfig.getLocalData("roles") != 'candidate' || (this.appConfig.getLocalData("roles") == 'candidate' && event))) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        if (this.screenWidth < 1000 || this.screenHeight < 400) {
          // this.show = true;
          const data = {
            data: true,
            type: "resize",
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
  }
  
  @HostListener("window:mousemove", ["$event"])
  checkIE(event?) {
    const isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
    if (isIEOrEdge) {
      this.isIE = true;
      const data = {
        data: true,
        type: "browser",
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
      width: "auto",
      height: "auto",
      closeOnNavigation: false,
      autoFocus: false,
      disableClose: true,
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.screenBoolean = false;
      this.logOutApi();
      if (result) {
      }
    });
  }

  /**
   * Listen and display the loading spinner.
   */
  listenToLoading(): void {
    this.loadingService.isLoadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  initSessionTimer(): void {
    // Watcher on timer
    this.ngIdle.initilizeSessionTimeout();
    this.ngIdle.userIdlenessChecker.subscribe((status: string) => {
      this.initiateFirstTimer(status);
    });

    this.ngIdle.secondLevelUserIdleChecker.subscribe((status: string) => {
      this.initiateSecondTimer(status);
    });
  }

  initiateFirstTimer = (status: string) => {
    switch (status) {
      case "INITIATE_TIMER":
        break;

      case "RESET_TIMER":
        break;

      case "STOPPED_TIMER":
        this.showSendTimerDialog();
        break;

      default:
        // this.idleTimerLeft = this.formatTimeLeft(Number(status));
        break;
    }
  };

  initiateSecondTimer = (status: string) => {
    switch (status) {
      case "INITIATE_SECOND_TIMER":
        break;

      case "SECOND_TIMER_STARTED":
        break;

      case "SECOND_TIMER_STOPPED":
        this.logout();
        break;

      default:
        this.secondTimerLeft = status;
        break;
    }
  };

  showSendTimerDialog(): void {
    this.sessionDialog();
    // this.continue();
  }
  continue(): void {
    this.matDialog.closeAll();
    // stop second timer and initiate first timer again
    NgIdleService.runSecondTimer = false;
    this.ngIdle.initilizeSessionTimeout();
  }

  logout(): void {
    // stop all timer and end the session
    NgIdleService.runTimer = false;
    NgIdleService.runSecondTimer = false;
    this.matDialog.closeAll();
    this.logOutApi();
  }

  sessionHandlingDisabled() {
    NgIdleService.runTimer = false;
    NgIdleService.runSecondTimer = false;
  }

  sessionDialog() {
    this.sessionDialogRefPopup = this.matDialog.open(this.sessionDialogRef, {
      width: "auto",
      height: "auto",
      autoFocus: false,
      panelClass: "sessionAlertPopUp",
      disableClose: true,
    });
  }

  logOutApi() {
    const token = this.appConfig.getLocalData("logout-token");
    this.appConfig.clearLocalData();
    this.apiService.logout(token).subscribe(
      (data: any) => {
        this.matDialog.closeAll();
        this.appConfig.clearLocalData();
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
      },
      (err) => {
        this.matDialog.closeAll();
      }
    );
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
