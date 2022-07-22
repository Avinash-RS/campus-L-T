import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-email-jobs-master',
  templateUrl: './email-jobs-master.component.html',
  styleUrls: ['./email-jobs-master.component.scss']
})
export class EmailJobsMasterComponent implements OnInit {

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
