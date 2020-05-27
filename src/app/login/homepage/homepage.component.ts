import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(
    private router: Router,
    private appConfig: AppConfigService,
  ) { }

  ngOnInit() {
  }

  instituteRegister() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.REGISTER.INSTITUTE);
  }

  corporateRegister() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.REGISTER.CORPORATE);
  }

  candidateRegister() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.REGISTER.CANDIDATE);
  }


}
