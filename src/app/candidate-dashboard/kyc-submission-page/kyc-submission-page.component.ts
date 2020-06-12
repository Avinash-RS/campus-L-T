import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kyc-submission-page',
  templateUrl: './kyc-submission-page.component.html',
  styleUrls: ['./kyc-submission-page.component.scss']
})
export class KycSubmissionPageComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService,
    private route: Router
  ) { }

  ngOnInit() {
    this.appConfig.setLocalData('noGoBack', 'true');
  }

}
