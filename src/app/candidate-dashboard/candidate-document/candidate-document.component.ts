import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';

@Component({
  selector: 'app-candidate-document',
  templateUrl: './candidate-document.component.html',
  styleUrls: ['./candidate-document.component.scss']
})
export class CandidateDocumentComponent implements OnInit, AfterViewInit {

  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService) {
    const subWrapperMenus = [
      {
        icon: '',
        name: 'Document Upload',
        router: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.DOCUMENT_LIST
      }

    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
   }
}
