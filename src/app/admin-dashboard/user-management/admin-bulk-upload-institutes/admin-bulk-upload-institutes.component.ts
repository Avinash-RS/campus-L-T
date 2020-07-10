import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-admin-bulk-upload-institutes',
  templateUrl: './admin-bulk-upload-institutes.component.html',
  styleUrls: ['./admin-bulk-upload-institutes.component.scss']
})
export class AdminBulkUploadInstitutesComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor() { }

  ngOnInit() {
  }

}
