import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from './services/api-service.service';
import { AppConfigService } from './config/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'udap-registration';

  constructor(
    private route: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService
    ) {

      this.apiService.csrfToken().subscribe((data: any) => {
        // localStorage.setItem('csrf', data);
      }, (err) => {
        if (err.status === 200) {
          this.appConfig.setSessionData('csrf', err.error.text);
        }
      });
  }
}
