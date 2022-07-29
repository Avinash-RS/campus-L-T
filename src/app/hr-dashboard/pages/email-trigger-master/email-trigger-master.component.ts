import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-email-trigger-master',
  templateUrl: './email-trigger-master.component.html',
  styleUrls: ['./email-trigger-master.component.scss']
})
export class EmailTriggerMasterComponent implements OnInit {
  constructor(
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
