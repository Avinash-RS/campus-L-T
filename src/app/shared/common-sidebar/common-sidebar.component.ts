import { Component, OnInit, Input, AfterViewInit, HostListener } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged} from 'rxjs/operators';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { ScreenresolutionBoxComponent } from '../screenresolution-box/screenresolution-box.component';
import { ApiServiceService } from 'src/app/services/api-service.service';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-common-sidebar',
  templateUrl: './common-sidebar.component.html',
  styleUrls: ['./common-sidebar.component.scss']
})
export class CommonSidebarComponent implements OnInit, AfterViewInit {

  @Input() sideBar;
  screenHeight;
  screenWidth;
  screenBoolean = false;
  isIE = false;

   // public breadcrumbs: IBreadCrumb[];
   breadcrumbs: Array<any>;

   appConstant = CONSTANT.ENDPOINTS;
   role = this.appConfig.getLocalData('roles');
   sidebarOpen;
   subMenus: any;
   activeSubmenu;
  driveList: any;
  activeDriveId: any;

   constructor(
     public appConfig: AppConfigService,
     private sharedService: SharedServiceService,
     private router: Router,
     private candidateService: CandidateMappersService,
     private matDialog: MatDialog,
     private apiService: ApiServiceService,
     private activatedRoute: ActivatedRoute) {
     // Assigning sub menus for the current router
     this.sharedService.subMenuSubject.subscribe((data: any) => {
       this.subMenus = data;
     });
     setTimeout(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    }, 1000);
   }

   ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
}

@HostListener("window:resize", ["$event"])
getScreenSize(event?) {
  if (this.appConfig.getLocalData("roles")) {
    if (environment.production || true) {
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

getDriveList() {
  let drive = this.appConfig.getLocalData('driveList');
  this.driveList = drive ? JSON.parse(drive) : [];
  this.activeDriveId = this.appConfig.getDriveId() ? Number(this.appConfig.getDriveId()) : null;
 }

 driveChanged(e) {
  this.activeDriveId = e;
  this.appConfig.setLocalData('driveId', this.activeDriveId);
  let currentUrl = this.router.url;
  if (this.role != 'candidate' && this.role != 'interview_panel') {
    if (currentUrl.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_PANEL_EVALUATION)) {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED);
    } else {
      this.sharedService.screenRefreshOnDriveChange.next(currentUrl);
    }
  }
  if (this.role == 'interview_panel') {
    if (currentUrl.includes(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION)) {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST);
    } else {
      this.sharedService.screenRefreshOnDriveChange.next(currentUrl);
    }
  }
 }

   ngOnInit() {
    this.getScreenSize();
    this.checkIE();
     this.sidebarOpen = true;

     this.router.events
       .pipe(filter(event => event instanceof NavigationEnd))
       .subscribe(event => {
         this.breadcrumbs = [];
         let currentRoute = this.activatedRoute.root,
           url = "";
         do {
           const childrenRoutes = currentRoute.children;
           currentRoute = null;

           childrenRoutes.forEach(route => {
             if (route.outlet === "primary") {

               const routeSnapshot = route.snapshot;

               url +=
                 "/" + routeSnapshot.url.map(segment => segment.path);
               // if (route.snapshot.data.breadcrumb !== undefined) {
               this.breadcrumbs.push({
                 label: route.snapshot.data.breadcrumb,
                 url: url,
                 params: route.snapshot.queryParams ? route.snapshot.queryParams : ''
               });
               const updateUrl = [];
               this.breadcrumbs.forEach(element => {
                 if (element['label']) {
                   updateUrl.push(element);
                 }
               });
               this.breadcrumbs = updateUrl;
               currentRoute = route;
               // }
             }
           });
         } while (currentRoute);
       });
       this.getDriveList();
      }

   buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): any[] {
     // If no routeConfig is avalailable we are on the root path

     let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
     let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';
     let param = route.snapshot && route.snapshot['queryParams'] ? route.snapshot['queryParams'] : '';

     // If the route is dynamic route such as ':id', remove it
     const lastRoutePart = path.split('/').pop();
     const isDynamicRoute = lastRoutePart.startsWith(':');
     if (isDynamicRoute && !!route.snapshot) {
       const paramName = lastRoutePart.split(':')[1];
       path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
       label = route.snapshot.params[paramName];
     }

     // In the routeConfig the complete path is not available,
     // so we rebuild it each time
     const nextUrl = path ? `${url}/${path}` : url;

     const breadcrumb: any = {
       label: label,
       url: nextUrl,
       params: param
     };
     // Only adding route with non-empty label
     const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
     if (route.firstChild) {
       // If we are not on our current path yet,
       // there will be more children to look after, to build our breadcumb
       let mainPath = '';
       if (breadcrumb?.label) {
       const dum = this.router.url.startsWith('/') ? this.router.url.substring(1) : '';
       const index = dum.indexOf('/');
       const slice = dum.slice(0, index);
       mainPath = nextUrl.includes('//') ? '' : `/${slice}/`;
     }
       return this.buildBreadCrumb(route.firstChild, (mainPath + nextUrl), newBreadcrumbs);
     }
     return newBreadcrumbs;
   }

   sidebar() {
     this.sidebarOpen = !this.sidebarOpen;
   }

  checkJoiningRoute() {
    this.sharedService.joiningFormStepperStatus.next('dataFromMasterDashboard');
  }

  checkJoining() {
    return this.candidateService.checkKycOrJoiningForm() ? 'Joining Form' : 'Profile Form';
  }

}
