import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-admin-bulk-upload-candidates',
  templateUrl: './admin-bulk-upload-candidates.component.html',
  styleUrls: ['./admin-bulk-upload-candidates.component.scss']
})
export class AdminBulkUploadCandidatesComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor() { }

  ngOnInit() {
  }

}
