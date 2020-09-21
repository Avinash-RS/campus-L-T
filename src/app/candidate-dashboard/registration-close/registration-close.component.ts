import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-close',
  templateUrl: './registration-close.component.html',
  styleUrls: ['./registration-close.component.scss']
})
export class RegistrationCloseComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService,
    private route: Router) { }

  ngOnInit() {
    this.appConfig.setLocalData('noGoBack', 'true');
  }

}
