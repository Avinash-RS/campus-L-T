import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inv-sub-employment',
  templateUrl: './inv-sub-employment.component.html',
  styleUrls: ['./inv-sub-employment.component.scss']
})
export class InvSubEmploymentComponent implements OnInit, OnChanges {
  customerCode = this.appConfig.getSelectedCustomerCode();
  @Input() passT0TabProfile;
  appConstant = CONSTANT.ENDPOINTS;
  nameOfAssessment: any;
  candidateId: any;
  certificateArr: any;
  candidateName: any;
  uid:any;
  queryParams: any;
  profileViewData: any;

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.passT0TabProfile) {
      this.editRouteParamGetter();
    }
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
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
      this.profileViewData = {
        candidate_user_id: params['uid'],
        candidateName: params['name'],
        documents: true,
      }
      this.candidateId = params['id'];
      this.candidateName = params['name'];
      this.uid = params['uid']
    });
  }

}
