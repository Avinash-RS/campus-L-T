import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-email-verifier-error-page',
  templateUrl: './email-verifier-error-page.component.html',
  styleUrls: ['./email-verifier-error-page.component.scss']
})
export class EmailVerifierErrorPageComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
  }

  goToCandidateRegister() {
    this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.REGISTER.CANDIDATE}`);
  }

}
