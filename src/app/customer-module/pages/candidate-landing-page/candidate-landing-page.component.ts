import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidate-landing-page',
  templateUrl: './candidate-landing-page.component.html',
  styleUrls: ['./candidate-landing-page.component.scss']
})
export class CandidateLandingPageComponent implements OnInit, OnDestroy {

  references: any;
  getCampusReferencesSubscription: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private adminService: AdminServiceService
  ) { }

  ngOnInit() {
    this.getReferenceAPI();
  }

  getReferenceAPI() {
    this.getCampusReferencesSubscription = this.adminService.getCampusReferences().subscribe((res: any)=> {
      console.log('res', res);
    }, (err)=> {

    });
  }

  ngOnDestroy() {
    this.getCampusReferencesSubscription ? this.getCampusReferencesSubscription.unsubscribe() : '';
  }
}
