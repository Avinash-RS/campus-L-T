import { Component, OnInit } from '@angular/core';
import { CONSTANT } from '../constants/app-constants.service';
import { AppConfigService } from '../config/app-config.service';
import { SharedServiceService } from '../services/shared-service.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged, timeout } from 'rxjs/operators';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-master-dashboard',
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.scss']
})
export class MasterDashboardComponent implements OnInit {

  // public breadcrumbs: IBreadCrumb[];
  breadcrumbs: Array<{ label: string; url: string }>;

  appConstant = CONSTANT.ENDPOINTS;
  sidebarOpen;
  subMenus: any;
  activeSubmenu;
  showProfileOnly = false;
  showDocuments = false;
  showJoiningForm: boolean;
  candidateSideMenu: any;
  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.appConfig.getLocalData('reDirectView') && this.appConfig.getLocalData('reDirectView') === 'false') {
      this.showProfileOnly = true;
    }
    if (this.appConfig.getLocalData('secondShortlist') && this.appConfig.getLocalData('secondShortlist') === 'true') {
      this.showDocuments = true;
    }
    if (this.appConfig.getLocalData('joiningFormAccess') && this.appConfig.getLocalData('joiningFormAccess') === 'true') {
      this.showJoiningForm = true;
    }

    // Assigning sub menus for the current router
    this.sharedService.subMenuSubject.subscribe((data: any) => {
      this.subMenus = data;
    });

    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    this.sendMenus();
  }

  sendMenus() {
    if (!this.showJoiningForm) {
      this.candidateSideMenu = [
        {
          url: this.appConstant.CANDIDATE_DASHBOARD.PROFILE,
          name: 'Profile',
          icon: 'assets/images/003-user.svg',
          hide: false
        }
      ]
      if (this.showDocuments) {
        let add = {
          url: this.appConstant.CANDIDATE_DASHBOARD.DOCUMENT,
          name: 'Documents',
          icon: 'assets/images/Page-1.svg',
          hide: false
        }
        this.candidateSideMenu.push(add);
      }
  }
  if (this.showJoiningForm) {
    this.candidateSideMenu = [
      {
        url: this.appConstant.CANDIDATE_DASHBOARD.JOINING,
        name: 'Joining Form',
        icon: 'assets/images/Page-1.svg',
        hide: false,
        click: true
      },
      // {
      //   url: this.appConstant.CANDIDATE_DASHBOARD.JOINING_FAQ,
      //   name: 'FAQ',
      //   icon: 'assets/images/Page-1.svg',
      //   hide: false
      // }
    ]
}

    //     <ul>
    //     <ng-container *ngIf="!showJoiningForm">
    //   <li [routerLink]="appConstant.CANDIDATE_DASHBOARD.PROFILE" routerLinkActive="active">
    //     <span><img src="assets/images/003-user.svg" width="20px" height="20px" alt=""></span>
    //     <span>Profile</span>
    //     <span>
    //       <img src="assets/images/arrow_right-black-18dp.svg" alt="" srcset="">
    //     </span>
    //   </li>
    //   <li [ngClass]="showDocuments ? '' : 'hide'" [routerLink]="appConstant.CANDIDATE_DASHBOARD.DOCUMENT" routerLinkActive="active">
    //     <span><img src="assets/images/Page-1.svg" width="20px" height="20px" alt=""></span>
    //     <span>Documents</span>
    //     <span>
    //       <img src="assets/images/arrow_right-black-18dp.svg" alt="" srcset="">
    //     </span>
    //   </li>
    // </ng-container>
    //   <li *ngIf="showJoiningForm" (click)="checkJoiningRoute()" [routerLink]="appConstant.CANDIDATE_DASHBOARD.JOINING" routerLinkActive="active">
    //     <span><img src="assets/images/Page-1.svg" width="20px" height="20px" alt=""></span>
    //     <span>Joining Form</span>
    //     <span>
    //       <img src="assets/images/arrow_right-black-18dp.svg" alt="" srcset="">
    //     </span>
    //   </li>
    //   <li *ngIf="showJoiningForm && false" [routerLink]="appConstant.CANDIDATE_DASHBOARD.JOINING_FAQ" routerLinkActive="active">
    //     <span><img src="assets/images/Page-1.svg" width="20px" height="20px" alt=""></span>
    //     <span>FAQ</span>
    //     <span>
    //       <img src="assets/images/arrow_right-black-18dp.svg" alt="" srcset="">
    //     </span>
    //   </li>

    // </ul>

  }
  ngOnInit() {
    this.sidebarOpen = true;

    // // breadcrumb
    // this.router.events.pipe(
    //   filter((event) => event instanceof NavigationEnd),
    //   distinctUntilChanged(),
    // ).subscribe(() => {
    //   this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    // });

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
                url: url
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


      this.rxjsSubjectForPrint();
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
    // If no routeConfig is avalailable we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

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

    const breadcrumb: IBreadCrumb = {
      label: label,
      url: nextUrl,
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

  sidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  rxjsSubjectForPrint() {
    this.sharedService.printSubject.subscribe((data: any)=> {
      this.sidebarOpen = false;
      setTimeout(() => {
        window.print();
      }, 1000);
      // this.sidebarOpen = true;
    }, (err)=> {

    });
  }

  checkJoiningRoute() {
    this.sharedService.joiningFormStepperStatus.next('dataFromMasterDashboard');
  }
}
