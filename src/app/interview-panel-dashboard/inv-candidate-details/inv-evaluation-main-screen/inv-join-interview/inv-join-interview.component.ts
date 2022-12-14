import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inv-join-interview',
  templateUrl: './inv-join-interview.component.html',
  styleUrls: ['./inv-join-interview.component.scss']
})
export class InvJoinInterviewComponent implements OnInit, OnChanges {

  @Input() passT0TabVideoInterview;
  queryParams: { data: any; id: any; name: any; status: any; tag: any; uid: any; email: any; form: any; };
  customerCode = this.appConfig.getSelectedCustomerCode();
  constructor(
    public appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.passT0TabVideoInterview) {
      this.editRouteParamGetter();
    }
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParams = {
        data: params['data'],
        id: params['id'],
        name: params['name'] ? params['name'] : '',
        status: params['status'],
        tag: params['tag'],
        uid: params['uid'],
        email: params['email'],
        form: params['form']
      };
    });
  }

}
