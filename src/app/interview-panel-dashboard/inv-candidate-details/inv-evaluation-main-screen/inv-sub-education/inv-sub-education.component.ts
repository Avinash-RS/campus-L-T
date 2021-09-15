import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inv-sub-education',
  templateUrl: './inv-sub-education.component.html',
  styleUrls: ['./inv-sub-education.component.scss']
})
export class InvSubEducationComponent implements OnInit {


  queryParams: any;
  profileViewData: { candidate_user_id: any; candidateName: any; documents: boolean; documentsOnly: boolean; };

  constructor(
    private sharedService: SharedServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    // // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
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
      this.profileViewData = {
        candidate_user_id: params['uid'],
        candidateName: params['name'],
        documents: true,
        documentsOnly: true
      }
    });
  }

}
