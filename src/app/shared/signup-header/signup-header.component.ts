import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-signup-header',
  templateUrl: './signup-header.component.html',
  styleUrls: ['./signup-header.component.scss']
})
export class SignupHeaderComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
  }

  home() {
    this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.HOME}`);
  }

}
