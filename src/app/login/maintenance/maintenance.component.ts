import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit, OnDestroy {

  mySub: Subscription;
  message: any;
  constructor(
    private sharedService: SharedServiceService
  ) { }

  ngOnInit() {
  }

  maintenanceSub() {
this.sharedService.maintenanceSubject.subscribe((data: any) => {
     
    this.message = data;
  }, (err)=> {

    });
  }

  ngOnDestroy() {
    // this.mySub.unsubscribe();
  }

}
