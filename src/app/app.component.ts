import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from './services/api-service.service';
import { AppConfigService } from './config/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'udap-registration';

  constructor(
    private route: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService
  ) {
    // tslint:disable-next-line: deprecation
    this.appConfig.clearLocalDataOne('personalFormTouched');
    this.appConfig.clearLocalDataOne('educationalFormTouched');
    this.appConfig.clearLocalDataOne('familyFormTouched');
    this.appConfig.clearLocalDataOne('generalFormTouched');


    this.apiService.csrfToken().subscribe((data: any) => {
      console.log(data);
      // localStorage.setItem('csrf', data);
      this.appConfig.hideLoader();
    }, (err) => {
      if (err.status === 200) {
        this.appConfig.setSessionData('csrf', err.error.text);
      }
    });
  }
}
