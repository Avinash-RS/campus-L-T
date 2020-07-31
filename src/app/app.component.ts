import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router, NavigationStart, NavigationEnd,
  NavigationCancel, NavigationError, Event, ResolveEnd
} from '@angular/router';
import { ApiServiceService } from './services/api-service.service';
import { AppConfigService } from './config/app-config.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'udap-registration';
  showLoadingIndicator = true;

  titles = 'connectionDetector';
  status = 'ONLINE';
  // initializing as online by default
  isConnected = true;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService,
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
    // this.connectionStatusMethod();
  }

  connectionStatusMethod() {
    // Get the online/offline status from browser window
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
      alert(this.status);
    });
  }

ngOnDestroy(): void {
  // Unsubscribe all subscriptions to avoid memory leak
  this.subscriptions.forEach(subscription => subscription.unsubscribe());
}
}
