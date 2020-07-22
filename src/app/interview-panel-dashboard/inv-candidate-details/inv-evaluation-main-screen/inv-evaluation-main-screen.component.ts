import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-inv-evaluation-main-screen',
  templateUrl: './inv-evaluation-main-screen.component.html',
  styleUrls: ['./inv-evaluation-main-screen.component.scss']
})
export class InvEvaluationMainScreenComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: 'work.svg',
        name: 'Shortlisted candidate',
        router: CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
