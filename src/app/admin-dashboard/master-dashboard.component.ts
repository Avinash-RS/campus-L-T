import { Component, OnInit, OnChanges } from '@angular/core';
import { AppConfigService } from '../config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { SharedServiceService } from '../services/shared-service.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

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

  public breadcrumbs: IBreadCrumb[]

  appConstant = CONSTANT.ENDPOINTS;
  subMenus: any;
  activeSubmenu;
  sidebarOpen;

  constructor( private appConfig: AppConfigService, private sharedService: SharedServiceService, 
                private router: Router, private activatedRoute: ActivatedRoute) {
    // Assigning sub menus for the current router
    this.sharedService.subMenuSubject.subscribe((data: any) => {
      this.subMenus = data;
    });
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit() {
    this.sidebarOpen = true;

    //breadcrumb
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
      ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
      })
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
    //If no routeConfig is avalailable we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if(isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = route.snapshot.params[paramName];
    }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadCrumb = {
        label: label,
        url: nextUrl,
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [ ...breadcrumbs, breadcrumb ] : [ ...breadcrumbs];
    if (route.firstChild) {
        //If we are not on our current path yet,
        //there will be more children to look after, to build our breadcumb
        return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

  sidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
