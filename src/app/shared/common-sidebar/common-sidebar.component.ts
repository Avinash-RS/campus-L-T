import { Component, OnInit, Input } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged} from 'rxjs/operators';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-common-sidebar',
  templateUrl: './common-sidebar.component.html',
  styleUrls: ['./common-sidebar.component.scss']
})
export class CommonSidebarComponent implements OnInit {

  @Input() sideBar;
   // public breadcrumbs: IBreadCrumb[];
   breadcrumbs: Array<any>;

   appConstant = CONSTANT.ENDPOINTS;
   role = this.appConfig.getLocalData('roles');
   sidebarOpen;
   subMenus: any;
   activeSubmenu;
  showJoiningForm: boolean;

   constructor(
     private appConfig: AppConfigService,
     private sharedService: SharedServiceService,
     private router: Router,
     private activatedRoute: ActivatedRoute) {
     // Assigning sub menus for the current router
     this.sharedService.subMenuSubject.subscribe((data: any) => {
       this.subMenus = data;
     });
     setTimeout(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
     }, 1000);
   }

   ngOnInit() {
     this.sidebarOpen = true;

     // // breadcrumb
     // this.router.events.pipe(
     //   filter((event) => event instanceof NavigationEnd),
     //   distinctUntilChanged(),
     // ).subscribe(() => {
     //   this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
     //   // console.log(this.breadcrumbs);

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
              //  console.log('bb', this.breadcrumbs);
               currentRoute = route;
               // }
             }
           });
         } while (currentRoute);
       });
       this.rxjsSubjectForPrint();
       this.checkJoiningComponentNeeded();
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


   // Configuration for candidate role

   checkJoiningComponentNeeded() {
    if (this.appConfig.getLocalData('joiningFormAccess') && this.appConfig.getLocalData('joiningFormAccess') === 'true') {
      this.showJoiningForm = true;
    }
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
